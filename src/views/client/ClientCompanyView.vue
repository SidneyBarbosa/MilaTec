<template>
  <div class="page">

    <section class="metric-grid">
      <BaseCard v-for="card in summaryCards" :key="card.label">
        <p class="pill">{{ card.label }}</p>
        <strong class="metric-value" :style="{ color: card.accent }">{{ card.value }}</strong>
        <p>{{ card.detail }}</p>
      </BaseCard>
    </section>

    <section class="split-grid">
      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Empresa</p>
            <h3>Dados principais</h3>
          </div>
        </template>

        <dl class="details">
          <div class="details__row">
            <dt>Nome da empresa</dt>
            <dd>{{ company.name }}</dd>
          </div>
          <div class="details__row">
            <dt>Cidade e estado</dt>
            <dd>{{ company.cityState }}</dd>
          </div>
          <div class="details__row">
            <dt>Contato principal vinculado</dt>
            <dd>{{ company.primaryContact }}</dd>
          </div>
          <div class="details__row">
            <dt>E-mail</dt>
            <dd>{{ company.primaryEmail }}</dd>
          </div>
          <div class="details__row">
            <dt>Telefone</dt>
            <dd>{{ company.primaryPhone }}</dd>
          </div>
        </dl>
      </BaseCard>

      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Visao da conta</p>
            <h3>Informacoes disponiveis</h3>
          </div>
        </template>

        <ul class="rules">
          <li v-for="rule in readOnlyRules" :key="rule">
            {{ rule }}
          </li>
        </ul>
      </BaseCard>
    </section>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import { getClientPortalData } from '@/services/portalData';

const { company, summaryCards, readOnlyRules } = getClientPortalData();
</script>

<style scoped>
.metric-value {
  display: block;
}

.metric-value {
  margin-top: 10px;
  font-size: 30px;
}

.split-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: var(--space-5);
}

.details,
.rules {
  margin: 0;
  padding: 0;
}

.details {
  display: grid;
  gap: 14px;
}

.details__row {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--stroke);
}

.details__row:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.details__row dt {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  font-weight: 700;
}

.details__row dd {
  margin: 6px 0 0;
  color: var(--text-strong);
  font-size: 18px;
  font-weight: 600;
}

.rules {
  list-style: none;
  display: grid;
  gap: 12px;
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

@media (max-width: 960px) {
  .split-grid {
    grid-template-columns: 1fr;
  }
}
</style>

