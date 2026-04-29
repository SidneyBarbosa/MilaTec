import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AirtableService } from '../airtable/airtable.service';
import { CompanyService } from '../company/company.service';

@Injectable()
export class InstallationsService {
  private readonly logger = new Logger(InstallationsService.name);

  constructor(
    private readonly airtableService: AirtableService,
    private readonly companyService: CompanyService,
  ) {}

  async findAllByUserEmail(email: string) {
    try {
      const { company } = await this.companyService.findCompanyByUserEmail(email);

      /* Instalações se vinculam à empresa via Orçamentos. */
      const companyBudgets = await this.airtableService.getRecords('Orçamentos');
      const companyBudgetIds = companyBudgets
        .filter((b) => Array.isArray(b['Empresa']) && b['Empresa'].includes(company.id))
        .map((b) => b.id);

      const allInstallations = await this.airtableService.getRecords('Instalações');
      const companyInstallations = allInstallations.filter((installation) => {
        const budgetIds = installation['Orçamentos'];
        return (
          Array.isArray(budgetIds) &&
          budgetIds.some((id) => companyBudgetIds.includes(id))
        );
      });

      return companyInstallations.map((inst) => this.mapInstallation(inst));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Erro ao listar instalações: ${error.message}`);
      throw new InternalServerErrorException('Erro ao buscar instalações.');
    }
  }

  async findOneByUserEmail(email: string, installationId: string) {
    try {
      const { company } = await this.companyService.findCompanyByUserEmail(email);
      const installation = await this.airtableService.getRecordById(
        'Instalações',
        installationId,
      );

      /* Validação de ownership: instalação precisa pertencer a um orçamento da empresa */
      const budgetIds = installation['Orçamentos'] || [];
      const companyBudgets = await this.airtableService.getRecords('Orçamentos');
      const companyBudgetIds = companyBudgets
        .filter((b) => Array.isArray(b['Empresa']) && b['Empresa'].includes(company.id))
        .map((b) => b.id);

      const belongsToCompany = budgetIds.some((id) => companyBudgetIds.includes(id));
      if (!belongsToCompany) {
        throw new NotFoundException('Instalação não encontrada ou não pertence à sua empresa.');
      }

      return this.mapInstallation(installation);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Erro ao buscar instalação: ${error.message}`);
      throw new InternalServerErrorException('Erro ao buscar instalação.');
    }
  }

  private mapInstallation(installation: any) {
    return {
      id: installation.id,
      serviceType: installation['Tipo de serviço'] || 'Informação em atualização',
      startDate: installation['Data de início'] || null,
      endDate: installation['Data de fim'] || null,
      assemblyDetails: installation['Detalhes da montagem'] || null,
      deliveryAddress: installation['Endereço de entrega (from Orçamentos)'] || null,
      city: installation['Cidade da obra (from Orçamentos)'] || null,
      programmedDays: installation['Nº dias programados'] || null,
      executedDays: installation['Nº dias executados'] || null,
      expenses: installation['Despesas'] || null,
      accountClosing: installation['Fechamento de contas'] || null,
      totalSpent: installation['Valor Total Gasto'] || null,
      installationId: installation['Instalação ID'] || null,
      linkedBudgets: installation['Orçamentos'] || [],
    };
  }
}