import { Injectable } from '@nestjs/common';
import { AirtableService } from '../airtable/airtable.service';

@Injectable()
export class AdminService {
  constructor(private readonly airtableService: AirtableService) {}

  async getAllProjects() {
    return this.airtableService.getRecords('Projetos');
  }

  async getAllCompanies() {
    return this.airtableService.getRecords('Empresas');
  }

  async getAllUsers() {
    return this.airtableService.getRecords('Contatos');
  }

  async getDashboard() {
    const [projects, companies, users] = await Promise.all([
      this.getAllProjects(),
      this.getAllCompanies(),
      this.getAllUsers(),
    ]);

    return {
      totalProjects: projects.length,
      totalCompanies: companies.length,
      totalUsers: users.length,
      projects,
      companies,
      users,
    };
  }
}
