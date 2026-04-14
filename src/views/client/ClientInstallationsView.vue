<template>
  <div class="page">
    <BaseCard class="table-card">
      <div class="table">
        <div class="table__head">
          <span>Nome da instalação</span>
          <span>Data</span>
          <span>Equipe</span>
          <span>Status</span>
        </div>

        <div class="table__body">
          <div
            v-for="installation in installations"
            :key="installation.id"
            class="table__row"
            :class="{ 'table__row--pending-date': !installation.hasDate }"
          >
            <span class="table__cell table__cell--title">{{ installation.name }}</span>
            <span class="table__cell">
              <span class="installation-date" :class="{ 'installation-date--pending': !installation.hasDate }">
                {{ installation.displayDate }}
              </span>
            </span>
            <span class="table__cell">{{ installation.team }}</span>
            <span class="table__cell">
              <span class="status-badge" :class="`status-badge--${installation.tone}`">
                {{ installation.status }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseCard from '@/components/common/BaseCard.vue';
import { useClientPortalData } from '@/composables/useClientPortalData';

const { portalData } = useClientPortalData();
const installations = computed(() => portalData.value.installations);
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
  grid-template-columns: 1.25fr 0.75fr 0.95fr 0.75fr;
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

.table__row--pending-date {
  background: rgba(183, 121, 31, 0.08);
  box-shadow: inset 4px 0 0 rgba(183, 121, 31, 0.7);
}

.installation-date {
  color: var(--text);
  font-weight: 600;
}

.installation-date--pending {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  color: #a36715;
  background: rgba(183, 121, 31, 0.12);
  border: 1px solid rgba(183, 121, 31, 0.24);
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
