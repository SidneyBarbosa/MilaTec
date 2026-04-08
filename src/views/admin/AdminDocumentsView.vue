<template>
  <div class="page">

    <BaseCard class="table-card">
      <div class="table">
        <div class="table__head">
          <span>Documento</span>
          <span>Visibilidade</span>
          <span>Status</span>
          <span>Politica</span>
        </div>

        <div class="table__body">
          <div v-for="doc in documentHealth" :key="doc.name" class="table__row">
            <span class="table__cell table__cell--title">{{ doc.name }}</span>
            <span class="table__cell">{{ doc.visibility }}</span>
            <span class="table__cell">
              <span class="status-badge" :class="`status-badge--${doc.statusTone}`">
                {{ doc.statusLabel }}
              </span>
            </span>
            <span class="table__cell">{{ doc.policy }}</span>
          </div>
        </div>
      </div>
    </BaseCard>

    <section class="notes-grid">
      <BaseCard v-for="rule in securityRules" :key="rule" variant="flat">
        <p>{{ rule }}</p>
      </BaseCard>
    </section>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import { getPortalReadModel } from '@/services/readModel';

const { documentHealth, securityRules } = getPortalReadModel('admin');
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
  grid-template-columns: 1.1fr 0.8fr 0.7fr 1.4fr;
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

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-4);
}

@media (max-width: 860px) {
  .table__head {
    display: none;
  }

  .table__row {
    grid-template-columns: 1fr;
  }
}
</style>

