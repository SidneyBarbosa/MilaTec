import { api } from './api';

export async function getAdminDashboard(params = {}) {
  return api.get('/admin/dashboard', { params });
}

export async function getAdminProjects() {
  return api.get('/admin/projects');
}

export async function getAdminCompanies(params = {}) {
  return api.get('/admin/companies', { params });
}

export async function getAdminUsers() {
  return api.get('/admin/users');
}
