import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AirtableService } from '../airtable/airtable.service';
import { CompanyService } from '../company/company.service';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    private readonly airtableService: AirtableService,
    private readonly companyService: CompanyService,
  ) {}

  async findAllByUserEmail(email: string) {
    try {
      const { budgetIds } = await this.companyService.getCompanyBudgetIds(email);

      if (budgetIds.length === 0) return [];

      /* Busca direta no Airtable: apenas projetos vinculados aos orçamentos da empresa */
      const formula = this.airtableService.buildLinkedRecordFilter(
        'Orçamentos',
        budgetIds,
      );

      const projects = await this.airtableService.getRecords('Projetos', {
        filterByFormula: formula,
      });

      return projects.map((project) => this.mapProject(project));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Erro ao listar projetos: ${error.message}`);
      throw new InternalServerErrorException('Erro ao buscar projetos.');
    }
  }

  async findOneByUserEmail(email: string, projectId: string) {
    try {
      const { budgetIds } = await this.companyService.getCompanyBudgetIds(email);
      const project = await this.airtableService.getRecordById('Projetos', projectId);

      const projectBudgetIds = project['Orçamentos'] || [];
      const belongsToCompany = projectBudgetIds.some((id) => budgetIds.includes(id));

      if (!belongsToCompany) {
        throw new NotFoundException(
          'Projeto não encontrado ou não pertence à sua empresa.',
        );
      }

      return this.mapProject(project);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Erro ao buscar projeto: ${error.message}`);
      throw new InternalServerErrorException('Erro ao buscar projeto.');
    }
  }

  private mapProject(project: any) {
    return {
      id: project.id,
      name: project['Projeto'] || 'Informação em atualização',
      stage: project['Etapa do projeto'] || 'Informação em atualização',
      budgetType: project['Tipo de orçamento'] || null,
      complexity: project['Complexidade'] || null,
      sentByClient: project['Enviado pelo cliente'] || null,
      milatecProject: project['Projeto Milatec'] || null,
      executiveProject: project['Projeto executivo'] || null,
      weight: project['Peso do projeto (kg)'] || null,
      linkedBudgets: project['Orçamentos'] || [],
      linkedDeliveries: project['Entregas'] || [],
    };
  }
}