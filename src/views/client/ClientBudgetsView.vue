<template>
  <div class="page">

    <BaseCard class="table-card">
      <div class="table">
        <div class="table__head">
          <span>Nome do orçamento</span>
          <span>Status</span>
          <span>Valor</span>
          <span>Data</span>
        </div>

        <div class="table__body">
          <div
            v-for="budget in budgets"
            :key="budget.id"
            class="table__row"
            :class="{ 'table__row--active': selectedBudget?.id === budget.id }"
            role="button"
            tabindex="0"
            @click="selectBudget(budget)"
            @keydown.enter.prevent="selectBudget(budget)"
            @keydown.space.prevent="selectBudget(budget)"
          >
            <span class="table__cell table__cell--title">{{ budget.name }}</span>
            <span class="table__cell">
              <span class="status-badge" :class="`status-badge--${budget.tone}`">
                {{ budget.status }}
              </span>
            </span>
            <span class="table__cell">{{ budget.value }}</span>
            <span class="table__cell">{{ budget.date }}</span>
          </div>
        </div>
      </div>
    </BaseCard>

    <BaseCard v-if="selectedBudget" class="budget-detail">
      <template #header>
        <div>
          <p class="pill">Detalhe do orçamento</p>
          <h3>{{ selectedBudget.name }}</h3>
        </div>
        <span class="status-badge" :class="`status-badge--${selectedBudget.tone}`">
          {{ selectedBudget.status }}
        </span>
      </template>

      <p>{{ selectedBudget.description }}</p>

      <div class="detail-grid">
        <div>
          <span>Valor</span>
          <strong>{{ selectedBudget.value }}</strong>
        </div>
        <div>
          <span>Data</span>
          <strong>{{ selectedBudget.date }}</strong>
        </div>
      </div>

      <div class="attachments-block">
        <h4>Arquivos do orçamento</h4>

        <div v-if="selectedBudget.attachments.length" class="attachment-list">
          <a
            v-for="attachment in selectedBudget.attachments"
            :key="attachment.id"
            :href="attachment.href"
            class="attachment-action"
            :aria-label="attachment.actionLabel"
          >
            <span class="material-icons" aria-hidden="true">{{ resolveActionIcon(attachment.actionLabel) }}</span>
            <span>{{ attachment.name }}</span>
          </a>
        </div>

        <p v-else>Nenhum arquivo liberado para este orçamento.</p>
      </div>
    </BaseCard>

    <BaseCard v-else variant="flat">
      <p>Selecione um orçamento para consultar os arquivos vinculados.</p>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import BaseCard from '@/components/common/BaseCard.vue';
import { useClientPortalData } from '@/composables/useClientPortalData';

const { portalData } = useClientPortalData();
const selectedBudgetId = ref('');

const budgets = computed(() => portalData.value.budgets);
const selectedBudget = computed(
  () => budgets.value.find((budget) => budget.id === selectedBudgetId.value) || null,
);

const selectBudget = (budget) => {
  selectedBudgetId.value = budget.id;
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
.table-card {
  padding: 0;
}

.table {
  display: grid;
}

.table__head,
.table__row {
  display: grid;
  grid-template-columns: 1.35fr 0.75fr 0.85fr 0.7fr;
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

.table__cell--title {
  color: var(--text-strong);
  font-weight: 600;
}

.table__row--active {
  background: #f2f7ff;
  box-shadow: inset 4px 0 0 var(--primary);
}

.budget-detail h4 {
  margin: 0;
  color: var(--text-strong);
  font-size: var(--fs-md);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4);
}

.detail-grid div {
  padding: 14px;
  border-radius: var(--radius-md);
  background: #f7faff;
  border: 1px solid var(--stroke-soft);
}

.detail-grid span,
.detail-grid strong {
  display: block;
}

.detail-grid span {
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.detail-grid strong {
  margin-top: 6px;
  color: var(--text-strong);
  font-size: 18px;
}

.attachments-block,
.attachment-list {
  display: grid;
  gap: 12px;
}

.attachment-list {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.attachment-list .attachment-action {
  justify-content: flex-start;
  border-radius: var(--radius-md);
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

