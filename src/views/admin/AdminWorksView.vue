<template>
  <div class="page">

    <BaseCard class="table-card">
      <div class="table">
        <div class="table__head">
          <span>Cliente</span>
          <span>Nome da obra</span>
          <span>Cidade da obra</span>
          <span>Etapa atual da obra</span>
        </div>

        <div class="table__body">
          <div v-for="work in works" :key="`${work.client}-${work.name}`" class="table__row">
            <span class="table__cell table__cell--title">{{ work.client }}</span>
            <span class="table__cell">{{ work.name }}</span>
            <span class="table__cell">{{ work.city }}</span>
            <span class="table__cell">
              <span class="status-badge status-badge--info">{{ work.stage }}</span>
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

const { works } = getAdminPortalData();
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

