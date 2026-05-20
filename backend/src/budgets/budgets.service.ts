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

  async findAllByUserEmail(email: string) {
    try {
      const { companyName } = await this.companyService.getCompanyContext(email);

      /* Filtro direto no Airtable - traz apenas orçamentos da empresa */
      const formula = this.airtableService.buildLinkedRecordFilter(
        'Empresa',
        [companyName],
      );

      const budgets = await this.airtableService.getRecords('Orçamentos', {
        filterByFormula: formula,
      });

      return budgets.map((budget) => this.mapBudget(budget));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Erro ao listar orçamentos: ${error.message}`);
      throw new InternalServerErrorException('Erro ao buscar orçamentos.');
    }
  }

  async findOneByUserEmail(email: string, budgetId: string) {
    try {
      const { companyId } = await this.companyService.getCompanyContext(email);
      const budget = await this.airtableService.getRecordById('Orçamentos', budgetId);

      /* Validação de ownership */
      const empresaIds = budget['Empresa'];
      if (!Array.isArray(empresaIds) || !empresaIds.includes(companyId)) {
        throw new NotFoundException(
          'Orçamento não encontrado ou não pertence à sua empresa.',
        );
      }

      return this.mapBudget(budget);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Erro ao buscar orçamento: ${error.message}`);
      throw new InternalServerErrorException('Erro ao buscar orçamento.');
    }
  }

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