<template>
  <div class="page page--wide">
    <section class="company-hero">
      <div class="company-hero__copy">
        <p class="pill">Empresa</p>
        <h3>{{ company.name }}</h3>
        <p>
          Painel somente leitura para acompanhar obras, projetos, entregas e documentos liberados
          para esta empresa.
        </p>
      </div>

      <dl class="company-hero__details" aria-label="Dados principais da empresa">
        <div>
          <dt>Cidade e estado</dt>
          <dd>{{ company.cityState }}</dd>
        </div>
        <div>
          <dt>Contato principal</dt>
          <dd>{{ company.primaryContact }}</dd>
        </div>
        <div>
          <dt>E-mail</dt>
          <dd>{{ company.primaryEmail }}</dd>
        </div>
        <div>
          <dt>Telefone</dt>
          <dd>{{ company.primaryPhone }}</dd>
        </div>
      </dl>
    </section>

    <section class="metric-grid" aria-label="Resumo da empresa">
      <BaseCard v-for="card in dashboardCards" :key="card.label" class="metric-card">
        <p class="pill">{{ card.label }}</p>
        <strong class="metric-card__value" :style="{ color: card.accent }">{{ card.value }}</strong>
        <p>{{ card.detail }}</p>
      </BaseCard>
    </section>

    <section class="dashboard-grid">
      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Empresa</p>
            <h3>Dados principais</h3>
          </div>
        </template>

        <dl class="details">
          <div class="details__row">
            <dt>Nome da empresa</dt>
            <dd>{{ company.name }}</dd>
          </div>
          <div class="details__row">
            <dt>Cidade e estado</dt>
            <dd>{{ company.cityState }}</dd>
          </div>
          <div class="details__row">
            <dt>Contato principal vinculado</dt>
            <dd>{{ company.primaryContact }}</dd>
          </div>
          <div class="details__row">
            <dt>E-mail</dt>
            <dd>{{ company.primaryEmail }}</dd>
          </div>
          <div class="details__row">
            <dt>Telefone</dt>
            <dd>{{ company.primaryPhone }}</dd>
          </div>
        </dl>
      </BaseCard>

      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Acompanhamento</p>
            <h3>Resumo operacional</h3>
          </div>
        </template>

        <div class="overview-list">
          <section v-for="group in operationalOverview" :key="group.label" class="overview-group">
            <header>
              <span>{{ group.label }}</span>
              <strong>{{ group.total }}</strong>
            </header>

            <div v-if="group.rows.length" class="overview-group__rows">
              <div v-for="row in group.rows" :key="`${group.label}-${row.label}`" class="overview-row">
                <div>
                  <span>{{ row.label }}</span>
                  <strong>{{ row.count }}</strong>
                </div>
                <span class="overview-row__bar" aria-hidden="true">
                  <span :style="{ width: `${row.percentage}%` }" />
                </span>
              </div>
            </div>

            <p v-else class="empty-state">Nenhum registro disponível.</p>
          </section>
        </div>
      </BaseCard>
    </section>

    <section class="dashboard-columns">
      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Obras</p>
            <h3>Obras em acompanhamento</h3>
          </div>
        </template>

        <div class="work-list">
          <article v-for="work in workHighlights" :key="work.id" class="work-item">
            <div>
              <strong>{{ work.name }}</strong>
              <p>{{ work.city }} · {{ work.budgetType }}</p>
            </div>

            <div class="work-item__meta">
              <span class="status-badge status-badge--info">{{ work.stage }}</span>
              <span>{{ work.linkedProjects.length }} projetos</span>
              <span>{{ work.linkedDeliveries.length }} entregas</span>
            </div>
          </article>

          <p v-if="!workHighlights.length" class="empty-state">Nenhuma obra liberada para esta empresa.</p>
        </div>
      </BaseCard>

      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Entregas</p>
            <h3>Próximas entregas</h3>
          </div>
        </template>

        <div class="timeline-list">
          <article v-for="delivery in nextDeliveries" :key="delivery.id" class="timeline-item">
            <time>{{ delivery.displayDate }}</time>
            <div>
              <strong>{{ delivery.name }}</strong>
              <p>{{ delivery.workName }} · {{ delivery.quantity }}</p>
              <span>{{ delivery.deliveryAddress }}</span>
            </div>
          </article>

          <p v-if="!nextDeliveries.length" class="empty-state">Nenhuma entrega com data programada.</p>
        </div>
      </BaseCard>
    </section>

    <section class="dashboard-columns">
      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Projetos</p>
            <h3>Projetos visíveis</h3>
          </div>
        </template>

        <div class="project-list">
          <article v-for="project in projectHighlights" :key="project.id" class="project-item">
            <div>
              <strong>{{ project.name }}</strong>
              <p>{{ project.workName }} · {{ project.product }}</p>
            </div>

            <div class="project-item__meta">
              <span class="status-badge status-badge--document">{{ project.stage }}</span>
              <span>{{ project.quantity }}</span>
              <span>{{ project.totalValue }}</span>
            </div>
          </article>

          <p v-if="!projectHighlights.length" class="empty-state">Nenhum projeto liberado para consulta.</p>
        </div>
      </BaseCard>

      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Documentos</p>
            <h3>Últimos anexos liberados</h3>
          </div>
        </template>

        <div class="document-list">
          <article v-for="attachment in recentAttachments" :key="attachment.id" class="document-item">
            <div>
              <strong>{{ attachment.name }}</strong>
              <p>{{ attachment.linkedTypeLabel }} · {{ attachment.linkedRecordName }}</p>
            </div>

            <div class="document-item__meta">
              <span>{{ attachment.category }}</span>
              <time>{{ attachment.uploadedAt }}</time>
            </div>
          </article>

          <p v-if="!recentAttachments.length" class="empty-state">Nenhum anexo liberado para consulta.</p>
        </div>
      </BaseCard>
    </section>

    <BaseCard>
      <template #header>
        <div>
          <p class="pill">Consulta</p>
          <h3>Modo somente leitura</h3>
        </div>
      </template>

      <ul class="rules">
        <li v-for="rule in readOnlyRules" :key="rule">
          {{ rule }}
        </li>
      </ul>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseCard from '@/components/common/BaseCard.vue';
