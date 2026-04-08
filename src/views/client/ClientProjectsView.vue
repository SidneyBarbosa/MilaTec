<template>
  <div class="page">

    <section class="timeline-grid">
      <BaseCard v-for="item in projectStream" :key="item.stage">
        <span class="status-badge" :class="`status-badge--${item.statusTone}`">{{ item.statusLabel }}</span>
        <strong class="stage-title">{{ item.stage }}</strong>
        <p>{{ item.highlight }}</p>
        <small>{{ item.owner }}</small>
      </BaseCard>
    </section>

    <BaseCard>
      <template #header>
        <div>
          <p class="pill">Regras de visualização</p>
          <h3>Proteções desta área</h3>
        </div>
      </template>

      <ul class="rules">
        <li v-for="rule in accessRules" :key="rule">
          {{ rule }}
        </li>
      </ul>
    </BaseCard>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import { getPortalReadModel } from '@/services/readModel';

const { projectStream, accessRules } = getPortalReadModel('client');
</script>

<style scoped>
.timeline-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-4);
}

.stage-title,
small {
  display: block;
}

.stage-title {
  color: var(--text-strong);
  font-size: 20px;
}

small {
  color: var(--primary);
  font-weight: 600;
}

.rules {
  list-style: none;
  padding: 0;
  margin: 0;
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
</style>


