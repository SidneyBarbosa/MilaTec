<template>
  <div class="budgets">
    <header class="section-header">
      <div>
        <p class="pill">Finanças</p>
        <h1>Orçamentos</h1>
        <p class="text-muted">Visão geral dos orçamentos do seu projeto.</p>
      </div>
    </header>

    <BaseCard class="table">
      <div class="table__head">
        <span>Nome</span>
        <span>Data</span>
        <span>Valor</span>
        <span>Status</span>
        <span>Observações</span>
      </div>

      <div class="table__body">
        <div v-for="item in budgets" :key="item.name" class="table__row">
          <div class="cell name">
            <p class="title">{{ item.name }}</p>
          </div>
          <div class="cell">{{ item.date }}</div>
          <div class="cell">{{ item.value }}</div>
          <div class="cell">
            <span class="badge" :class="item.status">
              {{ item.status }}
            </span>
          </div>
          <div class="cell text-muted">{{ item.notes }}</div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import { budgets } from '@/mocks/budgets';
</script>

<style scoped>
.budgets {
  display: grid;
  gap: var(--space-4);
}

h1 {
  margin: 4px 0 6px;
}

.table {
  padding: 0;
}

.table__head,
.table__row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 2fr;
  gap: var(--space-3);
  align-items: center;
}

.table__head {
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--stroke);
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-size: var(--fs-xs);
}

.table__body {
  display: grid;
}

.table__row {
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--stroke);
  transition: background 0.15s ease, transform 0.15s ease;
}

.table__row:hover {
  background: rgba(255, 255, 255, 0.04);
  transform: translateY(-1px);
}

.cell .title {
  margin: 0;
  font-weight: 600;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 600;
  text-transform: capitalize;
  border: 1px solid transparent;
}

.badge.aprovado {
  color: #0f9d58;
  border-color: rgba(15, 157, 88, 0.35);
  background: rgba(15, 157, 88, 0.12);
}

.badge.pendente {
  color: #d4a017;
  border-color: rgba(212, 160, 23, 0.4);
  background: rgba(212, 160, 23, 0.12);
}

.badge.reprovado {
  color: #e35d6a;
  border-color: rgba(227, 93, 106, 0.4);
  background: rgba(227, 93, 106, 0.12);
}

@media (max-width: 900px) {
  .table__head {
    display: none;
  }

  .table__row {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }

  .cell {
    display: flex;
    justify-content: space-between;
    gap: var(--space-2);
  }

  .cell .title {
    font-size: var(--fs-lg);
  }
}
</style>
