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
              <a :href="attachment.href" class="attachment-link">{{ attachment.actionLabel }}</a>
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
</script>

<style scoped>
.table-card {
  padding: 0;
}

.table {
  display: grid;
}

.table__head,
.table__row {
  display: grid;
  grid-template-columns: 1fr 1.1fr 0.7fr 0.8fr 0.8fr 0.6fr;
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

.table__cell--title {
  color: var(--text-strong);
  font-weight: 600;
}

.attachment-link {
  color: var(--primary);
  font-weight: 700;
}

.attachment-link:hover {
  text-decoration: underline;
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

