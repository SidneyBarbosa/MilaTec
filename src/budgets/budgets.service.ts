import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AirtableService } from '../airtable/airtable.service';
import { CompanyService } from '../company/company.service';

@Injectable()
export class BudgetsService {
  private readonly logger = new Logger(BudgetsService.name);

  constructor(
    private readonly airtableService: AirtableService,
    private readonly companyService: CompanyService,
  ) {}

  /* Lista todos os orçamentos vinculados à empresa do usuário autenticado. */
  async findAllByUserEmail(email: string) {
    try {
      const { company } = await this.companyService.findCompanyByUserEmail(
        email,
      );

      // Busca orçamentos vinculados à empresa (campo "Empresa" é linked record)
      const allBudgets = await this.airtableService.getRecords('Orçamentos');

      const companyBudgets = allBudgets.filter((budget) => {
        const empresaIds = budget['Empresa'];
        return Array.isArray(empresaIds) && empresaIds.includes(company.id);
      });

      return companyBudgets.map((budget) => this.mapBudget(budget));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Erro ao listar orçamentos: ${error.message}`);
      throw new InternalServerErrorException(
        'Erro ao buscar orçamentos. Tente novamente.',
      );
    }
  }

  /* Busca um orçamento específico pelo ID, validando se pertence à empresa do usuário. */
  async findOneByUserEmail(email: string, budgetId: string) {
    try {
      const { company } = await this.companyService.findCompanyByUserEmail(
        email,
      );

      const budget = await this.airtableService.getRecordById(
        'Orçamentos',
        budgetId,
      );

      // Valida se o orçamento pertence à empresa do usuário
      const empresaIds = budget['Empresa'];
      if (
        !Array.isArray(empresaIds) ||
        !empresaIds.includes(company.id)
      ) {
        throw new NotFoundException(
          'Orçamento não encontrado ou não pertence à sua empresa.',
        );
      }

      return this.mapBudget(budget);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Erro ao buscar orçamento: ${error.message}`);
      throw new InternalServerErrorException(
        'Erro ao buscar orçamento. Tente novamente.',
      );
    }
  }

  /* Normaliza os dados de um orçamento para o formato esperado pelo frontend. */
  private mapBudget(budget: any) {
    return {
      id: budget.id,
      product: budget['Produto'] || 'Informação em atualização',
      value: budget['Valor'] || null,
      budgetType: budget['Tipo de orçamento'] || null,
      stage: budget['Etapa do negócio'] || 'Informação em atualização',
      closingDate: budget['Data de fechamento'] || null,
      creationDate: budget['Data de criação'] || null,
      city: budget['Cidade da obra'] || null,
      sentByClient: budget['Enviado pelo cliente'] || null,
      linkedProjects: budget['Projetos'] || [],
      linkedDeliveries: budget['Entregas'] || [],
    };
  }
}