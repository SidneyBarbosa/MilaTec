import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import BudgetsView from '@/views/BudgetsView.vue';
import ProjectsView from '@/views/ProjectsView.vue';
import DeliveriesView from '@/views/DeliveriesView.vue';
import DocumentsView from '@/views/DocumentsView.vue';
import SupportView from '@/views/SupportView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import VerifyCodeView from '@/views/auth/VerifyCodeView.vue';

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: HomeView,
    meta: { title: 'Painel' },
  },
  {
    path: '/orcamentos',
    name: 'budgets',
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
    meta: { layout: 'auth' },
  },
  {
    path: '/verificar-codigo',
    name: 'verify-code',
    component: VerifyCodeView,
    meta: { layout: 'auth' },
  },
  {
    path: '/suporte',
    name: 'support',
    component: SupportView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
