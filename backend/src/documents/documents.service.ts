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

  /* Mapeamento centralizado dos campos de anexo por tabela */
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
      const { budgetIds } = await this.companyService.getCompanyBudgetIds(email);

      if (budgetIds.length === 0) {
        return { total: 0, documents: [] };
      }

      /* Busca paralela das três fontes, todas já filtradas no Airtable */
      const formula = this.airtableService.buildLinkedRecordFilter(
        'Orçamentos',
        budgetIds,
      );

      const [orcamentos, instalacoes, entregas] = await Promise.all([
        this.airtableService.getRecords('Orçamentos', {
          filterByFormula: this.airtableService.buildLinkedRecordFilter(
            'Empresa',
            [(await this.companyService.getCompanyContext(email)).companyName],
          ),
        }),
        this.airtableService.getRecords('Instalações', { filterByFormula: formula }),
        this.airtableService.getRecords('Entregas', { filterByFormula: formula }),
      ]);

      const allDocuments = [
        ...this.extractDocuments(orcamentos, 'Orçamentos'),
        ...this.extractDocuments(instalacoes, 'Instalações'),
        ...this.extractDocuments(entregas, 'Entregas'),
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

  /* Extrai anexos de registros de uma tabela usando o mapeamento centralizado. */
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