<template>
  <div class="page page--wide">
    <section class="kanban-board" aria-label="Obras por etapa">
      <article v-for="column in kanbanColumns" :key="column.stage" class="kanban-column">
        <header class="kanban-column__header">
          <div>
            <span class="column-label">Etapa</span>
            <h3>{{ column.stage }}</h3>
          </div>
          <strong>{{ column.total }}</strong>
        </header>

        <div class="kanban-column__body">
          <button
            v-for="work in column.items"
            :key="work.id"
            class="kanban-card"
            type="button"
            @click="selectWork(work)"
          >
            <span class="status-badge status-badge--info">{{ work.budgetType }}</span>
            <strong>{{ work.name }}</strong>
            <span class="kanban-card__meta">
              <span class="material-icons" aria-hidden="true">location_on</span>
              {{ work.city }}
            </span>
          </button>

          <p v-if="!column.items.length" class="empty-state">Nenhuma obra nesta etapa.</p>

          <button v-if="column.hasMore" class="load-more" type="button" @click="showMore(column.stage)">
            Mostrar mais
          </button>
        </div>
      </article>
    </section>

    <div
      v-if="selectedWork"
      class="modal-backdrop"
      role="presentation"
      @click.self="closeDetail"
    >
      <section
        class="detail-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="`Detalhes da obra ${selectedWork.name}`"
      >
        <header class="detail-modal__header">
          <div>
            <p class="pill">Detalhe da obra</p>
            <h3>{{ selectedWork.name }}</h3>
          </div>
          <button class="modal-close" type="button" aria-label="Fechar detalhe" @click="closeDetail">
            <span class="material-icons" aria-hidden="true">close</span>
          </button>
        </header>

        <div class="detail-grid">
          <div>
            <span>Nome</span>
            <strong>{{ selectedWork.name }}</strong>
          </div>
          <div>
            <span>Cidade</span>
            <strong>{{ selectedWork.city }}</strong>
          </div>
          <div>
            <span>Quantidade</span>
            <strong>{{ selectedWork.quantity }}</strong>
          </div>
          <div>
            <span>Valor</span>
            <strong>{{ selectedWork.value }}</strong>
          </div>
          <div>
            <span>Tipo de orçamento</span>
            <strong>{{ selectedWork.budgetType }}</strong>
          </div>
          <div>
            <span>Etapa</span>
            <strong>{{ selectedWork.stage }}</strong>
          </div>
        </div>

        <section class="detail-section">
          <h4>Projetos vinculados</h4>
          <ul v-if="selectedWork.linkedProjects.length" class="summary-list">
            <li v-for="project in selectedWork.linkedProjects" :key="project.id">
              <button class="summary-link" type="button" @click="goToProject(project.id)">
                <strong>{{ project.name }}</strong>
                <span>{{ project.stage }} · {{ project.quantity }} · {{ project.totalValue }}</span>
              </button>
            </li>
          </ul>
          <p v-else>Nenhum projeto vinculado.</p>
        </section>

        <section class="detail-section">
          <h4>Entregas vinculadas</h4>
          <ul v-if="selectedWork.linkedDeliveries.length" class="summary-list">
            <li v-for="delivery in selectedWork.linkedDeliveries" :key="delivery.id">
              <button class="summary-link" type="button" @click="goToDelivery(delivery.id)">
                <strong>{{ delivery.name }}</strong>
                <span>{{ delivery.displayDate }} · {{ delivery.status }}</span>
              </button>
            </li>
          </ul>
          <p v-else>Nenhuma entrega vinculada.</p>
        </section>

        <section class="detail-section">
          <h4>Anexos</h4>
          <div v-if="selectedWork.attachments.length" class="attachment-list">
            <a
              v-for="attachment in selectedWork.attachments"
              :key="attachment.id"
              :href="attachment.href"
              class="attachment-action"
              :aria-label="attachment.actionLabel"
            >
              <span class="material-icons" aria-hidden="true">{{ resolveActionIcon(attachment.actionLabel) }}</span>
              <span>{{ attachment.name }}</span>
            </a>
          </div>
          <p v-else>Nenhum anexo liberado para esta obra.</p>
        </section>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useClientPortalData } from '@/composables/useClientPortalData';

const route = useRoute();
const router = useRouter();
const { portalData } = useClientPortalData();
const selectedWorkId = ref('');
const columnLimits = ref({});
const kanbanPageSize = 6;

const works = computed(() => portalData.value.works);
const selectedWork = computed(() => works.value.find((work) => work.id === selectedWorkId.value) || null);
const kanbanColumns = computed(() => {
  const stages = [...new Set(works.value.map((work) => work.stage))];

  return stages.map((stage) => {
    const stageItems = works.value.filter((work) => work.stage === stage);
    const limit = columnLimits.value[stage] || kanbanPageSize;

    return {
      stage,
      total: stageItems.length,
      items: stageItems.slice(0, limit),
      hasMore: stageItems.length > limit,
    };
  });
});

watch(
  () => route.query.obra,
  (workId) => {
    selectedWorkId.value = typeof workId === 'string' ? workId : '';
  },
  { immediate: true },
);

const selectWork = (work) => {
  selectedWorkId.value = work.id;
  router.replace({ query: { ...route.query, obra: work.id } });
};

const closeDetail = () => {
  selectedWorkId.value = '';
  const { obra, ...query } = route.query;
  router.replace({ query });
};

const goToProject = (projectId) => {
  router.push({ path: '/cliente/projetos', query: { projeto: projectId } });
};

