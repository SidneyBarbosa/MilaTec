<template>
  <div class="support glass">
    <div class="header">
      <p class="pill">Suporte</p>
      <h2>Central de atendimento ao cliente</h2>
      <p class="muted">
        Dados fictícios por enquanto. Quando a API estiver pronta, trocamos os mocks
        por chamadas reais sem alterar o layout.
      </p>
    </div>

    <div class="grid">
      <div class="card">
        <h3>Fila atual</h3>
        <p class="muted">08 tickets aguardando ação</p>
        <button class="cta">Abrir dashboard</button>
      </div>
      <div class="card">
        <h3>Base de conhecimento</h3>
        <p class="muted">Artigos prioritários para clientes enterprise</p>
        <button class="ghost">Organizar conteúdos</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.support {
  padding: 22px;
  border: 1px solid var(--stroke);
}

.header h2 {
  margin: 8px 0 6px;
}

.grid {
  margin-top: 16px;
}

.card {
  padding: 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--stroke);
}

h3 {
  margin: 0 0 6px;
}

.ghost {
  margin-top: 10px;
  background: transparent;
  color: var(--text);
  border: 1px solid var(--stroke);
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
}
</style>
