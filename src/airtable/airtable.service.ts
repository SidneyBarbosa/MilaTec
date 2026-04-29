import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const Airtable = require('airtable');

interface QueryOptions {
  filterByFormula?: string;
  fields?: string[];
  maxRecords?: number;
  sort?: { field: string; direction?: 'asc' | 'desc' }[];
}

@Injectable()
export class AirtableService implements OnModuleInit {
  private readonly logger = new Logger(AirtableService.name);
  private base: any;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('AIRTABLE_API_KEY');
    const baseId = this.configService.get<string>('AIRTABLE_BASE_ID');

    if (!apiKey || !baseId) {
      this.logger.error(
        'AIRTABLE_API_KEY ou AIRTABLE_BASE_ID não configurados no .env',
      );
      return;
    }

    Airtable.configure({ apiKey });
    this.base = Airtable.base(baseId);
    this.logger.log('Conexão com Airtable inicializada com sucesso.');
  }

  /* Busca um contato pelo e-mail na tabela "Contatos".
     Usa LOWER() na fórmula para evitar bloqueios por case sensitivity. */
  async findContactByEmail(email: string): Promise<any | null> {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const records = await this.base('Contatos')
        .select({
          filterByFormula: `LOWER({E-mail}) = "${normalizedEmail}"`,
          maxRecords: 1,
        })
        .firstPage();

      if (!records || records.length === 0) {
        return null;
      }

      const record = records[0];
      return {
        id: record.id,
        email: record.get('E-mail'),
        nomeCompleto: record.get('Nome completo'),
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar contato no Airtable: ${error.message}`);
      throw error;
    }
  }

  /* Busca registros de uma tabela com opções avançadas.
     Aceita fórmulas, seleção de campos, ordenação e limite. */
  async getRecords(tableName: string, options: QueryOptions = {}): Promise<any[]> {
    try {
      const selectOptions: any = {};

      if (options.filterByFormula) {
        selectOptions.filterByFormula = options.filterByFormula;
      }
      if (options.fields && options.fields.length > 0) {
        selectOptions.fields = options.fields;
      }
      if (options.maxRecords) {
        selectOptions.maxRecords = options.maxRecords;
      }
      if (options.sort) {
        selectOptions.sort = options.sort;
      }

      const records = await this.base(tableName).select(selectOptions).all();

      return records.map((record: any) => ({
        id: record.id,
        ...record.fields,
      }));
    } catch (error) {
      this.logger.error(
        `Erro ao buscar registros na tabela ${tableName}: ${error.message}`,
      );
      throw error;
    }
  }

  /* Busca um registro específico pelo ID. */
  async getRecordById(tableName: string, recordId: string): Promise<any> {
    try {
      const record = await this.base(tableName).find(recordId);
      return {
        id: record.id,
        ...record.fields,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao buscar registro ${recordId} na tabela ${tableName}: ${error.message}`,
      );
      throw error;
    }
  }

  /* Helper para buscar registros vinculados a um conjunto de IDs.
     Útil para filtrar por linked records (ex: orçamentos vinculados a uma empresa).
     Como o Airtable não suporta filtrar diretamente por record IDs em linked fields,
     usamos a função SEARCH() na representação textual do campo. */
  buildLinkedRecordFilter(fieldName: string, names: string[]): string {
    if (!names || names.length === 0) return 'FALSE()';

    const conditions = names.map(
      (name) => `SEARCH("${this.escapeString(name)}", ARRAYJOIN({${fieldName}}))`,
    );

    return conditions.length === 1
      ? conditions[0]
      : `OR(${conditions.join(', ')})`;
  }

  /* Escapa aspas em strings para uso seguro em fórmulas do Airtable. */
  private escapeString(str: string): string {
    return str.replace(/"/g, '\\"');
  }
}