<template>
  <div class="page page--wide">
    <div v-if="isLoading" class="page-status page-status--loading">
      <span class="loader" aria-hidden="true"></span>
      <p>Carregando anexos...</p>
    </div>

    <div v-else-if="error" class="page-status page-status--error">
      <p>{{ error }}</p>
    </div>

    <template v-else>
    <FiltersBar
      :count="filteredAttachments.length"
      :total="attachments.length"
      label="anexos"
      :show-clear="Boolean(searchTerm || selectedCategory || selectedWorkFilterId || selectedProjectFilterId)"
      @clear="clearFilters"
    >
      <BaseInput v-model="searchTerm" label="Buscar" placeholder="Arquivo, vínculo ou categoria" tone="light" />
      <BaseSelect v-model="selectedWorkFilterId" label="Obra" :options="workOptions" tone="light" />
      <BaseSelect v-model="selectedProjectFilterId" label="Projeto" :options="projectOptions" tone="light" />
      <BaseSelect v-model="selectedCategory" label="Categoria" :options="categoryOptions" tone="light" />
    </FiltersBar>

    <BaseCard class="table-card">
      <div class="table">
        <div class="table__head">
          <span>Nome do arquivo</span>
          <span>Vínculo</span>
          <span>Categoria</span>
          <span>Data de upload</span>
          <span>Acesso</span>
        </div>

        <div class="table__body">
          <div v-for="attachment in paginatedAttachments" :key="attachment.id" class="table__row">
            <span class="table__cell table__cell--title">{{ attachment.name }}</span>
            <span class="table__cell table__cell--linked">
              {{ attachment.linkedTypeLabel }} · {{ attachment.linkedRecordName }}
            </span>
            <span class="table__cell">
              <span class="category-chip" :class="categoryClass(attachment.category)">
                {{ attachment.category }}
              </span>
            </span>
            <span class="table__cell">{{ attachment.uploadedAt }}</span>
            <span class="table__cell attachment-actions">
              <button
                type="button"
                class="attachment-action"
                :aria-label="`Visualizar ${attachment.name}`"
                @click="openPreview(attachment)"
              >
                <span class="material-icons" aria-hidden="true">visibility</span>
                <span>Visualizar</span>
              </button>

              <a
                :href="attachment.href"
                class="attachment-action attachment-action--download"
                :download="attachment.name"
                rel="noopener noreferrer"
                :aria-label="`Baixar ${attachment.name}`"
                @click="handleDownload($event, attachment)"
              >
                <span class="material-icons" aria-hidden="true">download</span>
                <span>Baixar</span>
              </a>
            </span>
          </div>

          <p v-if="!paginatedAttachments.length" class="table__empty">Nenhum anexo encontrado com os filtros atuais.</p>
        </div>
      </div>
    </BaseCard>

    <nav v-if="totalPages > 1" class="pagination" aria-label="Paginação de anexos">
      <button type="button" :disabled="currentPage === 1" @click="currentPage -= 1">
        Anterior
      </button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button type="button" :disabled="currentPage === totalPages" @click="currentPage += 1">
        Próxima
      </button>
    </nav>

    <div
      v-if="previewAttachment"
      class="modal-backdrop"
      role="presentation"
      @click.self="closePreview"
    >
      <section
        class="preview-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="`Visualização de ${previewAttachment.name}`"
      >
        <header class="preview-modal__header">
          <div>
            <span class="category-chip" :class="categoryClass(previewAttachment.category)">
              {{ previewAttachment.category }}
            </span>
            <h3>{{ previewAttachment.name }}</h3>
            <p>{{ previewAttachment.linkedTypeLabel }} · {{ previewAttachment.linkedRecordName }}</p>
          </div>
          <button class="modal-close" type="button" aria-label="Fechar visualização" @click="closePreview">
            <span class="material-icons" aria-hidden="true">close</span>
          </button>
        </header>

        <div class="preview-frame">
          <iframe
            v-if="canEmbed(previewAttachment)"
            :src="previewAttachment.href"
            title="Pré-visualização do anexo"
            sandbox="allow-same-origin allow-downloads"
          />
          <div v-else class="preview-placeholder">
            <span class="material-icons" aria-hidden="true">description</span>
            <strong>Arquivo liberado para esta empresa</strong>
            <p>Quando a integração estiver conectada, o documento será carregado aqui.</p>
          </div>
        </div>

        <footer class="preview-modal__footer">
          <span>Acesso validado pelo escopo da empresa autenticada.</span>
          <a
            :href="previewAttachment.href"
            class="attachment-action attachment-action--download"
            :download="previewAttachment.name"
            rel="noopener noreferrer"
            @click="handleDownload($event, previewAttachment)"
          >
            <span class="material-icons" aria-hidden="true">download</span>
            <span>Baixar</span>
          </a>
        </footer>
      </section>
    </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseCard from '@/components/common/BaseCard.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseSelect from '@/components/common/BaseSelect.vue';
