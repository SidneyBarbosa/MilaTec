import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AirtableService } from '../airtable/airtable.service';
import { CompanyService } from '../company/company.service';

@Injectable()
export class DeliveriesService {
  private readonly logger = new Logger(DeliveriesService.name);

  constructor(
    private readonly airtableService: AirtableService,
    private readonly companyService: CompanyService,
  ) {}

  async findAllByUserEmail(email: string) {
    try {
      const { company } = await this.companyService.findCompanyByUserEmail(email);

      /* Entregas se vinculam à empresa via Orçamentos.
         Primeiro pegamos os IDs dos orçamentos da empresa. */
      const companyBudgets = await this.airtableService.getRecords('Orçamentos');
      const companyBudgetIds = companyBudgets
        .filter((b) => Array.isArray(b['Empresa']) && b['Empresa'].includes(company.id))
        .map((b) => b.id);

      /* Depois filtramos as entregas que pertencem a esses orçamentos. */
      const allDeliveries = await this.airtableService.getRecords('Entregas');
      const companyDeliveries = allDeliveries.filter((delivery) => {
        const budgetIds = delivery['Orçamentos'];
        return (
          Array.isArray(budgetIds) &&
          budgetIds.some((id) => companyBudgetIds.includes(id))
        );
      });

      return companyDeliveries.map((delivery) => this.mapDelivery(delivery));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Erro ao listar entregas: ${error.message}`);
      throw new InternalServerErrorException('Erro ao buscar entregas.');
    }
  }

  async findOneByUserEmail(email: string, deliveryId: string) {
    try {
      const { company } = await this.companyService.findCompanyByUserEmail(email);
      const delivery = await this.airtableService.getRecordById('Entregas', deliveryId);

      /* Validação de ownership: a entrega precisa pertencer a um orçamento da empresa */
      const budgetIds = delivery['Orçamentos'] || [];
      const companyBudgets = await this.airtableService.getRecords('Orçamentos');
      const companyBudgetIds = companyBudgets
        .filter((b) => Array.isArray(b['Empresa']) && b['Empresa'].includes(company.id))
        .map((b) => b.id);

      const belongsToCompany = budgetIds.some((id) => companyBudgetIds.includes(id));
      if (!belongsToCompany) {
        throw new NotFoundException('Entrega não encontrada ou não pertence à sua empresa.');
      }

      return this.mapDelivery(delivery);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Erro ao buscar entrega: ${error.message}`);
      throw new InternalServerErrorException('Erro ao buscar entrega.');
    }
  }

  private mapDelivery(delivery: any) {
    return {
      id: delivery.id,
      stage: delivery['Etapa de entrega'] || 'Informação em atualização',
      value: delivery['Valor'] || null,
      city: delivery['Cidade da obra'] || null,
      deliveryDate: delivery['Data de entrega'] || null,
      quantity: delivery['Quantidade'] || null,
      transport: delivery['Transporte'] || null,
      realizedValue: delivery['Valor entrega realizada'] || null,
      shippingNote: delivery['Romaneio de entrega'] || null,
      linkedBudgets: delivery['Orçamentos'] || [],
    };
  }
}