import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { BudgetsService } from '../budgets/budgets.service';
import { ProjectsService } from '../projects/projects.service';
import { DeliveriesService } from '../deliveries/deliveries.service';
import { InstallationsService } from '../installations/installations.service';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly companyService: CompanyService,
    private readonly budgetsService: BudgetsService,
    private readonly projectsService: ProjectsService,
    private readonly deliveriesService: DeliveriesService,
    private readonly installationsService: InstallationsService,
    private readonly documentsService: DocumentsService,
  ) {}

  /* Agrega todos os dados do dashboard em uma única resposta.
     Todas as buscas rodam em paralelo via Promise.all. */
  async getDashboard(email: string) {
    try {
      /* Empresa precisa ser buscada primeiro pois os outros serviços dependem dela.
         Como todos usam o mesmo cache, chamadas subsequentes serão instantâneas. */
      const companyData = await this.companyService.findCompanyByUserEmail(email);

      /* Demais buscas em paralelo */
      const [budgets, projects, deliveries, installations, documents] =
        await Promise.all([
          this.budgetsService.findAllByUserEmail(email),
          this.projectsService.findAllByUserEmail(email),
          this.deliveriesService.findAllByUserEmail(email),
          this.installationsService.findAllByUserEmail(email),
          this.documentsService.findAllByUserEmail(email),
        ]);

      return {
        company: companyData.company,
        contact: companyData.contact,
        summary: this.buildSummary(budgets, projects, deliveries, installations),
        budgets,
        projects,
        deliveries,
        installations,
        documents: documents.documents,
        documentsCount: documents.total,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Erro ao montar dashboard: ${error.message}`);
      throw new InternalServerErrorException('Erro ao carregar dashboard.');
    }
  }

  /* Calcula métricas resumidas para os cards do dashboard. */
  private buildSummary(
    budgets: any[],
    projects: any[],
    deliveries: any[],
    installations: any[],
  ) {
    const totalBudgetValue = budgets.reduce(
      (sum, b) => sum + (Number(b.value) || 0),
      0,
    );

    const projectsInProgress = projects.filter(
      (p) => p.stage && !this.isFinalStage(p.stage),
    ).length;

    const installationsInProgress = installations.filter(
      (i) => i.startDate && !i.endDate,
    ).length;

    const completedDeliveries = deliveries.filter(
      (d) => d.realizedValue !== null && d.realizedValue !== undefined,
    ).length;

    return {
      totals: {
        budgets: budgets.length,
        projects: projects.length,
        deliveries: deliveries.length,
        installations: installations.length,
      },
      financial: {
        totalBudgetValue,
      },
      progress: {
        projectsInProgress,
        installationsInProgress,
        completedDeliveries,
        pendingDeliveries: deliveries.length - completedDeliveries,
      },
    };
  }

  /* Identifica se uma etapa representa fase final do projeto.
     Ajustar conforme as etapas reais usadas no Airtable. */
  private isFinalStage(stage: string): boolean {
    const finalStages = ['Concluído', 'Finalizado', 'Entregue', 'Cancelado'];
    return finalStages.some((s) =>
      stage.toLowerCase().includes(s.toLowerCase()),
    );
  }
}