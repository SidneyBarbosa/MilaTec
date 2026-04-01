<template>
  <div class="shell">
    <aside class="sidebar">
      <div class="sidebar__brand-card">
        <img :src="logo" alt="MilaTec" class="sidebar__brand-logo" />
        <div class="sidebar__brand-copy">
          <strong>MilaTec</strong>
          <span>Area do Cliente</span>
        </div>
      </div>

      <nav class="sidebar__menu" aria-label="Navegacao principal">
        <RouterLink
          v-for="item in menu"
          :key="item.to"
          :to="item.to"
          class="sidebar__item"
          :class="{ 'sidebar__item--active': isActive(item.to) }"
        >
          <span class="sidebar__item-glow" />
          <span class="sidebar__item-icon" aria-hidden="true">
            <svg v-if="item.icon === 'dashboard'" viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
              <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
              <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
              <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
            </svg>
            <svg v-else-if="item.icon === 'orcamentos'" viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="6.5" width="17" height="11" rx="2" />
              <path d="M7 12h10" />
              <path d="M7 9.5h2.5" />
            </svg>
            <svg v-else-if="item.icon === 'projetos'" viewBox="0 0 24 24" fill="none">
              <path d="M7 3.5h7l5 5v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2Z" />
              <path d="M14 3.5v5h5" />
            </svg>
            <svg v-else-if="item.icon === 'entregas'" viewBox="0 0 24 24" fill="none">
              <path d="M3.5 7.5h11v8h-11z" />
              <path d="M14.5 10h3l2 2.5V15h-5Z" />
              <circle cx="8" cy="18" r="1.75" />
              <circle cx="17" cy="18" r="1.75" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none">
              <path d="M7 3.5h7l5 5v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2Z" />
              <path d="M14 3.5v5h5" />
              <path d="M8 13h8" />
              <path d="M8 16h5" />
            </svg>
          </span>
          <span class="sidebar__item-label">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar__footer">
        <RouterLink to="/login" class="sidebar__logout">
          <span class="sidebar__logout-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M10 6H6.5A2.5 2.5 0 0 0 4 8.5v7A2.5 2.5 0 0 0 6.5 18H10" />
              <path d="M13 8.5 17 12l-4 3.5" />
              <path d="M17 12H9" />
            </svg>
          </span>
          <span>Sair</span>
        </RouterLink>
      </div>
    </aside>

    <div class="shell__main">
      <header class="topbar">
        <div>
          <p class="topbar__eyebrow">Cliente</p>
          <h2 class="topbar__title">{{ currentTitle }}</h2>
        </div>

        <div class="topbar__profile">
          <div class="topbar__profile-copy">
            <span class="topbar__profile-label">Cliente</span>
            <strong>joao miguel</strong>
          </div>
          <div class="topbar__avatar">JM</div>
        </div>
      </header>

      <main class="shell__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import logo from '@/assets/logo-milatec-BRtuGoQK.jpg (1).jpeg';

const route = useRoute();

const menu = [
  { label: 'Dashboard', to: '/', icon: 'dashboard' },
  { label: 'Orcamentos', to: '/orcamentos', icon: 'orcamentos' },
  { label: 'Projetos', to: '/projetos', icon: 'projetos' },
  { label: 'Entregas', to: '/entregas', icon: 'entregas' },
  { label: 'Documentos', to: '/documentos', icon: 'documentos' },
];

const isActive = (path) => route.path === path;
const currentTitle = computed(() => route.meta?.title || 'Dashboard');
</script>

<style scoped>
.shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 228px 1fr;
  background: #f5f7fa;
}

.sidebar {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 22px;
  padding: 16px 12px 14px;
  background: linear-gradient(180deg, #0b1f4d 0%, #10275d 100%);
  color: #ffffff;
}

.sidebar__brand-card {
  display: grid;
  grid-template-columns: 36px 1fr;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.sidebar__brand-logo {
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 8px;
}

.sidebar__brand-copy strong {
  display: block;
  font-size: 14px;
  line-height: 1.15;
  font-weight: 700;
}

.sidebar__brand-copy span {
  display: block;
  margin-top: 3px;
  font-size: 12px;
  line-height: 1.15;
  color: rgba(255, 255, 255, 0.8);
}

.sidebar__menu {
  display: grid;
  align-content: start;
  gap: 8px;
}

.sidebar__item {
  position: relative;
  display: grid;
  grid-template-columns: 18px 18px 1fr;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 12px;
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.86);
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.sidebar__item:hover {
  background: rgba(255, 255, 255, 0.055);
  color: #ffffff;
}

.sidebar__item--active {
  background: linear-gradient(135deg, rgba(46, 211, 160, 0.22), rgba(0, 168, 107, 0.16));
  color: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(46, 211, 160, 0.16), 0 8px 24px rgba(0, 168, 107, 0.18);
}

.sidebar__item-glow {
  width: 4px;
  height: 22px;
  border-radius: 999px;
  background: transparent;
  justify-self: center;
}

.sidebar__item--active .sidebar__item-glow {
  background: linear-gradient(180deg, #2ed3a0 0%, #00a86b 100%);
  box-shadow: 0 0 14px rgba(46, 211, 160, 0.45);
}

.sidebar__item-icon,
.sidebar__logout-icon {
  width: 18px;
  height: 18px;
  display: inline-grid;
  place-items: center;
}

.sidebar__item-icon svg,
.sidebar__logout-icon svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.78;
}

.sidebar__item--active .sidebar__item-icon svg {
  opacity: 1;
}

.sidebar__item-label {
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
}

.sidebar__item--active .sidebar__item-label {
  font-weight: 700;
}

.sidebar__footer {
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar__logout {
  display: grid;
  grid-template-columns: 18px 1fr;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 12px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;
}

.sidebar__logout:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.shell__main {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 28px;
  background: #ffffff;
  border-bottom: 1px solid #e6eaf3;
}

.topbar__eyebrow {
  margin: 0 0 4px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #7c8599;
}

.topbar__title {
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
  color: #0b1f4d;
}

.topbar__profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar__profile-copy {
  text-align: right;
}

.topbar__profile-label {
  display: block;
  font-size: 12px;
  color: #7c8599;
}

.topbar__profile-copy strong {
  display: block;
  font-size: 15px;
  color: #0b1f4d;
}

.topbar__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #1e3a8a 0%, #00a86b 100%);
}

.shell__content {
  padding: 20px 24px 24px;
}

@media (max-width: 980px) {
  .shell {
    grid-template-columns: 208px 1fr;
  }
}

@media (max-width: 820px) {
  .shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    padding-bottom: 12px;
  }
}
</style>
