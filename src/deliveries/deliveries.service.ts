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
      const { budgetIds } = await this.companyService.getCompanyBudgetIds(email);

      if (budgetIds.length === 0) return [];

      const formula = this.airtableService.buildLinkedRecordFilter(
        'Orçamentos',
        budgetIds,
      );

      const deliveries = await this.airtableService.getRecords('Entregas', {
        filterByFormula: formula,
      });

      return deliveries.map((delivery) => this.mapDelivery(delivery));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Erro ao listar entregas: ${error.message}`);
      throw new InternalServerErrorException('Erro ao buscar entregas.');
    }
  }

  async findOneByUserEmail(email: string, deliveryId: string) {
    try {
      const { budgetIds } = await this.companyService.getCompanyBudgetIds(email);
      const delivery = await this.airtableService.getRecordById('Entregas', deliveryId);

      const deliveryBudgetIds = delivery['Orçamentos'] || [];
      const belongsToCompany = deliveryBudgetIds.some((id) => budgetIds.includes(id));

      if (!belongsToCompany) {
        throw new NotFoundException(
          'Entrega não encontrada ou não pertence à sua empresa.',
        );
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