import { useClientPortalData } from '@/composables/useClientPortalData';

const { portalData } = useClientPortalData();

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const company = computed(() => portalData.value.company);
const works = computed(() => portalData.value.works || []);
const budgets = computed(() => portalData.value.budgets || []);
const projects = computed(() => portalData.value.projects || []);
const deliveries = computed(() => portalData.value.deliveries || []);
const attachments = computed(() => portalData.value.attachments || []);
const readOnlyRules = computed(() => portalData.value.readOnlyRules || []);

const activeBudgets = computed(() => budgets.value.filter((budget) => budget.active));
const inProgressProjects = computed(() => projects.value.filter((project) => project.inProgress));
const scheduledDeliveries = computed(() => deliveries.value.filter((delivery) => delivery.hasDate));
const pendingDeliveries = computed(() => deliveries.value.filter((delivery) => !delivery.hasDate));
const totalProjectValue = computed(() =>
  projects.value.reduce((total, project) => total + parseCurrency(project.totalValue), 0),
);

const dashboardCards = computed(() => [
  {
    label: 'Obras',
    value: String(works.value.length),
    detail: `${projects.value.length} projetos vinculados`,
    accent: '#004AE8',
  },
  {
    label: 'Orçamentos ativos',
    value: String(activeBudgets.value.length),
    detail: `${budgets.value.length} orçamentos liberados para consulta`,
    accent: '#050866',
  },
  {
    label: 'Entregas programadas',
    value: String(scheduledDeliveries.value.length),
    detail: `${pendingDeliveries.value.length} entregas aguardando data`,
    accent: '#00A34A',
  },
  {
    label: 'Valor acompanhado',
    value: currencyFormatter.format(totalProjectValue.value),
    detail: 'Soma dos projetos visíveis para a empresa',
    accent: '#B7791F',
  },
]);

const operationalOverview = computed(() => [
  {
    label: 'Obras por etapa',
    total: works.value.length,
    rows: summarizeBy(works.value, (work) => work.stage),
  },
  {
    label: 'Projetos por etapa',
    total: projects.value.length,
    rows: summarizeBy(projects.value, (project) => project.stage),
  },
  {
    label: 'Entregas por status',
    total: deliveries.value.length,
    rows: summarizeBy(deliveries.value, (delivery) => delivery.status),
  },
]);

const workHighlights = computed(() => works.value.slice(0, 5));

const nextDeliveries = computed(() => {
  const datedDeliveries = deliveries.value
    .filter((delivery) => delivery.hasDate && normalizeText(delivery.status) !== 'entregue')
    .sort((a, b) => dateTime(a.displayDate) - dateTime(b.displayDate));
  const upcomingDeliveries = datedDeliveries.filter((delivery) => dateTime(delivery.displayDate) >= todayTime());

  return (upcomingDeliveries.length ? upcomingDeliveries : datedDeliveries).slice(0, 5);
});

const projectHighlights = computed(() => {
  const visibleProjects = inProgressProjects.value.length ? inProgressProjects.value : projects.value;

  return visibleProjects.slice(0, 5);
});

const recentAttachments = computed(() =>
  [...attachments.value]
    .sort((a, b) => dateTime(b.uploadedAt) - dateTime(a.uploadedAt))
    .slice(0, 5),
);

function parseCurrency(value) {
  const normalizedValue = String(value || '')
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');

  return Number(normalizedValue) || 0;
}

function dateTime(value) {
  const [day, month, year] = String(value || '').split('/').map(Number);

  if (!day || !month || !year) return 0;

  return new Date(year, month - 1, day).getTime();
}

