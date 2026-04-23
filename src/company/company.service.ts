import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { AirtableService } from '../airtable/airtable.service';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(private readonly airtableService: AirtableService) {}

  /* Busca a empresa vinculada ao e-mail autenticado.
     Fluxo: Contatos (filtro por e-mail) -> Empresa (linked record) -> dados completos */
  async findCompanyByUserEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // 1. Busca o contato completo pelo e-mail
      const contact = await this.airtableService.getRecords(
        'Contatos',
        `LOWER({E-mail}) = "${normalizedEmail}"`,
      );

      if (!contact || contact.length === 0) {
        throw new NotFoundException(
          'Contato não encontrado na base MilaTec.',
        );
      }

      const userContact = contact[0];

      // 2. O campo "Empresa" no Airtable é um linked record (array de IDs)
      const empresaIds = userContact['Empresa'];

      if (!empresaIds || empresaIds.length === 0) {
        throw new NotFoundException(
          'Este contato não possui empresa vinculada.',
        );
      }

      // 3. Busca os dados completos da empresa vinculada
      const empresaId = empresaIds[0];
      const empresa = await this.airtableService.getRecordById(
        'Empresas',
        empresaId,
      );

      // 4. Retorna o DTO consolidado
      return {
        company: {
          id: empresa.id,
          name: empresa['Empresa'] || 'Empresa não informada',
          cnpj: empresa['CNPJ'] || null,
          state: empresa['Estado'] || null,
          lifecycleStage: empresa['Fase do ciclo de vida'] || null,
        },
        contact: {
          id: userContact.id,
          name: userContact['Nome completo'] || null,
          email: userContact['E-mail'] || null,
          role: userContact['Cargo'] || null,
          phone: userContact['Número de telefone'] || null,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Erro ao buscar empresa: ${error.message}`);
      throw new InternalServerErrorException(
        'Erro ao buscar dados da empresa. Tente novamente.',
      );
    }
  }
}