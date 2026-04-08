<template>
  <div class="page">
    <BaseCard class="meta-card" variant="flat">
      <span class="pill">{{ platform.mode }}</span>
      <strong>{{ platform.source }}</strong>
      <p>Ultimo sync organizado pela {{ platform.apiLayer }} em {{ platform.syncedAt }}.</p>
    </BaseCard>

    <section class="metric-grid">
      <BaseCard v-for="card in summaryCards" :key="card.label" class="metric-card">
        <p class="pill">{{ card.label }}</p>
        <strong class="metric-card__value" :style="{ color: card.accent }">{{ card.value }}</strong>
        <p>{{ card.detail }}</p>
      </BaseCard>
    </section>

    <section class="dashboard-grid">
      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Alertas de governança</p>
            <h3>Riscos e bloqueios monitorados</h3>
          </div>
        </template>

        <ul class="stack-list">
          <li v-for="alert in alerts" :key="alert.title" class="alert" :class="`alert--${alert.severity}`">
            <strong>{{ alert.title }}</strong>
            <p>{{ alert.detail }}</p>
          </li>
        </ul>
      </BaseCard>

      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Resumo executivo</p>
            <h3>Leitura operacional do produto</h3>
          </div>
        </template>

        <p class="summary-copy">{{ overviewMessage }}</p>

        <ul class="rules">
          <li v-for="rule in securityRules" :key="rule">
            {{ rule }}
          </li>
        </ul>
      </BaseCard>
    </section>

    <section class="metric-grid">
      <BaseCard v-for="queue in operationalQueues" :key="queue.label" class="queue-card">
        <span class="status-badge" :class="`status-badge--${queue.tone}`">{{ queue.label }}</span>
        <strong class="queue-card__value">{{ queue.value }}</strong>
        <p>{{ queue.detail }}</p>
      </BaseCard>
    </section>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import { getPlatformMeta, getPortalReadModel } from '@/services/readModel';

const platform = getPlatformMeta();
const { summaryCards, alerts, operationalQueues, securityRules, overviewMessage } = getPortalReadModel(
  'admin',
);
</script>

<style scoped>
.meta-card strong {
  display: block;
  margin-top: 12px;
  color: var(--text-strong);
  font-size: 18px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: var(--space-5);
}

.stack-list,
.rules {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.alert {
  padding: 16px;
  border-radius: 18px;
  border: 1px solid var(--stroke);
  background: #f8fbff;
}

.alert--attention {
  border-color: rgba(212, 160, 23, 0.4);
  background: rgba(212, 160, 23, 0.08);
}

.alert--safe {
  border-color: rgba(0, 168, 107, 0.28);
  background: rgba(0, 168, 107, 0.08);
}

.alert strong,
.queue-card__value {
  display: block;
}

.alert strong {
  color: var(--text-strong);
}

.alert p,
.summary-copy {
  margin-top: 8px;
}

.rules li {
  padding-left: 18px;
  position: relative;
}

.rules li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
}

.queue-card__value {
  margin-top: 12px;
  font-size: 30px;
  color: var(--text-strong);
}

@media (max-width: 960px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>

