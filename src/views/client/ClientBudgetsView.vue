<template>
  <div class="page">

    <BaseCard class="table-card">
      <div class="table">
        <div class="table__head">
          <span>Pacote</span>
          <span>Referencia</span>
          <span>Valor</span>
          <span>Status</span>
          <span>Escopo exposto</span>
        </div>

        <div class="table__body">
          <div v-for="budget in budgets" :key="budget.name" class="table__row">
            <span class="table__cell table__cell--title">{{ budget.name }}</span>
            <span class="table__cell">{{ budget.reference }}</span>
            <span class="table__cell">{{ budget.value }}</span>
            <span class="table__cell">
              <span class="status-badge" :class="`status-badge--${budget.statusTone}`">
                {{ budget.statusLabel }}
              </span>
            </span>
            <span class="table__cell">{{ budget.scope }}</span>
          </div>
        </div>
      </div>
    </BaseCard>

    <section class="matrix-grid">
      <BaseCard v-for="rule in accessRules" :key="rule" variant="flat">
        <p>{{ rule }}</p>
      </BaseCard>
    </section>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import { getPortalReadModel } from '@/services/readModel';

const { budgets, accessRules } = getPortalReadModel('client');
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
  grid-template-columns: 1.2fr 1fr 0.8fr 0.7fr 1.4fr;
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

.matrix-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-4);
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