function todayTime() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today.getTime();
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function summarizeBy(items, getLabel) {
  const total = items.length;
  const counts = items.reduce((acc, item) => {
    const label = getLabel(item) || 'Não informado';
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([label, count]) => ({
      label,
      count,
      percentage: total ? Math.max(8, Math.round((count / total) * 100)) : 0,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
</script>

<style scoped>
.company-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(360px, 0.9fr);
  gap: 22px;
  align-items: stretch;
  padding: 24px;
  border: 1px solid rgba(0, 74, 232, 0.12);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(0, 74, 232, 0.1), rgba(0, 163, 74, 0.08)),
    #ffffff;
  box-shadow: 0 16px 34px rgba(5, 8, 102, 0.08);
}

.company-hero__copy {
  display: grid;
  align-content: center;
  gap: 12px;
}

.company-hero__copy h3 {
  max-width: 760px;
  color: var(--text-strong);
  font-size: 28px;
}

.company-hero__copy p:not(.pill) {
  max-width: 760px;
}

.company-hero__details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
}

.company-hero__details div {
  min-width: 0;
  padding: 14px;
  border: 1px solid var(--stroke-soft);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.76);
}

.company-hero__details dt,
.details__row dt {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  font-weight: 700;
}

.company-hero__details dd {
  margin: 6px 0 0;
  color: var(--text-strong);
  font-size: 15px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.metric-card__value {
  display: block;
  margin-top: 10px;
  color: var(--text-strong);
  font-size: 28px;
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.dashboard-grid,
.dashboard-columns {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: var(--space-5);
}

.dashboard-columns {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.details,
.rules {
  margin: 0;
  padding: 0;
}

.details {
  display: grid;
  gap: 14px;
}

.details__row {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--stroke);
}

.details__row:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.details__row dd {
  margin: 6px 0 0;
  color: var(--text-strong);
  font-size: 18px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.overview-list,
.overview-group,
.overview-group__rows,
.work-list,
.timeline-list,
.project-list,
.document-list,
.rules {
  display: grid;
  gap: 12px;
}

.overview-group {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--stroke-soft);
}

.overview-group:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.overview-group header,
.overview-row div,
.work-item,
.project-item,
.document-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.overview-group header span,
.work-item p,
.project-item p,
.document-item p,
.timeline-item p,
.timeline-item span,
.work-item__meta,
.project-item__meta,
.document-item__meta {
  color: var(--muted);
  font-size: 13px;
}

.overview-group header strong,
.overview-row strong,
.work-item strong,
.project-item strong,
.document-item strong,
.timeline-item strong {
  color: var(--text-strong);
}

.overview-row {
  display: grid;
  gap: 8px;
}

.overview-row__bar {
  display: block;
  height: 8px;
  overflow: hidden;
  border-radius: 8px;
  background: rgba(0, 74, 232, 0.08);
}

.overview-row__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #004ae8, #00a34a);
}

.work-item,
.project-item,
.document-item,
.timeline-item {
  padding: 14px 0;
  border-bottom: 1px solid var(--stroke-soft);
}

.work-item:last-child,
.project-item:last-child,
.document-item:last-child,
.timeline-item:last-child {
  border-bottom: none;
}

.work-item p,
.project-item p,
.document-item p,
.timeline-item p {
  margin-top: 4px;
}

.work-item__meta,
.project-item__meta,
.document-item__meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  text-align: right;
}

.project-item__meta,
.document-item__meta {
  min-width: 180px;
}

.timeline-item {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 14px;
}

.timeline-item time {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  border-radius: 8px;
  color: #087443;
  background: rgba(0, 163, 74, 0.1);
  border: 1px solid rgba(0, 163, 74, 0.18);
  font-size: 13px;
  font-weight: 800;
}

.timeline-item span {
  display: block;
  margin-top: 6px;
}

.document-item__meta span {
  display: inline-flex;
  min-height: 30px;
  align-items: center;
  padding: 0 10px;
  border-radius: 8px;
  color: #1450c8;
  border: 1px solid rgba(0, 74, 232, 0.16);
  background: rgba(0, 74, 232, 0.08);
  font-size: 12px;
  font-weight: 800;
}

.rules {
  list-style: none;
}

.rules li {
  position: relative;
  padding-left: 18px;
  color: var(--muted);
  line-height: 1.6;
}

.rules li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
}

.empty-state {
  padding: 14px;
  border-radius: 8px;
  color: var(--muted);
  background: rgba(0, 74, 232, 0.05);
}

@media (max-width: 1100px) {
  .company-hero,
  .dashboard-grid,
  .dashboard-columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .company-hero {
    padding: 18px;
  }

  .company-hero__details {
    grid-template-columns: 1fr;
  }

  .work-item,
  .project-item,
  .document-item {
    display: grid;
  }

  .work-item__meta,
  .project-item__meta,
  .document-item__meta {
    justify-content: flex-start;
    text-align: left;
  }

  .timeline-item {
    grid-template-columns: 1fr;
  }

  .timeline-item time {
    justify-content: flex-start;
    width: max-content;
    padding: 0 10px;
  }
}
</style>


