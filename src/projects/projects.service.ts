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
      const { company } = await this.companyService.findCompanyByUserEmail(email);

      const allProjects = await this.airtableService.getRecords('Projetos');

      /* Projetos não são vinculados direto à Empresa — o vínculo vai por Orçamentos.
         Buscamos os orçamentos da empresa e usamos seus IDs para filtrar os projetos.*/
      const companyBudgets = await this.airtableService.getRecords('Orçamentos');
      const companyBudgetIds = companyBudgets
        .filter((b) => Array.isArray(b['Empresa']) && b['Empresa'].includes(company.id))
        .map((b) => b.id);

      const companyProjects = allProjects.filter((project) => {
        const budgetIds = project['Orçamentos'];
        return (
          Array.isArray(budgetIds) &&
          budgetIds.some((id) => companyBudgetIds.includes(id))
        );
      });

      return companyProjects.map((project) => this.mapProject(project));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Erro ao listar projetos: ${error.message}`);
      throw new InternalServerErrorException('Erro ao buscar projetos.');
    }
  }

  async findOneByUserEmail(email: string, projectId: string) {
    try {
      const { company } = await this.companyService.findCompanyByUserEmail(email);
      const project = await this.airtableService.getRecordById('Projetos', projectId);

      /* Validação de ownership: projeto precisa estar vinculado a um orçamento da empresa */
      const budgetIds = project['Orçamentos'] || [];
      const companyBudgets = await this.airtableService.getRecords('Orçamentos');
      const companyBudgetIds = companyBudgets
        .filter((b) => Array.isArray(b['Empresa']) && b['Empresa'].includes(company.id))
        .map((b) => b.id);

      const belongsToCompany = budgetIds.some((id) => companyBudgetIds.includes(id));
      if (!belongsToCompany) {
        throw new NotFoundException('Projeto não encontrado ou não pertence à sua empresa.');
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