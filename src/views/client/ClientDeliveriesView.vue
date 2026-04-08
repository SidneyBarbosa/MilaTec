<template>
  <div class="page">

    <section class="delivery-grid">
      <BaseCard v-for="item in deliveries" :key="item.title">
        <span class="status-badge" :class="`status-badge--${item.statusTone}`">{{ item.statusLabel }}</span>
        <strong class="delivery-title">{{ item.title }}</strong>
        <p>{{ item.dependency }}</p>
        <small>{{ item.window }} Â· {{ item.channel }}</small>
      </BaseCard>
    </section>

    <BaseCard variant="flat">
      <p>
        O painel não permite editar datas ou anexos. Toda mudança de entrega continua dependente da atualização do Airtable e de nova leitura da API.
      </p>
    </BaseCard>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import { getPortalReadModel } from '@/services/readModel';

const { deliveries } = getPortalReadModel('client');
</script>

<style scoped>
.delivery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-4);
}

.delivery-title,
small {
  display: block;
}

.delivery-title {
  color: var(--text-strong);
  font-size: 20px;
}

small {
  color: var(--primary);
  font-weight: 600;
}
</style>


