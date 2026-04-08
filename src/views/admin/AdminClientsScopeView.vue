<template>
  <div class="page">

    <section class="metric-grid">
      <BaseCard v-for="card in summaryCards" :key="card.label">
        <p class="pill">{{ card.label }}</p>
        <strong class="metric-value" :style="{ color: card.accent }">{{ card.value }}</strong>
        <p>{{ card.detail }}</p>
      </BaseCard>
    </section>

    <BaseCard class="table-card">
      <div class="table">
        <div class="table__head">
          <span>Empresa</span>
          <span>Cidade e estado</span>
          <span>Contato principal</span>
          <span>E-mail</span>
          <span>Escopo liberado</span>
        </div>

        <div class="table__body">
          <div v-for="customer in customers" :key="customer.company" class="table__row">
            <span class="table__cell table__cell--title">{{ customer.company }}</span>
            <span class="table__cell">{{ customer.cityState }}</span>
            <span class="table__cell">{{ customer.primaryContact }}</span>
            <span class="table__cell">{{ customer.email }}</span>
            <span class="table__cell">{{ customer.scope }}</span>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import { getAdminPortalData } from '@/services/portalData';

const { summaryCards, customers } = getAdminPortalData();
</script>

<style scoped>
.metric-value {
  display: block;
  margin-top: 10px;
  font-size: 30px;
}

.table-card {
  padding: 0;
}

.table {
  display: grid;
}

.table__head,
.table__row {
  display: grid;
  grid-template-columns: 1.1fr 0.8fr 0.8fr 0.9fr 1.2fr;
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

@media (max-width: 1040px) {
  .table__head {
    display: none;
  }

  .table__row {
    grid-template-columns: 1fr;
  }
}
</style>

