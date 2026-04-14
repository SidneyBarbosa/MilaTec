<template>
  <div class="page">
    <section class="support-grid">
      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Contato / Suporte</p>
            <h3>Nova solicitação</h3>
          </div>
        </template>

        <form class="support-form" @submit.prevent="createRequest">
          <BaseInput
            v-model="form.subject"
            label="Assunto"
            placeholder="Ex.: dúvida sobre uma entrega"
            tone="light"
          />

          <label class="textarea-field">
            <span>Mensagem</span>
            <textarea
              v-model="form.message"
              rows="7"
              placeholder="Descreva a solicitação para a equipe MilaTec."
            />
          </label>

          <div class="linked-info">
            <div>
              <span>Empresa vinculada</span>
              <strong>{{ company.name }}</strong>
            </div>
            <div>
              <span>Data</span>
              <strong>{{ currentDate }}</strong>
            </div>
          </div>

          <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>

          <BaseButton type="submit" size="lg">
            Enviar solicitação
          </BaseButton>
        </form>
      </BaseCard>

      <BaseCard>
        <template #header>
          <div>
            <p class="pill">Solicitações</p>
            <h3>Registros desta sessão</h3>
          </div>
        </template>

        <ul v-if="requests.length" class="request-list">
          <li v-for="request in requests" :key="request.id">
            <span class="status-badge status-badge--info">{{ request.status }}</span>
            <strong>{{ request.subject }}</strong>
            <p>{{ request.message }}</p>
            <small>{{ request.company }} · {{ request.createdAt }}</small>
          </li>
        </ul>

        <p v-else>Nenhuma solicitação enviada nesta sessão.</p>
      </BaseCard>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import { useClientPortalData } from '@/composables/useClientPortalData';

const { portalData } = useClientPortalData();

const form = reactive({
  subject: '',
  message: '',
});
const requests = ref([]);
const errorMessage = ref('');

const company = computed(() => portalData.value.company);

const formatDate = (date) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

const currentDate = computed(() => formatDate(new Date()));

const createRequest = () => {
  const subject = form.subject.trim();
  const message = form.message.trim();

  if (!subject || !message) {
    errorMessage.value = 'Informe o assunto e a mensagem para enviar a solicitação.';
    return;
  }

  requests.value.unshift({
    id: `${Date.now()}-${requests.value.length}`,
    subject,
    message,
    company: company.value.name,
    createdAt: formatDate(new Date()),
    status: 'Recebida',
  });

  form.subject = '';
  form.message = '';
  errorMessage.value = '';
};
</script>

<style scoped>
.support-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.8fr);
  gap: var(--space-5);
}

.support-form,
.textarea-field,
.linked-info,
.request-list {
  display: grid;
}

.support-form {
  gap: 14px;
}

.textarea-field {
  gap: 6px;
}

.textarea-field span {
  color: var(--text-strong);
  font-size: var(--fs-sm);
  font-weight: 600;
}

.textarea-field textarea {
  width: 100%;
  min-height: 160px;
  resize: vertical;
  border-radius: var(--radius-md);
  border: 1px solid #d3dbeb;
  background: var(--gray-50);
  color: var(--text-strong);
  padding: 12px;
  outline: none;
  line-height: 1.6;
}

.textarea-field textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(0, 163, 74, 0.18);
}

.linked-info {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.linked-info div {
  padding: 14px;
  border-radius: var(--radius-md);
  background: #f7faff;
  border: 1px solid var(--stroke-soft);
}

.linked-info span,
.linked-info strong,
.request-list strong,
.request-list small {
  display: block;
}

.linked-info span {
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.linked-info strong {
  margin-top: 6px;
  color: var(--text-strong);
}

.form-error {
  color: var(--danger);
  font-weight: 600;
}

.request-list {
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 14px;
}

.request-list li {
  display: grid;
  gap: 8px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--stroke-soft);
}

.request-list li:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.request-list strong {
  color: var(--text-strong);
}

.request-list small {
  color: var(--primary);
  font-weight: 600;
}

@media (max-width: 960px) {
  .support-grid,
  .linked-info {
    grid-template-columns: 1fr;
  }
}
</style>
