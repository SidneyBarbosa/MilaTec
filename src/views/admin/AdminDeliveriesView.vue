<template>
  <div class="page">

    <BaseCard class="table-card">
      <div class="table">
        <div class="table__head">
          <span>Cliente</span>
          <span>Nome da entrega</span>
          <span>Data da entrega</span>
          <span>Quantidade</span>
          <span>Status</span>
        </div>

        <div class="table__body">
          <div v-for="delivery in deliveries" :key="`${delivery.client}-${delivery.name}`" class="table__row">
            <span class="table__cell table__cell--title">{{ delivery.client }}</span>
            <span class="table__cell">{{ delivery.name }}</span>
            <span class="table__cell">{{ delivery.date }}</span>
            <span class="table__cell">{{ delivery.quantity }}</span>
            <span class="table__cell">
              <span class="status-badge" :class="`status-badge--${delivery.tone}`">{{ delivery.status }}</span>
            </span>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import { getAdminPortalData } from '@/services/portalData';

const { deliveries } = getAdminPortalData();
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
  grid-template-columns: 1fr 1fr 0.8fr 0.8fr 0.7fr;
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

@media (max-width: 960px) {
  .table__head {
    display: none;
  }

  .table__row {
    grid-template-columns: 1fr;
  }
}
</style>

