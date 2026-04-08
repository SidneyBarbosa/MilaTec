<template>
  <div class="page">

    <BaseCard class="table-card">
      <div class="table">
        <div class="table__head">
          <span>Cliente</span>
          <span>Nome do arquivo</span>
          <span>Categoria</span>
          <span>Data de upload</span>
          <span>Visibilidade</span>
          <span>Acesso</span>
        </div>

        <div class="table__body">
          <div v-for="attachment in attachments" :key="`${attachment.client}-${attachment.name}`" class="table__row">
            <span class="table__cell table__cell--title">{{ attachment.client }}</span>
            <span class="table__cell">{{ attachment.name }}</span>
            <span class="table__cell">{{ attachment.category }}</span>
            <span class="table__cell">{{ attachment.uploadedAt }}</span>
            <span class="table__cell">{{ attachment.visibility }}</span>
            <span class="table__cell">
              <a
                :href="attachment.href"
                class="attachment-action"
                :class="{ 'attachment-action--disabled': attachment.actionLabel === 'Restringido' }"
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
import { getAdminPortalData } from '@/services/portalData';

const { attachments } = getAdminPortalData();

const resolveActionIcon = (actionLabel) => {
  const iconByAction = {
    Abrir: 'open_in_new',
    Baixar: 'download',
    Restringido: 'lock',
  };

  return iconByAction[actionLabel] || 'description';
};
</script>

<style scoped>
.table__head,
.table__row {
  display: grid;
  grid-template-columns: 1fr 1.1fr 0.7fr 0.8fr 0.8fr 0.6fr;
  gap: 14px;
  align-items: center;
}

@media (max-width: 1160px) {
  .table__head {
    display: none;
  }

  .table__row {
    grid-template-columns: 1fr;
  }
}
</style>

