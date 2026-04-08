<template>
  <div class="page">
    <section class="metric-grid">
      <BaseCard v-for="card in accessSummary" :key="card.label" class="metric-card">
        <p class="pill">{{ card.label }}</p>
        <strong class="metric-card__value" :style="{ color: card.accent }">{{ card.value }}</strong>
        <p>{{ card.detail }}</p>
      </BaseCard>
    </section>

    <section class="access-layout">
      <BaseCard class="table-card">
        <template #header>
          <div>
            <p class="pill">Revisão de escopos</p>
            <h3>Perfis monitorados</h3>
          </div>
        </template>

        <div class="table">
          <div class="table__head">
            <span>Perfil</span>
            <span>Conta</span>
            <span>Escopo liberado</span>
            <span>Status</span>
            <span>Última revisão</span>
          </div>

          <div class="table__body">
            <div v-for="item in accessProfiles" :key="`${item.profile}-${item.owner}`" class="table__row">
              <span class="table__cell table__cell--title">{{ item.profile }}</span>
              <span class="table__cell">{{ item.owner }}</span>
              <span class="table__cell">{{ item.scope }}</span>
              <span class="table__cell">
                <span class="status-badge" :class="`status-badge--${item.tone}`">{{ item.status }}</span>
              </span>
              <span class="table__cell">{{ item.reviewedAt }}</span>
            </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Fila operacional</p>
            <h3>Acoes prioritarias</h3>
          </div>
        </template>

        <ul class="action-list">
          <li v-for="action in accessActions" :key="action.title">
            <strong>{{ action.title }}</strong>
            <p>{{ action.detail }}</p>
          </li>
        </ul>
      </BaseCard>
    </section>

    <BaseCard>
      <template #header>
        <div>
          <p class="pill">Controles aplicados</p>
          <h3>Políticas de acesso</h3>
        </div>
      </template>

      <ul class="rules">
        <li v-for="rule in securityRules" :key="rule">
          {{ rule }}
        </li>
      </ul>
    </BaseCard>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import { getAdminPortalData } from '@/services/portalData';

const { accessSummary, accessProfiles, accessActions, securityRules } = getAdminPortalData();
</script>

<style scoped>
.metric-card__value {
  display: block;
  margin-top: 10px;
  font-size: 30px;
}

.access-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.75fr);
  gap: var(--space-5);
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
  grid-template-columns: 0.7fr 1fr 1.4fr 0.8fr 0.7fr;
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

.table__cell--title,
.action-list strong {
  color: var(--text-strong);
}

.table__cell--title {
  font-weight: 600;
}

.action-list,
.rules {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.action-list li,
.rules li {
  padding-left: 18px;
  position: relative;
}

.action-list p {
  margin-top: 6px;
}

.action-list li::before,
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

@media (max-width: 1080px) {
  .access-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 980px) {
  .table__head {
    display: none;
  }

  .table__row {
    grid-template-columns: 1fr;
  }
}
</style>

