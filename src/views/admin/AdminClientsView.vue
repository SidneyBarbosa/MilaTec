<template>
  <div class="page">

    <BaseCard class="table-card">
      <div class="table table--clients">
        <div class="table__head">
          <span>Cliente</span>
          <span>Projeto</span>
          <span>Ultimo sync</span>
          <span>Contato</span>
          <span>Payload liberado</span>
          <span>Acesso</span>
        </div>

        <div class="table__body">
          <div v-for="item in clientSnapshots" :key="`${item.client}-${item.project}`" class="table__row">
            <span class="table__cell table__cell--title">{{ item.client }}</span>
            <span class="table__cell">{{ item.project }}</span>
            <span class="table__cell">{{ item.lastSync }}</span>
            <span class="table__cell">{{ item.contact }}</span>
            <span class="table__cell">{{ item.exposure }}</span>
            <span class="table__cell">{{ item.access }}</span>
          </div>
        </div>
      </div>
    </BaseCard>

    <section class="matrix-grid">
      <BaseCard v-for="rule in securityRules" :key="rule" variant="flat">
        <p>{{ rule }}</p>
      </BaseCard>
    </section>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import { getPortalReadModel } from '@/services/readModel';

const { clientSnapshots, securityRules } = getPortalReadModel('admin');
</script>

<style scoped>
.side-note {
  max-width: 360px;
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
  grid-template-columns: 1.2fr 1fr 0.7fr 1fr 1.3fr 1fr;
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

.table__cell {
  color: var(--text);
  line-height: 1.5;
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

@media (max-width: 980px) {
  .table__head {
    display: none;
  }

  .table__row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>

