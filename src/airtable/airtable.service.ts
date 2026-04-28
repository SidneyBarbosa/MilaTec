import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const Airtable = require('airtable');

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
     Usa LOWER() e TRIM() na fórmula para evitar bloqueios por
     case sensitivity e espaços invisíveis. */
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
      this.logger.error(
        `Erro ao buscar contato no Airtable: ${error.message}`,
      );
      throw error;
    }
  }

  /* Método genérico para buscar registros em qualquer tabela.
    Será usado nos próximos módulos (Orçamentos, Projetos, Entregas). */
  async getRecords(
    tableName: string,
    filterFormula?: string,
  ): Promise<any[]> {
    try {
      const selectOptions: any = {};
      if (filterFormula) {
        selectOptions.filterByFormula = filterFormula;
      }

      const records = await this.base(tableName)
        .select(selectOptions)
        .all();

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

  /* Busca um registro específico pelo ID do Airtable. */
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
}