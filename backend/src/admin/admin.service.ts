import { Injectable } from '@nestjs/common';
import { AirtableService } from '../airtable/airtable.service';

@Injectable()
export class AdminService {
  constructor(private readonly airtableService: AirtableService) {}

  async getAllProjects(filter?: { companyName?: string }) {
    const options: any = {};
    if (filter?.companyName) {
      options.filterByFormula = `{Empresa (from Orçamentos)} = "${filter.companyName}"`;
    }
    return this.airtableService.getRecords('Projetos', options);
  }

  async getAllCompanies(filter?: { name?: string }) {
    const options: any = {};
    if (filter?.name) {
      options.filterByFormula = `{Empresa} = "${filter.name}"`;
    }
    return this.airtableService.getRecords('Empresas', options);
  }

  async getAllUsers() {
    return this.airtableService.getRecords('Contatos');
  }

  async getAllBudgets(filter?: { companyName?: string }) {
    const options: any = {};
    if (filter?.companyName) {
      options.filterByFormula = `{Empresa} = "${filter.companyName}"`;
    }
    return this.airtableService.getRecords('Orçamentos', options);
  }

  async getAllDeliveries(filter?: { companyName?: string }) {
    const options: any = {};
    if (filter?.companyName) {
      options.filterByFormula = `{Empresa (from Orçamentos)} = "${filter.companyName}"`;
    }
    return this.airtableService.getRecords('Entregas', options);
  }

  async getAllInstallations(filter?: { companyName?: string }) {
    const options: any = {};
    if (filter?.companyName) {
      options.filterByFormula = `{Empresa (from Orçamentos)} = "${filter.companyName}"`;
    }
    return this.airtableService.getRecords('Instalações', options);
  }

  async getDashboard(filters: { companyName?: string } = {}) {
    const [projects, companies, users, budgets, deliveries, installations] = await Promise.all([
      this.getAllProjects({ companyName: filters.companyName }),
      this.getAllCompanies({ name: filters.companyName }),
      this.getAllUsers(),
      this.getAllBudgets({ companyName: filters.companyName }),
      this.getAllDeliveries({ companyName: filters.companyName }),
      this.getAllInstallations({ companyName: filters.companyName }),
    ]);

    return {
      totalProjects: projects.length,
      totalCompanies: companies.length,
      totalUsers: users.length,
      totalBudgets: budgets.length,
      totalDeliveries: deliveries.length,
      totalInstallations: installations.length,
      projects,
      companies,
      users,
      budgets,
      deliveries,
      installations,
    };
  }
}
