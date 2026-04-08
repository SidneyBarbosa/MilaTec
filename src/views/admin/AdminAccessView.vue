<template>
  <div class="page">

    <section class="matrix-grid">
      <BaseCard v-for="item in accessMatrix" :key="item.profile">
        <span class="pill">{{ item.profile }}</span>
        <strong class="matrix-card__title">{{ item.routes }}</strong>
        <p>{{ item.data }}</p>
        <span class="matrix-card__restriction">{{ item.restrictions }}</span>
      </BaseCard>
    </section>

    <BaseCard>
      <template #header>
        <div>
          <p class="pill">Regras obrigatorias</p>
          <h3>Seguranca do produto</h3>
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
import { getPortalReadModel } from '@/services/readModel';

const { accessMatrix, securityRules } = getPortalReadModel('admin');
</script>

<style scoped>
.matrix-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-4);
}

.matrix-card__title,
.matrix-card__restriction {
  display: block;
}

.matrix-card__title {
  color: var(--text-strong);
  font-size: 18px;
  line-height: 1.4;
}

.matrix-card__restriction {
  margin-top: 4px;
  color: var(--primary);
  font-size: 14px;
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

