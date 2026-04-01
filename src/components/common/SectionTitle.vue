<template>
  <header class="section">
    <div>
      <p class="pill">{{ eyebrow }}</p>
      <h2>{{ title }}</h2>
      <p class="muted" v-if="subtitle">{{ subtitle }}</p>
    </div>
    <slot />
  </header>
</template>

<script setup>
defineProps({
  eyebrow: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
});
</script>

<style scoped>
.section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

h2 {
  margin: 6px 0 2px;
  font-size: 22px;
}

.muted {
  color: var(--muted);
  margin: 0;
}

@media (max-width: 720px) {
  .section {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
