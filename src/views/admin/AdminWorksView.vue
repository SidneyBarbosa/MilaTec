<template>
  <div class="page">
    <FiltersBar
      :count="filteredWorks.length"
      :total="works.length"
      label="obras"
      :show-clear="Boolean(searchTerm || selectedStage)"
      @clear="clearFilters"
    >
      <BaseInput v-model="searchTerm" label="Buscar" placeholder="Cliente, obra ou cidade" tone="light" />
      <BaseSelect v-model="selectedStage" label="Etapa" :options="stageOptions" tone="light" />
    </FiltersBar>

    <BaseCard class="table-card">
      <div class="table">
        <div class="table__head">
          <span>Cliente</span>
          <span>Nome da obra</span>
          <span>Cidade da obra</span>
          <span>Etapa atual da obra</span>
        </div>

        <div class="table__body">
          <div v-for="work in filteredWorks" :key="`${work.client}-${work.name}`" class="table__row">
            <span class="table__cell table__cell--title">{{ work.client }}</span>
            <span class="table__cell">{{ work.name }}</span>
            <span class="table__cell">{{ work.city }}</span>
            <span class="table__cell">
              <span class="status-badge status-badge--info">{{ work.stage }}</span>
            </span>
          </div>

          <p v-if="!filteredWorks.length" class="table__empty">Nenhuma obra encontrada com os filtros atuais.</p>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import BaseCard from '@/components/common/BaseCard.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseSelect from '@/components/common/BaseSelect.vue';
import FiltersBar from '@/components/common/FiltersBar.vue';
import { getAdminPortalData } from '@/services/portalData';
import { matchesSearch, uniqueTextOptions } from '@/utils/text';

const { works } = getAdminPortalData();
const searchTerm = ref('');
const selectedStage = ref('');

const stageOptions = computed(() => [
  { label: 'Todas as etapas', value: '' },
  ...uniqueTextOptions(works.map((work) => work.stage)).map((stage) => ({
    label: stage,
    value: stage,
  })),
]);

const filteredWorks = computed(() =>
  works.filter(
    (work) =>
      (!selectedStage.value || work.stage === selectedStage.value) &&
      matchesSearch([work.client, work.name, work.city, work.stage], searchTerm.value),
  ),
);

const clearFilters = () => {
  searchTerm.value = '';
  selectedStage.value = '';
};
</script>

<style scoped>
.table-card {
  padding: 0;
}

.table {
  display: grid;
}

.table__head,
.table__row {
  display: grid;
  grid-template-columns: 1fr 1fr 0.8fr 0.9fr;
  gap: 14px;
  align-items: center;
}

.table__head {
  padding: 18px 22px;
  border-bottom: 1px solid var(--stroke);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
}

.table__row {
  padding: 18px 22px;
  border-bottom: 1px solid var(--stroke);
}

.table__row:last-child {
  border-bottom: none;
}

.table__empty {
  padding: 18px 22px;
  color: var(--muted);
}

.table__cell--title {
  color: var(--text-strong);
  font-weight: 600;
}

@media (max-width: 920px) {
  .table__head {
    display: none;
  }

  .table__row {
    grid-template-columns: 1fr;
  }
}
</style>
