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
              <a>
                :href="attachment.href"
                class="attachment-action"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`Visualizar ${attachment.name} em nova aba`"
                @click="handleOpenInNewTab($event, attachment)"
              >
                <span class="material-icons" aria-hidden="true">visibility</span>
                <span>Visualizar</span>
              </a>
              <a>
                :href="attachment.href"
                class="attachment-action attachment-action--download"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`Baixar ${attachment.name} em nova aba`"
                @click="handleOpenInNewTab($event, attachment)"
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

/* Abre o anexo em uma nova aba do navegador.
   Evita problemas de iframe bloqueado pelo Chrome (URLs do Airtable
   não permitem embed por segurança). */
const handleOpenInNewTab = (event, attachment) => {
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
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid rgba(0, 74, 232, 0.16);
  border-radius: 8px;
  color: var(--primary);
  background: rgba(0, 74, 232, 0.06);
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}

.attachment-action:hover {
  background: rgba(0, 74, 232, 0.12);
}

.attachment-action--download {
  background: rgba(0, 163, 74, 0.08);
  border-color: rgba(0, 163, 74, 0.18);
  color: #087443;
}

.attachment-action--download:hover {
  background: rgba(0, 163, 74, 0.16);
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

@media (max-width: 920px) {
  .table__head {
    display: none;
  }

  .table__row {
    min-width: 0;
    grid-template-columns: 1fr;
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
}
</style>