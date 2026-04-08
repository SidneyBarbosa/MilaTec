<template>
  <div class="page page--wide">

    <BaseCard class="table-card">
      <div class="table">
        <div class="table__head">
          <span>Cliente</span>
          <span>Nome do projeto</span>
          <span>Local</span>
          <span>Tipo</span>
          <span>Etapa</span>
          <span>Quantidade</span>
          <span>Valor unitario</span>
          <span>Valor total</span>
        </div>

        <div class="table__body">
          <div v-for="project in projects" :key="`${project.client}-${project.name}`" class="table__row">
            <span class="table__cell table__cell--title">{{ project.client }}</span>
            <span class="table__cell">{{ project.name }}</span>
            <span class="table__cell">{{ project.location }}</span>
            <span class="table__cell">{{ project.type }}</span>
            <span class="table__cell">
              <span class="status-badge status-badge--info">{{ project.stage }}</span>
            </span>
            <span class="table__cell">{{ project.quantity }}</span>
            <span class="table__cell">{{ project.unitValue }}</span>
            <span class="table__cell">{{ project.totalValue }}</span>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import { getAdminPortalData } from '@/services/portalData';

const { projects } = getAdminPortalData();
</script>

<style scoped>
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
  min-width: 1120px;
  grid-template-columns:
    minmax(140px, 0.95fr)
    minmax(160px, 1.05fr)
    minmax(130px, 0.86fr)
    minmax(140px, 0.9fr)
    minmax(180px, 1.14fr)
    minmax(120px, 0.82fr)
    minmax(130px, 0.88fr)
    minmax(130px, 0.92fr);
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

.table__cell .status-badge {
  max-width: 100%;
}

@media (max-width: 1240px) {
  .table__head {
    display: none;
  }

  .table__row {
    grid-template-columns: 1fr;
  }
}
</style>

