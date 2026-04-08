<template>
  <div class="page">
    <BaseCard class="meta-card" variant="flat">
      <span class="pill">{{ platform.mode }}</span>
      <strong>{{ platform.source }}</strong>
      <p>Dados organizados pela {{ platform.apiLayer }} em {{ platform.syncedAt }}.</p>
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
            <p class="pill">Fluxo do projeto</p>
            <h3>Etapas publicadas</h3>
          </div>
        </template>

        <div class="steps">
          <div v-for="step in progressSteps" :key="step.key" class="step" :class="`step--${step.status}`">
            <span class="step__marker" />
            <div>
              <strong>{{ step.label }}</strong>
              <p>{{ step.status === 'current' ? 'Etapa em andamento' : 'Status consolidado pela API' }}</p>
            </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Atualizacoes recentes</p>
            <h3>Publicacoes homologadas</h3>
          </div>
        </template>

        <ul class="updates">
          <li v-for="item in updates" :key="item.title" class="updates__item">
            <span class="status-badge" :class="`status-badge--${item.type}`">{{ item.date }}</span>
            <div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.detail }}</p>
            </div>
          </li>
        </ul>
      </BaseCard>
    </section>

    <section class="dashboard-grid">
      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Resumo do produto</p>
            <h3>Leitura protegida</h3>
          </div>
        </template>

        <p class="summary-copy">{{ overviewMessage }}</p>
      </BaseCard>

      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Políticas do painel</p>
            <h3>O que esta sendo garantido</h3>
          </div>
        </template>

        <ul class="rules">
          <li v-for="notice in readOnlyNotices" :key="notice.title">
            <strong>{{ notice.title }}</strong>
            <p>{{ notice.description }}</p>
          </li>
        </ul>
      </BaseCard>
    </section>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import { getPlatformMeta, getPortalReadModel } from '@/services/readModel';

const platform = getPlatformMeta();
const { summaryCards, progressSteps, updates, overviewMessage, readOnlyNotices } = getPortalReadModel(
  'client',
);
</script>

<style scoped>
.meta-card strong,
.metric-card__value,
.step strong,
.updates__item strong,
.rules strong {
  display: block;
}

.meta-card strong {
  margin-top: 12px;
  color: var(--text-strong);
  font-size: 18px;
}

.metric-card__value {
  margin-top: 10px;
  font-size: 30px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: var(--space-5);
}

.steps,
.updates,
.rules {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 14px;
}

.step,
.updates__item,
.rules li {
  display: grid;
  gap: 10px;
}

.step {
  grid-template-columns: 18px 1fr;
  align-items: start;
}

.step__marker {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  margin-top: 4px;
  background: #d7deeb;
}

.step--done .step__marker {
  background: var(--accent);
}

.step--current .step__marker {
  background: var(--primary);
  box-shadow: 0 0 0 5px rgba(30, 58, 138, 0.14);
}

.step strong,
.updates__item strong,
.rules strong {
  color: var(--text-strong);
}

.summary-copy {
  margin-top: 4px;
}

@media (max-width: 960px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>

