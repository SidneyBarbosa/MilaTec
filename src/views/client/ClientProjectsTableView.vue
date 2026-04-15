<template>
  <div class="page page--wide">
    <section class="kanban-board" aria-label="Projetos por etapa">
      <article v-for="column in kanbanColumns" :key="column.stage" class="kanban-column">
        <header class="kanban-column__header">
          <div>
            <span class="column-label">Etapa do projeto</span>
            <h3>{{ column.stage }}</h3>
          </div>
          <strong>{{ column.total }}</strong>
        </header>

        <div class="kanban-column__body">
          <article
            v-for="project in column.items"
            :key="project.id"
            class="kanban-card"
          >
            <button class="kanban-card__main" type="button" @click="selectProject(project)">
              <span class="status-badge" :class="`status-badge--${project.tone || 'info'}`">
                {{ project.budgetType }}
              </span>
              <strong>{{ project.name }}</strong>
            </button>

            <button class="kanban-card__meta kanban-card__link" type="button" @click="goToWork(project.obraId)">
              <span class="material-icons" aria-hidden="true">construction</span>
              {{ project.workName }}
            </button>
          </article>

          <p v-if="!column.items.length" class="empty-state">Nenhum projeto nesta etapa.</p>

          <button v-if="column.hasMore" class="load-more" type="button" @click="showMore(column.stage)">
            Mostrar mais
          </button>
        </div>
      </article>
    </section>

    <div
      v-if="selectedProject"
      class="modal-backdrop"
      role="presentation"
      @click.self="closeDetail"
    >
      <section
        class="detail-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="`Detalhes do projeto ${selectedProject.name}`"
      >
        <header class="detail-modal__header">
          <div>
            <p class="pill">Detalhe do projeto</p>
            <h3>{{ selectedProject.name }}</h3>
          </div>
          <button class="modal-close" type="button" aria-label="Fechar detalhe" @click="closeDetail">
            <span class="material-icons" aria-hidden="true">close</span>
          </button>
        </header>

        <div class="detail-grid">
          <div>
            <span>Obra vinculada</span>
            <button class="detail-link" type="button" @click="goToWork(selectedProject.obraId)">
              {{ selectedProject.workName }}
            </button>
          </div>
          <div>
            <span>Produto</span>
            <strong>{{ selectedProject.product }}</strong>
          </div>
          <div>
            <span>Tipo de projeto</span>
            <strong>{{ selectedProject.type }}</strong>
          </div>
          <div>
            <span>Etapa</span>
            <strong>{{ selectedProject.stage }}</strong>
          </div>
          <div>
            <span>Quantidade</span>
            <strong>{{ selectedProject.quantity }}</strong>
          </div>
          <div>
            <span>Valor unitário</span>
            <strong>{{ selectedProject.unitValue }}</strong>
          </div>
          <div>
            <span>Valor total</span>
            <strong>{{ selectedProject.totalValue }}</strong>
          </div>
        </div>

        <section class="detail-section">
          <h4>Anexos</h4>
          <div class="document-list">
            <div v-for="item in projectAttachmentRows(selectedProject)" :key="item.label" class="document-item">
              <span>{{ item.label }}</span>
              <a
                v-if="item.attachment"
                :href="item.attachment.href"
                class="attachment-action"
                :aria-label="item.attachment.actionLabel"
              >
                <span class="material-icons" aria-hidden="true">
                  {{ resolveActionIcon(item.attachment.actionLabel) }}
                </span>
                <span>{{ item.attachment.name }}</span>
              </a>
              <strong v-else>Não liberado</strong>
            </div>
          </div>
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
const selectedProjectId = ref('');
const columnLimits = ref({});
const kanbanPageSize = 6;

const projects = computed(() => portalData.value.projects);
const selectedProject = computed(
  () => projects.value.find((project) => project.id === selectedProjectId.value) || null,
);
const kanbanColumns = computed(() => {
  const stages = [...new Set(projects.value.map((project) => project.stage))];

  return stages.map((stage) => {
    const stageItems = projects.value.filter((project) => project.stage === stage);
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
  () => route.query.projeto,
  (projectId) => {
    selectedProjectId.value = typeof projectId === 'string' ? projectId : '';
  },
  { immediate: true },
);

const selectProject = (project) => {
  selectedProjectId.value = project.id;
  router.replace({ query: { ...route.query, projeto: project.id } });
};

const closeDetail = () => {
  selectedProjectId.value = '';
  const { projeto, ...query } = route.query;
  router.replace({ query });
};

const goToWork = (workId) => {
  router.push({ path: '/cliente/obras', query: { obra: workId } });
};

const showMore = (stage) => {
  columnLimits.value = {
    ...columnLimits.value,
    [stage]: (columnLimits.value[stage] || kanbanPageSize) + kanbanPageSize,
  };
};

const projectAttachmentRows = (project) => [
  {
    label: 'Projeto executivo',
    attachment: project.executiveAttachment,
  },
  {
    label: 'Projeto aprovação',
    attachment: project.approvalAttachment,
  },
  {
    label: 'Registro de obra',
    attachment: project.registrationAttachment,
  },
];

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
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.kanban-card:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 74, 232, 0.24);
  box-shadow: 0 18px 30px rgba(5, 8, 102, 0.12);
}

.kanban-card__main,
.kanban-card__link,
.detail-link {
  padding: 0;
  border: none;
  text-align: left;
  background: transparent;
  cursor: pointer;
}

.kanban-card__main {
  display: grid;
  gap: 12px;
}

.kanban-card__main:focus-visible,
.kanban-card__link:focus-visible,
.detail-link:focus-visible {
  outline: none;
}

.kanban-card__main:focus-visible strong,
.kanban-card__link:focus-visible,
.detail-link:focus-visible {
  color: var(--primary);
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

.kanban-card__link:hover,
.detail-link:hover {
  color: var(--primary);
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
  width: min(860px, 100%);
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

.detail-grid div,
.document-item {
  min-height: 92px;
  padding: 14px;
  border: 1px solid var(--stroke-soft);
  border-radius: 8px;
  background: #f7faff;
}

.detail-grid span,
.detail-grid strong,
.document-item span,
.document-item strong {
  display: block;
}

.detail-grid span,
.document-item > span {
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.detail-grid strong,
.document-item strong {
  margin-top: 8px;
  color: var(--text-strong);
  font-size: 16px;
  line-height: 1.4;
}

.detail-link {
  display: block;
  margin-top: 8px;
  color: var(--text-strong);
  font-size: 16px;
  font-weight: 700;
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

.document-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 12px;
}

.document-item {
  display: grid;
  gap: 10px;
}

.document-item .attachment-action {
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