import FiltersBar from '@/components/common/FiltersBar.vue';
import { useClientPortalData } from '@/composables/useClientPortalData';
import { matchesSearch, uniqueTextOptions } from '@/utils/text';

const route = useRoute();
const router = useRouter();
const { portalData, isLoading, error } = useClientPortalData();
const currentPage = ref(1);
const previewAttachmentId = ref('');
const searchTerm = ref('');
const selectedWorkFilterId = ref('');
const selectedProjectFilterId = ref('');
const selectedCategory = ref('');
const pageSize = 8;

const works = computed(() => portalData.value.works || []);
const projects = computed(() => portalData.value.projects || []);
const attachments = computed(() =>
  portalData.value.attachments.filter((attachment) =>
    ['orcamento', 'projeto', 'entrega'].includes(attachment.entityType),
  ),
);
const workOptions = computed(() => [
  { label: 'Todas as obras', value: '' },
  ...works.value.map((work) => ({
    label: work.name,
    value: work.id,
  })),
]);
const projectOptions = computed(() => [
  { label: 'Todos os projetos', value: '' },
  ...projects.value.map((project) => ({
    label: project.name,
    value: project.id,
  })),
]);
const categoryOptions = computed(() => [
  { label: 'Todas as categorias', value: '' },
  ...uniqueTextOptions(attachments.value.map((attachment) => attachment.category)).map((category) => ({
    label: category,
    value: category,
  })),
]);
const filteredAttachments = computed(() =>
  attachments.value.filter(
    (attachment) =>
      (!selectedWorkFilterId.value || attachment.relatedWorkIds?.includes(selectedWorkFilterId.value)) &&
      (!selectedProjectFilterId.value || attachment.relatedProjectIds?.includes(selectedProjectFilterId.value)) &&
      (!selectedCategory.value || attachment.category === selectedCategory.value) &&
      matchesSearch(
        [
          attachment.name,
          attachment.linkedTypeLabel,
          attachment.linkedRecordName,
          ...(attachment.relatedWorkNames || []),
          ...(attachment.relatedProjectNames || []),
          attachment.category,
          attachment.uploadedAt,
        ],
        searchTerm.value,
      ),
  ),
);
const totalPages = computed(() => Math.max(1, Math.ceil(filteredAttachments.value.length / pageSize)));
const paginatedAttachments = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredAttachments.value.slice(start, start + pageSize);
});
const previewAttachment = computed(
  () => attachments.value.find((attachment) => attachment.id === previewAttachmentId.value) || null,
);

watch(filteredAttachments, () => {
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
});

watch(
  () => route.query.obraFiltro,
  (workFilterId) => {
    selectedWorkFilterId.value = typeof workFilterId === 'string' ? workFilterId : '';
  },
  { immediate: true },
);

watch(
  () => route.query.projetoFiltro,
  (projectFilterId) => {
    selectedProjectFilterId.value = typeof projectFilterId === 'string' ? projectFilterId : '';
  },
  { immediate: true },
);

watch([selectedWorkFilterId, selectedProjectFilterId], ([workFilterId, projectFilterId]) => {
  const currentWorkFilterId = typeof route.query.obraFiltro === 'string' ? route.query.obraFiltro : '';
  const currentProjectFilterId = typeof route.query.projetoFiltro === 'string' ? route.query.projetoFiltro : '';

  if (currentWorkFilterId === workFilterId && currentProjectFilterId === projectFilterId) return;

  const nextQuery = { ...route.query };

  if (workFilterId) {
    nextQuery.obraFiltro = workFilterId;
  } else {
    delete nextQuery.obraFiltro;
  }

  if (projectFilterId) {
    nextQuery.projetoFiltro = projectFilterId;
  } else {
    delete nextQuery.projetoFiltro;
  }

  router.replace({ query: nextQuery });
});

const clearFilters = () => {
  searchTerm.value = '';
  selectedWorkFilterId.value = '';
  selectedProjectFilterId.value = '';
  selectedCategory.value = '';
};

const openPreview = (attachment) => {
  previewAttachmentId.value = attachment.id;
};

const closePreview = () => {
  previewAttachmentId.value = '';
};

const canEmbed = (attachment) => attachment.href && attachment.href !== '#';

const handleDownload = (event, attachment) => {
  if (!attachment.href || attachment.href === '#') {
    event.preventDefault();
  }
};

const categoryClass = (category) => {
  const normalizedCategory = category
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();

  return `category-chip--${normalizedCategory}`;
};
</script>

