<template>
  <div class="page">

    <section class="metric-grid">
      <BaseCard v-for="queue in operationalQueues" :key="queue.label" class="queue-card">
        <span class="status-badge" :class="`status-badge--${queue.tone}`">{{ queue.label }}</span>
        <strong class="queue-card__value">{{ queue.value }}</strong>
        <p>{{ queue.detail }}</p>
      </BaseCard>
    </section>

    <section class="split-grid">
      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Timeline de sync</p>
            <h3>Última cadeia de publicação</h3>
          </div>
        </template>

        <ul class="timeline">
          <li v-for="step in syncTimeline" :key="step.time" class="timeline__item">
            <span class="timeline__time">{{ step.time }}</span>
            <div class="timeline__body">
              <strong>{{ step.title }}</strong>
              <p>{{ step.description }}</p>
            </div>
          </li>
        </ul>
      </BaseCard>

      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Padrao de produto</p>
            <h3>Regras de leitura aplicadas</h3>
          </div>
        </template>

        <ol class="flow">
          <li v-for="step in platform.flow" :key="step">
            {{ step }}
          </li>
        </ol>
      </BaseCard>
    </section>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import { getPlatformMeta, getPortalReadModel } from '@/services/readModel';

const platform = getPlatformMeta();
const { operationalQueues, syncTimeline } = getPortalReadModel('admin');
</script>

<style scoped>
.split-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: var(--space-5);
}

.queue-card__value,
.timeline__body strong,
.timeline__time {
  display: block;
}

.queue-card__value {
  margin-top: 12px;
  font-size: 30px;
  color: var(--text-strong);
}

.timeline,
.flow {
  margin: 0;
  padding: 0;
}

.timeline {
  list-style: none;
  display: grid;
  gap: 16px;
}

.timeline__item {
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 14px;
  align-items: start;
}

.timeline__time {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
}

.timeline__body strong {
  color: var(--text-strong);
}

.timeline__body p {
  margin-top: 6px;
}

.flow {
  display: grid;
  gap: 14px;
  padding-left: 20px;
}

@media (max-width: 960px) {
  .split-grid {
    grid-template-columns: 1fr;
  }
}
</style>


