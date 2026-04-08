import { createRouter, createWebHistory } from 'vue-router';
import { canAccessRoles, resolveDefaultRoute, sessionRole } from '@/composables/useSession';
import HomeView from '@/views/client/ClientHomeView.vue';
import BudgetsView from '@/views/client/ClientBudgetsView.vue';
import ProjectsView from '@/views/client/ClientProjectsView.vue';
import DeliveriesView from '@/views/client/ClientDeliveriesView.vue';
import DocumentsView from '@/views/client/ClientDocumentsView.vue';
import LoginView from '@/views/auth/LoginReadonlyView.vue';
import VerifyCodeView from '@/views/auth/VerifyAccessView.vue';
import AdminHomeView from '@/views/admin/AdminHomeView.vue';
import AdminClientsView from '@/views/admin/AdminClientsView.vue';
import AdminOperationsView from '@/views/admin/AdminOperationsView.vue';
import AdminDocumentsView from '@/views/admin/AdminDocumentsView.vue';
import AdminAccessView from '@/views/admin/AdminAccessView.vue';

/* const routes = [
  {
    path: '/',
    redirect: () => resolveDefaultRoute(),
  },
  {
    path: '/orcamentos',
    name: 'client-budgets',
    component: BudgetsView,
    meta: { title: 'Orçamentos' },
  },
  {
    path: '/projetos',
    name: 'projects',
    component: ProjectsView,
    meta: { title: 'Projetos' },
  },
  {
    path: '/entregas',
    name: 'deliveries',
    component: DeliveriesView,
    meta: { title: 'Entregas' },
  },
  {
    path: '/documentos',
    name: 'documents',
    component: DocumentsView,
    meta: { title: 'Documentos' },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { layout: 'auth', guestOnly: true, title: 'Acesso MilaTec' },
  },
  {
    path: '/verificar-codigo',
    name: 'verify-code',
    component: VerifyCodeView,
    meta: { layout: 'auth', guestOnly: true, title: 'Verificacao de acesso' },
  },
  {
    path: '/suporte',
    name: 'support',
    component: SupportView,
  },
]; */

const routes = [
  {
    path: '/',
    redirect: () => resolveDefaultRoute(),
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { layout: 'auth', guestOnly: true, title: 'Acesso MilaTec' },
  },
  {
    path: '/verificar-codigo',
    name: 'verify-code',
    component: VerifyCodeView,
    meta: { layout: 'auth', guestOnly: true, title: 'Verificacao de acesso' },
  },
  {
    path: '/cliente',
    name: 'client-home',
    component: HomeView,
    meta: { requiresAuth: true, roles: ['client'], title: 'Painel do Cliente' },
  },
  {
    path: '/cliente/orcamentos',
    name: 'client-budgets',
    component: BudgetsView,
    meta: { requiresAuth: true, roles: ['client'], title: 'Orcamentos homologados' },
  },
  {
    path: '/cliente/projetos',
    name: 'client-projects',
    component: ProjectsView,
    meta: { requiresAuth: true, roles: ['client'], title: 'Projeto e governanca' },
  },
  {
    path: '/cliente/entregas',
    name: 'client-deliveries',
    component: DeliveriesView,
    meta: { requiresAuth: true, roles: ['client'], title: 'Entregas publicadas' },
  },
  {
    path: '/cliente/documentos',
    name: 'client-documents',
    component: DocumentsView,
    meta: { requiresAuth: true, roles: ['client'], title: 'Documentos liberados' },
  },
  {
    path: '/admin',
    name: 'admin-home',
    component: AdminHomeView,
    meta: { requiresAuth: true, roles: ['admin'], title: 'Visao executiva' },
  },
  {
    path: '/admin/clientes',
    name: 'admin-clients',
    component: AdminClientsView,
    meta: { requiresAuth: true, roles: ['admin'], title: 'Clientes monitorados' },
  },
  {
    path: '/admin/operacao',
    name: 'admin-operations',
    component: AdminOperationsView,
    meta: { requiresAuth: true, roles: ['admin'], title: 'Operacao e sincronismo' },
  },
  {
    path: '/admin/documentos',
    name: 'admin-documents',
    component: AdminDocumentsView,
    meta: { requiresAuth: true, roles: ['admin'], title: 'Governanca documental' },
  },
  {
    path: '/admin/acessos',
    name: 'admin-access',
    component: AdminAccessView,
    meta: { requiresAuth: true, roles: ['admin'], title: 'Controle de acesso' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: () => resolveDefaultRoute(sessionRole.value),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  const activeRole = sessionRole.value;

  if (to.meta?.guestOnly && activeRole) {
    return resolveDefaultRoute(activeRole);
  }

  if (to.meta?.requiresAuth && !activeRole) {
    return { name: 'login' };
  }

  if (to.meta?.roles && !canAccessRoles(to.meta.roles, activeRole)) {
    return activeRole ? resolveDefaultRoute(activeRole) : { name: 'login' };
  }

  return true;
});

router.afterEach((to) => {
  document.title = to.meta?.title ? `${to.meta.title} | MilaTec` : 'MilaTec';
});

export default router;
