<template>
  <div class="dashboard-grid">
    <section class="summary">
      <BaseCard
        v-for="card in summaryCards"
        :key="card.label"
        class="summary__card"
      >
        <p class="pill">{{ card.label }}</p>
        <h2 :style="{ color: card.accent }">{{ card.value }}</h2>
        <p class="text-muted">{{ card.detail }}</p>
      </BaseCard>
    </section>

    <section class="layout-two">
      <BaseCard class="progress">
        <header class="section-header">
          <div>
            <p class="pill">Progresso da obra</p>
            <h3>Etapas</h3>
          </div>
        </header>
        <div class="progress__steps">
          <div
            v-for="(step, index) in progressSteps"
            :key="step.key"
            class="step"
            :class="step.status"
          >
            <div class="step__marker">
              <span class="dot" />
            </div>
            <div class="step__body">
              <p class="step__label">{{ step.label }}</p>
              <small v-if="step.status === 'current'">Etapa em andamento</small>
            </div>
            <div v-if="index < progressSteps.length - 1" class="step__line" />
          </div>
        </div>
      </BaseCard>

      <BaseCard class="updates">
        <header class="section-header">
          <div>
            <p class="pill">Atualizações recentes</p>
            <h3>Movimentações do projeto</h3>
          </div>
        </header>
        <ul class="updates__list">
          <li v-for="item in updates" :key="item.title" class="updates__item">
            <div class="updates__icon" :class="item.type" />
            <div>
              <p class="updates__title">{{ item.title }}</p>
              <small class="text-muted">{{ item.date }}</small>
            </div>
          </li>
        </ul>
      </BaseCard>
    </section>

    <BaseCard class="overview">
      <header class="section-header">
        <div>
          <p class="pill">Visão geral</p>
          <h3>Resumo rápido</h3>
        </div>
      </header>
      <p class="overview__message">
        {{ overviewMessage }}
      </p>
    </BaseCard>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import { summaryCards, progressSteps, updates, overviewMessage } from '@/mocks/dashboard';
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  gap: var(--space-5);
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-4);
}

.summary__card h2 {
  margin: 6px 0 4px;
}

.layout-two {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--space-5);
}

.section-header h3 {
  margin: 4px 0 0;
}

.progress__steps {
  display: grid;
  gap: var(--space-4);
  margin-top: var(--space-4);
}

.step {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: var(--space-3);
  position: relative;
  padding-left: 4px;
}

.step__marker {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--stroke);
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.04);
}

.step.current .step__marker {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(0, 168, 107, 0.25);
}

.step.done .step__marker {
  border-color: var(--primary);
  background: var(--primary);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
}

.step__body .step__label {
  margin: 0;
  font-weight: 600;
}

.step__body small {
  color: var(--muted);
}

.step__line {
  position: absolute;
  left: 8px;
  top: 24px;
  bottom: -24px;
  width: 2px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.04));
}

.step:last-child .step__line {
  display: none;
}

.updates__list {
  list-style: none;
  padding: 0;
  margin: var(--space-4) 0 0;
  display: grid;
  gap: var(--space-3);
}

.updates__item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-3);
  align-items: center;
}

.updates__icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--stroke);
}

.updates__icon.document {
  background: linear-gradient(135deg, var(--primary), var(--accent));
}

.updates__icon.milestone {
  background: linear-gradient(135deg, #2ed3a0, #00a86b);
}

.updates__icon.delivery {
  background: linear-gradient(135deg, #f5f7fa, #c8d3e6);
}

.updates__title {
  margin: 0;
  font-weight: 600;
}

.overview__message {
  margin-top: var(--space-3);
  font-size: var(--fs-lg);
  line-height: 1.5;
  color: var(--text-strong);
}

@media (max-width: 960px) {
  .layout-two {
    grid-template-columns: 1fr;
  }
}
</style>