const goToDelivery = (deliveryId) => {
  router.push({ path: '/cliente/entregas', query: { entrega: deliveryId } });
};

const showMore = (stage) => {
  columnLimits.value = {
    ...columnLimits.value,
    [stage]: (columnLimits.value[stage] || kanbanPageSize) + kanbanPageSize,
  };
};

const resolveActionIcon = (actionLabel) => {
  const iconByAction = {
    Visualizar: 'visibility',
    Baixar: 'download',
  };

  return iconByAction[actionLabel] || 'description';
};
</script>

<style scoped>
.kanban-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
  align-items: start;
}

.kanban-column {
  display: grid;
  min-height: 320px;
  border: 1px solid var(--stroke-soft);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.76);
  box-shadow: 0 16px 34px rgba(5, 8, 102, 0.08);
  overflow: hidden;
}

.kanban-column__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px;
  border-bottom: 1px solid var(--stroke-soft);
  background: linear-gradient(180deg, rgba(246, 249, 255, 0.98), rgba(241, 246, 255, 0.92));
}

.kanban-column__header h3 {
  color: var(--text-strong);
  font-size: 18px;
}

.kanban-column__header strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  color: var(--primary);
  background: rgba(0, 74, 232, 0.08);
  border: 1px solid rgba(0, 74, 232, 0.14);
}

.column-label {
  display: block;
  margin-bottom: 6px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.kanban-column__body {
  display: grid;
  gap: 12px;
  align-content: start;
  padding: 14px;
}

.kanban-card {
  display: grid;
  gap: 12px;
  width: 100%;
  min-height: 150px;
  padding: 16px;
  border: 1px solid var(--stroke-soft);
  border-radius: 8px;
  text-align: left;
  color: var(--text);
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(5, 8, 102, 0.08);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.kanban-card:hover,
.kanban-card:focus-visible {
  transform: translateY(-2px);
  border-color: rgba(0, 74, 232, 0.24);
  box-shadow: 0 18px 30px rgba(5, 8, 102, 0.12);
  outline: none;
}

.kanban-card strong {
  display: block;
  color: var(--text-strong);
  font-size: 18px;
  line-height: 1.35;
}

.kanban-card__meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
}

.kanban-card__meta .material-icons {
  font-size: 18px;
}

.empty-state {
  padding: 14px;
  border: 1px dashed var(--stroke);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.62);
}

.load-more {
  min-height: 38px;
  border: 1px solid rgba(0, 74, 232, 0.16);
  border-radius: 8px;
  color: var(--primary);
  background: rgba(0, 74, 232, 0.06);
  font-weight: 700;
  cursor: pointer;
}

.load-more:hover,
.load-more:focus-visible {
  border-color: rgba(0, 74, 232, 0.28);
  background: rgba(0, 74, 232, 0.1);
  outline: none;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(5, 8, 102, 0.48);
}

.detail-modal {
  display: grid;
  gap: 18px;
  width: min(920px, 100%);
  max-height: min(820px, calc(100vh - 48px));
  overflow: auto;
  padding: 22px;
  border-radius: 8px;
  background: var(--card);
  box-shadow: var(--shadow-lg);
}

.detail-modal__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.detail-modal__header h3 {
  margin-top: 8px;
  color: var(--text-strong);
  font-size: 24px;
}

.modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--stroke-soft);
  border-radius: 8px;
  color: var(--text-strong);
  background: #f7faff;
  cursor: pointer;
}

.modal-close:hover,
.modal-close:focus-visible {
  border-color: rgba(0, 74, 232, 0.24);
  color: var(--primary);
  outline: none;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 12px;
}

.detail-grid div {
  min-height: 92px;
  padding: 14px;
  border: 1px solid var(--stroke-soft);
  border-radius: 8px;
  background: #f7faff;
}

.detail-grid span,
.detail-grid strong {
  display: block;
}

.detail-grid span {
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.detail-grid strong {
  margin-top: 8px;
  color: var(--text-strong);
  font-size: 16px;
  line-height: 1.4;
}

.detail-section {
  display: grid;
  gap: 12px;
}

.detail-section h4 {
  margin: 0;
  color: var(--text-strong);
  font-size: 16px;
}

.summary-list {
  display: grid;
  gap: 10px;
  padding: 0;
  list-style: none;
}

.summary-list li {
  padding: 12px;
  border: 1px solid var(--stroke-soft);
  border-radius: 8px;
  background: rgba(246, 249, 255, 0.72);
}

.summary-link {
  display: grid;
  gap: 4px;
  width: 100%;
  padding: 0;
  border: none;
  text-align: left;
  background: transparent;
  cursor: pointer;
}

.summary-link:hover strong,
.summary-link:focus-visible strong {
  color: var(--primary);
}

.summary-link:focus-visible {
  outline: 2px solid rgba(0, 74, 232, 0.24);
  outline-offset: 4px;
}

.summary-list strong {
  color: var(--text-strong);
}

.summary-list span {
  color: var(--muted);
  font-size: 14px;
}

.attachment-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
}

.attachment-list .attachment-action {
  justify-content: flex-start;
  border-radius: 8px;
}

@media (max-width: 720px) {
  .kanban-board {
    grid-template-columns: 1fr;
  }

  .modal-backdrop {
    align-items: stretch;
    padding: 12px;
  }

  .detail-modal {
    max-height: calc(100vh - 24px);
  }
}
</style>