<style scoped>
.page-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 300px;
  text-align: center;
  color: #4a5672;
}

.page-status--error {
  color: #c0392b;
}

.loader {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f5;
  border-top-color: #050866;
  border-radius: 50%;
  animation: loader-spin 0.8s linear infinite;
}

@keyframes loader-spin {
  to {
    transform: rotate(360deg);
  }
}
.table-card {
  padding: 0;
}

.table {
  display: grid;
  overflow-x: auto;
  scrollbar-width: thin;
}

.table__head,
.table__row {
  display: grid;
  min-width: 1040px;
  grid-template-columns:
    minmax(220px, 1.15fr)
    minmax(210px, 1.08fr)
    minmax(180px, 0.9fr)
    minmax(130px, 0.65fr)
    minmax(220px, 1fr);
  gap: 14px;
  align-items: center;
}

.table__head {
  padding: 16px 24px;
  border-bottom: 1px solid var(--stroke-soft);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 11px;
  font-weight: 700;
  color: #7f8aa3;
  background: linear-gradient(180deg, rgba(246, 249, 255, 0.98), rgba(241, 246, 255, 0.92));
}

.table__row {
  padding: 18px 24px;
  border-bottom: 1px solid var(--stroke-soft);
  background: rgba(255, 255, 255, 0.72);
}

.table__row:last-child {
  border-bottom: none;
}

.table__empty {
  padding: 18px 24px;
  color: var(--muted);
}

.table__cell {
  min-width: 0;
}

.table__cell--title {
  color: var(--text-strong);
  font-weight: 700;
}

.table__cell--linked {
  color: var(--primary);
  font-weight: 600;
}

.attachment-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.attachment-action {
  border-radius: 8px;
  cursor: pointer;
}

.attachment-action--download {
  background: rgba(0, 163, 74, 0.08);
  border-color: rgba(0, 163, 74, 0.18);
  color: #087443;
}

.category-chip {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 11px;
  border-radius: 8px;
  color: #1450c8;
  border: 1px solid rgba(0, 74, 232, 0.16);
  background: rgba(0, 74, 232, 0.08);
  font-size: 12px;
  font-weight: 800;
}

.category-chip--nota-fiscal,
.category-chip--romaneio,
.category-chip--logistica,
.category-chip--pedido-de-compra {
  color: #087443;
  border-color: rgba(0, 163, 74, 0.18);
  background: rgba(0, 163, 74, 0.1);
}

.category-chip--cronograma,
.category-chip--orcamento,
.category-chip--proposta-comercial,
.category-chip--art,
.category-chip--memorial-de-calculo {
  color: #a36715;
  border-color: rgba(183, 121, 31, 0.22);
  background: rgba(183, 121, 31, 0.1);
}

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.pagination span {
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}

.pagination button {
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid rgba(0, 74, 232, 0.16);
  border-radius: 8px;
  color: var(--primary);
  background: rgba(0, 74, 232, 0.06);
  font-weight: 700;
  cursor: pointer;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
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

.preview-modal {
  display: grid;
  gap: 18px;
  width: min(940px, 100%);
  max-height: min(820px, calc(100vh - 48px));
  overflow: auto;
  padding: 22px;
  border-radius: 8px;
  background: var(--card);
  box-shadow: var(--shadow-lg);
}

.preview-modal__header,
.preview-modal__footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.preview-modal__header h3 {
  margin-top: 10px;
  color: var(--text-strong);
  font-size: 24px;
}

.preview-modal__header p,
.preview-modal__footer span {
  color: var(--muted);
  font-size: 14px;
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

.preview-frame {
  min-height: 420px;
  border: 1px solid var(--stroke-soft);
  border-radius: 8px;
  overflow: hidden;
  background: #f7faff;
}

.preview-frame iframe {
  width: 100%;
  height: 520px;
  border: none;
}

.preview-placeholder {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 10px;
  min-height: 420px;
  padding: 24px;
  text-align: center;
}

.preview-placeholder .material-icons {
  color: var(--primary);
  font-size: 42px;
}

.preview-placeholder strong {
  color: var(--text-strong);
  font-size: 18px;
}

@media (max-width: 920px) {
  .table__head {
    display: none;
  }

  .table__row {
    min-width: 0;
    grid-template-columns: 1fr;
  }

  .preview-modal__header,
  .preview-modal__footer {
    display: grid;
  }
}

@media (max-width: 640px) {
  .attachment-actions,
  .pagination {
    justify-content: stretch;
  }

  .attachment-actions > *,
  .pagination button {
    flex: 1;
  }

  .modal-backdrop {
    align-items: stretch;
    padding: 12px;
  }

  .preview-modal {
    max-height: calc(100vh - 24px);
  }
}
</style>

