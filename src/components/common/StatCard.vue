<template>
  <article class="glass card">
    <div class="card__header">
      <div class="pill">
        <span class="dot" :style="{ background: accent }"></span>
        {{ label }}
      </div>
      <span class="trend" :class="{ positive: trend >= 0 }">
        {{ trend >= 0 ? '+' : '' }}{{ trend }}%
      </span>
    </div>
    <div class="value">{{ value }}</div>
    <p class="muted">{{ description }}</p>
  </article>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  description: { type: String, required: true },
  trend: { type: Number, default: 0 },
  accent: { type: String, default: 'var(--primary)' },
});
</script>

<style scoped>
.card {
  padding: 18px;
  border-radius: 16px;
  border: 1px solid var(--stroke);
}

.card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.pill {
  color: var(--accent);
}

.dot {
  width: 8px;
  height: 8px;
  display: inline-block;
  border-radius: 50%;
  background: var(--accent);
}

.trend {
  font-weight: 600;
  color: #e38c3a;
}

.trend.positive {
  color: #4ade80;
}

.value {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 8px;
}

.muted {
  color: var(--muted);
  margin: 0;
  font-size: 13px;
}
</style>
