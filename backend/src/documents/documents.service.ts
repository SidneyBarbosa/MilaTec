import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AirtableService } from '../airtable/airtable.service';
import { CompanyService } from '../company/company.service';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  // Mapeamento centralizado dos campos de anexo por tabela
  private readonly attachmentFields = {
    Orçamentos: [
      { field: 'Nota Fiscal (anexo)', category: 'Nota Fiscal' },
      { field: 'Proposta comercial (anexo)', category: 'Proposta Comercial' },
      { field: 'Pedido de Compra (anexo)', category: 'Pedido de Compra' },
    ],
    Instalações: [
      { field: 'Contrato instalação (anexo)', category: 'Contrato de Instalação' },
      { field: 'Nota fiscal de instalação (...)', category: 'Nota Fiscal de Instalação' },
      { field: 'Contrato (anexo)', category: 'Contrato' },
      { field: 'CNPJ & CND (anexo)', category: 'CNPJ e CND' },
      { field: 'ART', category: 'ART' },
    ],
    Entregas: [
      { field: 'Romaneio de entrega (anexo)', category: 'Romaneio de Entrega' },
    ],
  };

  constructor(
    private readonly airtableService: AirtableService,
    private readonly companyService: CompanyService,
  ) {}

  async findAllByUserEmail(email: string) {
    try {
      const { companyName } = await this.companyService.getCompanyContext(email);

      // 1. Busca os orçamentos da empresa (com fórmula nativa do Airtable)
      const budgetFormula = this.airtableService.buildLinkedRecordFilter(
        'Empresa',
        [companyName],
      );

      const companyBudgets = await this.airtableService.getRecords('Orçamentos', {
        filterByFormula: budgetFormula,
      });

      if (companyBudgets.length === 0) {
        return { total: 0, documents: [] };
      }

      const companyBudgetIds = companyBudgets.map((b) => b.id);

      // 2. Extrai IDs de entregas vinculadas aos orçamentos
      const deliveryIds = [
        ...new Set(
          companyBudgets.flatMap((b) =>
            Array.isArray(b['Entregas']) ? b['Entregas'] : [],
          ),
        ),
      ];

      // 3. Busca em paralelo: entregas pelos IDs e instalações filtrando no Node
      const [companyDeliveries, allInstallations] = await Promise.all([
        deliveryIds.length > 0
          ? Promise.all(
              deliveryIds.map((id) =>
                this.airtableService.getRecordById('Entregas', id),
              ),
            )
          : Promise.resolve([]),
        this.airtableService.getRecords('Instalações'),
      ]);

      // Filtra instalações que pertencem à empresa
      const companyInstallations = allInstallations.filter((inst) => {
        const budgetIds = inst['Orçamentos'];
        return (
          Array.isArray(budgetIds) &&
          budgetIds.some((id) => companyBudgetIds.includes(id))
        );
      });

      // 4. Extrai todos os documentos das três fontes
      const allDocuments = [
        ...this.extractDocuments(companyBudgets, 'Orçamentos'),
        ...this.extractDocuments(companyInstallations, 'Instalações'),
        ...this.extractDocuments(companyDeliveries, 'Entregas'),
      ];

      return {
        total: allDocuments.length,
        documents: allDocuments,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Erro ao listar documentos: ${error.message}`);
      throw new InternalServerErrorException('Erro ao buscar documentos.');
    }
  }

  /**
   * Extrai anexos de registros usando o mapeamento centralizado.
   */
  private extractDocuments(records: any[], tableName: string) {
    const fields = this.attachmentFields[tableName] || [];
    const documents: any[] = [];

    records.forEach((record) => {
      fields.forEach(({ field, category }) => {
        const attachments = record[field];
        if (Array.isArray(attachments) && attachments.length > 0) {
          attachments.forEach((att: any) => {
            documents.push({
              id: att.id,
              filename: att.filename || 'arquivo-sem-nome',
              url: att.url,
              size: att.size || null,
              type: att.type || null,
              category,
              source: tableName,
              recordId: record.id,
            });
          });
        }
      });
    });

    return documents;
  }
}