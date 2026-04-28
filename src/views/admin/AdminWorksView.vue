<template>
  <div class="page page--wide">
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

    <section v-if="filteredWorks.length" class="kanban-board" aria-label="Obras por etapa">
      <article
        v-for="column in kanbanColumns"
        :key="column.stage"
        class="kanban-column"
        :style="stageStyle(column.stage, 'work')"
      >
        <header class="kanban-column__header">
          <div>
            <span class="column-label">Etapa da obra</span>
            <h3>{{ column.stage }}</h3>
          </div>
          <strong>{{ column.total }}</strong>
        </header>

        <div class="kanban-column__body">
          <article v-for="work in column.items" :key="`${work.client}-${work.name}`" class="kanban-card">
            <span class="kanban-card__title">{{ work.name }}</span>

            <span class="kanban-card__fields">
              <span class="kanban-card__field">
                <span>Cliente</span>
                <strong>{{ work.client }}</strong>
              </span>
              <span class="kanban-card__field">
                <span>Cidade</span>
                <strong>{{ work.city }}</strong>
              </span>
            </span>
          </article>
        </div>
      </article>
    </section>

    <div v-else class="board-empty">Nenhuma obra encontrada com os filtros atuais.</div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseSelect from '@/components/common/BaseSelect.vue';
import FiltersBar from '@/components/common/FiltersBar.vue';
import { getAdminPortalData } from '@/services/portalData';
import { matchesSearch, uniqueTextOptions } from '@/utils/text';
import { stageStyle } from '@/utils/stageColors';

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

const kanbanColumns = computed(() => {
  const stages = [...new Set(filteredWorks.value.map((work) => work.stage))];

  return stages.map((stage) => {
    const stageItems = filteredWorks.value.filter((work) => work.stage === stage);

    return {
      stage,
      total: stageItems.length,
      items: stageItems,
    };
  });
});

const clearFilters = () => {
  searchTerm.value = '';
  selectedStage.value = '';
};
</script>

<style scoped>
.kanban-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 304px));
  gap: 14px;
  align-items: start;
  justify-content: start;
}

.board-empty {
  padding: 18px 20px;
  border: 1px solid var(--stroke-soft);
  border-radius: 8px;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.76);
}

.kanban-column {
  display: grid;
  min-height: 280px;
  border: 1px solid var(--stage-border, var(--stroke-soft));
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.68);
  overflow: hidden;
  box-shadow: inset 4px 0 0 var(--stage-color, var(--primary)), 0 10px 22px rgba(5, 8, 102, 0.06);
}

.kanban-column__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 14px;
  border-bottom: 1px solid var(--stage-border, var(--stroke-soft));
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.72)),
    var(--stage-bg, rgba(241, 246, 255, 0.92));
}

.kanban-column__header h3 {
  color: var(--stage-color, var(--text-strong));
  font-size: 15px;
  line-height: 1.25;
}

.kanban-column__header strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  color: var(--stage-color, var(--primary));
  background: var(--stage-bg, rgba(0, 74, 232, 0.08));
  border: 1px solid var(--stage-border, rgba(0, 74, 232, 0.14));
}

.column-label {
  display: block;
  margin-bottom: 6px;
  color: var(--muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.kanban-column__body {
  display: grid;
  gap: 9px;
  align-content: start;
  padding: 10px;
}

.kanban-card {
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid #e6edf6;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 6px 14px rgba(5, 8, 102, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.kanban-card:hover {
  transform: translateY(-1px);
  border-color: rgba(0, 74, 232, 0.2);
  box-shadow: 0 10px 18px rgba(5, 8, 102, 0.08);
}

.kanban-card__title {
  display: block;
  color: var(--text-strong);
  font-size: 15px;
  font-weight: 800;
  line-height: 1.28;
}

.kanban-card__fields {
  display: grid;
  gap: 7px;
}

.kanban-card__field {
  display: grid;
  gap: 2px;
}

.kanban-card__field > span {
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.kanban-card__field strong {
  color: var(--text);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
}
</style>
