<template>
  <div class="page">

    <BaseCard class="table-card">
      <div class="table">
        <div class="table__head">
          <span>Nome do arquivo</span>
          <span>Categoria</span>
          <span>Data de upload</span>
          <span>Acesso</span>
        </div>

        <div class="table__body">
          <div v-for="attachment in attachments" :key="attachment.name" class="table__row">
            <span class="table__cell table__cell--title">{{ attachment.name }}</span>
            <span class="table__cell">{{ attachment.category }}</span>
            <span class="table__cell">{{ attachment.uploadedAt }}</span>
            <span class="table__cell">
              <a
                :href="attachment.href"
                class="attachment-action"
                :aria-label="attachment.actionLabel"
              >
                <span class="material-icons" aria-hidden="true">{{ resolveActionIcon(attachment.actionLabel) }}</span>
                <span>{{ attachment.actionLabel }}</span>
              </a>
            </span>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import { getClientPortalData } from '@/services/portalData';

const { attachments } = getClientPortalData();

const resolveActionIcon = (actionLabel) => {
  const iconByAction = {
    Visualizar: 'visibility',
    Baixar: 'download',
  };

  return iconByAction[actionLabel] || 'description';
};
</script>

<style scoped>
.table__head,
.table__row {
  display: grid;
  grid-template-columns: 1.3fr 0.8fr 0.8fr 0.6fr;
  gap: 14px;
  align-items: center;
}

@media (max-width: 920px) {
  .table__head {
    display: none;
  }

  .table__row {
    grid-template-columns: 1fr;
  }
}
</style>

