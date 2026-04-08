<template>
  <section class="verify glass">
    <div class="verify__brand">
      <div class="brand-lockup">
        <img :src="logo" alt="MilaTec" class="brand-lockup__icon" />
        <div class="brand-lockup__copy">
          <strong>MilaTec</strong>
        </div>
      </div>
      <p class="pill">Validação</p>
    </div>

    <div class="verify__content">
      <header>
        <p class="eyebrow">Plataforma MilaTec</p>
        <h1>Validação de acesso</h1>
        <p class="subtitle">
          Enviamos um código de 6 dígitos para seu e-mail. Digite abaixo para continuar.
        </p>
      </header>

      <form class="verify__form" @submit.prevent>
        <BaseInput
          v-model="code"
          label="Código de validação"
          placeholder="000000"
          maxlength="6"
          inputmode="numeric"
          pattern="[0-9]*"
          tone="light"
          class="code-input"
        />

        <BaseButton size="lg" block>
          Entrar
        </BaseButton>

        <div class="actions">
          <BaseButton variant="ghost" size="sm" @click.prevent="onResend">
            Reenviar código
          </BaseButton>
          <RouterLink to="/login" class="back-link">Voltar</RouterLink>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import logo from '@/assets/logo-milatec-BRtuGoQK.jpg (1).jpeg';

const code = ref('');

const onResend = () => {
  // fluxo mockado
};
</script>

<style scoped>
.verify {
  padding: 28px 26px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e5eaf3;
  box-shadow: 0 16px 36px rgba(12, 26, 58, 0.18);
}

.verify__brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.brand-lockup {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  width: 100%;
  padding: 14px 18px;
  border-radius: 20px;
  background: linear-gradient(180deg, #f7faff 0%, #eef4ff 100%);
  border: 1px solid #dbe5f4;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.84);
}

.brand-lockup__icon {
  width: 58px;
  height: 58px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 14px 26px rgba(5, 8, 102, 0.18);
}

.brand-lockup__copy strong {
  display: block;
  color: #050866;
  font-size: 30px;
  line-height: 1;
  letter-spacing: -0.02em;
}

.verify__content {
  color: #102347;
}

.eyebrow {
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #5b6b8c;
  margin-bottom: 6px;
  font-weight: 700;
}

h1 {
  color: #0b1f4d;
  margin-bottom: 8px;
}

.subtitle {
  color: #4a5672;
  font-size: var(--fs-md);
  line-height: 1.6;
}

.verify__form {
  margin-top: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.code-input :deep(.input) {
  letter-spacing: 12px;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.back-link {
  color: #1e3a8a;
  font-weight: 600;
}

.back-link:hover {
  text-decoration: underline;
}

@media (max-width: 720px) {
  .verify {
    padding: var(--space-5);
  }

  .actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

