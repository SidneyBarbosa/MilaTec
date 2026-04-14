<template>
  <div class="page">
    <BaseCard class="welcome-card">
      <p class="pill">Portal do cliente</p>
      <h3>{{ home.welcomeTitle }}</h3>
      <p>{{ home.welcomeText }}</p>
    </BaseCard>

    <section class="metric-grid">
      <BaseCard v-for="card in home.summaryCards" :key="card.label" class="metric-card">
        <p class="pill">{{ card.label }}</p>
        <strong class="metric-card__value" :style="{ color: card.accent }">{{ card.value }}</strong>
        <p>{{ card.detail }}</p>
      </BaseCard>
    </section>

    <section class="dashboard-grid">
      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Acompanhamento</p>
            <h3>Próximas movimentações</h3>
          </div>
        </template>

        <ul class="summary-list">
          <li v-for="delivery in nextDeliveries" :key="delivery.id">
            <span class="status-badge" :class="`status-badge--${delivery.tone}`">
              {{ delivery.displayDate }}
            </span>
            <div>
              <strong>{{ delivery.name }}</strong>
              <p>{{ delivery.projectName }} · {{ delivery.workName }}</p>
            </div>
          </li>
        </ul>
      </BaseCard>

      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Instalações</p>
            <h3>Agenda prevista</h3>
          </div>
        </template>

        <ul class="summary-list">
          <li v-for="installation in nextInstallations" :key="installation.id">
            <span class="status-badge" :class="`status-badge--${installation.tone}`">
              {{ installation.displayDate }}
            </span>
            <div>
              <strong>{{ installation.name }}</strong>
              <p>{{ installation.team }}</p>
            </div>
          </li>
        </ul>
      </BaseCard>
    </section>

    <BaseCard variant="flat">
      <p>Este portal é visual e serve para acompanhamento. Alterações devem ser tratadas pelo canal de suporte.</p>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseCard from '@/components/common/BaseCard.vue';
import { useClientPortalData } from '@/composables/useClientPortalData';

const { portalData } = useClientPortalData();

const home = computed(() => portalData.value.home);
const nextDeliveries = computed(() => home.value.nextDeliveries);
const nextInstallations = computed(() => home.value.nextInstallations);
</script>

<style scoped>
.welcome-card h3,
.metric-card__value,
.summary-list strong {
  display: block;
}

.welcome-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(244, 249, 255, 0.96));
}

.welcome-card h3 {
  color: var(--text-strong);
  font-size: 28px;
}

.metric-card__value {
  margin-top: 10px;
  font-size: 28px;
  line-height: 1.2;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
}

.summary-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 14px;
}

.summary-list li {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--stroke-soft);
}

.summary-list li:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.summary-list strong {
  color: var(--text-strong);
}

@media (max-width: 960px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .summary-list li {
    grid-template-columns: 1fr;
  }
}
</style>
