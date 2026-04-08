<template>
  <section class="login-card">
    <div class="login__brand">
      <div class="brand-lockup">
        <img :src="logo" alt="MilaTec" class="brand-lockup__icon" />
        <div class="brand-lockup__copy">
          <strong>MilaTec</strong>
        </div>
      </div>
      <span class="badge">Acesso seguro</span>
    </div>

    <header class="login__header">
      <h1>Acesso do Cliente</h1>
      <p class="subtitle">
        Informe seu e-mail para receber o código e acompanhar seu projeto com transparência e autonomia.
      </p>
    </header>

    <form class="login__form" @submit.prevent>
      <BaseInput
        v-model="email"
        label="E-mail"
        type="email"
        placeholder="seuemail@empresa.com"
        tone="light"
      />
      <BaseButton class="login__submit" size="lg" block>
        Receber código
      </BaseButton>
      <p class="helper">
        Caso não receba o código, verifique sua caixa de spam ou entre em contato com nosso suporte.
      </p>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import logo from '@/assets/logo-milatec-BRtuGoQK.jpg (1).jpeg';

const email = ref('');
</script>

<style scoped>
.login-card {
  width: min(460px, 92vw);
  padding: 34px 32px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e2e8f5;
  box-shadow: 0 26px 54px rgba(7, 17, 40, 0.24);
  display: grid;
  gap: 20px;
}

.login__brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
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

.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(46, 211, 160, 0.16);
  color: #00a86b;
  font-weight: 600;
  font-size: var(--fs-xs);
  border: 1px solid rgba(0, 168, 107, 0.28);
}

.login__header h1 {
  margin: 6px 0 6px;
  color: #0b1f4d;
  font-size: 28px;
}

.subtitle {
  margin: 0;
  color: #4a5672;
  line-height: 1.55;
}

.login__form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.login__submit {
  margin-top: 6px;
  background: linear-gradient(135deg, #1e3a8a 0%, #163b66 55%, #0b1f4d 100%);
  color: #ffffff;
  border: 1px solid rgba(11, 31, 77, 0.18);
  box-shadow: 0 12px 26px rgba(22, 59, 102, 0.22);
}

.login__submit:hover {
  filter: brightness(1.06);
  box-shadow: 0 14px 28px rgba(22, 59, 102, 0.26);
}

.helper {
  font-size: var(--fs-sm);
  color: #5b6b8c;
  line-height: 1.5;
  margin: 0;
  text-align: center;
}

@media (max-width: 720px) {
  .login-card {
    padding: 26px 22px;
  }
}
</style>
