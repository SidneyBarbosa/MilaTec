<template>
  <div class="shell" :class="`shell--${currentRole}`">
    <aside class="sidebar">
      <RouterLink :to="homeLink" class="sidebar__brand-card">
        <img :src="logo" alt="MilaTec" class="sidebar__brand-logo" />
        <div class="sidebar__brand-copy">
          <strong>MilaTec</strong>
        </div>
      </RouterLink>

      <nav class="sidebar__menu" aria-label="Navegação principal">
        <RouterLink
          v-for="item in currentMenu"
          :key="item.to"
          :to="item.to"
          class="sidebar__item"
          :class="{ 'sidebar__item--active': isActive(item.to) }"
        >
          <span class="sidebar__item-glow" />
          <span class="material-icons sidebar__item-icon" aria-hidden="true">{{ item.icon }}</span>
          <span class="sidebar__item-label">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar__footer">
        <div class="sidebar__session-card">
          <span class="sidebar__session-label">{{ currentProfile?.label }}</span>
          <strong>{{ currentProfile?.name }}</strong>
          <small>{{ currentProfile?.email }}</small>
          <p>{{ currentProfile?.scopeLabel }}</p>
        </div>

        <button type="button" class="sidebar__logout" @click="onSignOut">
          Encerrar sessão
        </button>
      </div>
    </aside>

    <div class="shell__main">
      <header class="topbar">
        <div class="topbar__copy">
          <p class="topbar__eyebrow">{{ topbarEyebrow }}</p>
          <h2 class="topbar__title">{{ currentTitle }}</h2>
        </div>

        <div class="topbar__profile">
          <div class="topbar__profile-copy">
            <strong>{{ currentProfile?.company }}</strong>
            <small>{{ currentProfile?.email }}</small>
          </div>
          <div class="topbar__avatar">{{ currentProfile?.initials }}</div>
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
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useSession } from '@/composables/useSession';
import logo from '@/assets/logo-milatec-BRtuGoQK.jpg (1).jpeg';

const route = useRoute();
const router = useRouter();
const { currentProfile, sessionRole, resolveDefaultRoute, signOut } = useSession();

const menuByRole = {
  client: [
    { label: 'Empresa', to: '/cliente/empresa', icon: 'business' },
    { label: 'Obras', to: '/cliente/obras', icon: 'construction' },
    { label: 'Projetos', to: '/cliente/projetos', icon: 'folder' },
    { label: 'Entregas', to: '/cliente/entregas', icon: 'local_shipping' },
    { label: 'Anexos', to: '/cliente/anexos', icon: 'attach_file' },
  ],
  admin: [
    { label: 'Clientes', to: '/admin/clientes', icon: 'people' },
    { label: 'Obras', to: '/admin/obras', icon: 'construction' },
    { label: 'Projetos', to: '/admin/projetos', icon: 'folder' },
    { label: 'Entregas', to: '/admin/entregas', icon: 'local_shipping' },
    { label: 'Anexos', to: '/admin/anexos', icon: 'attach_file' },
    { label: 'Acessos', to: '/admin/acessos', icon: 'security' },
  ],
};

const currentRole = computed(() => sessionRole.value || 'client');
const currentMenu = computed(() => menuByRole[currentRole.value] || menuByRole.client);
const currentTitle = computed(() => route.meta?.title || currentMenu.value[0]?.label || 'MilaTec');
const topbarEyebrow = computed(() => 'PORTAL DO CLIENTE');
const homeLink = computed(() => resolveDefaultRoute(currentRole.value));

const isActive = (path) => route.path === path || route.path.startsWith(`${path}/`);

const onSignOut = () => {
  signOut();
  router.push({ name: 'login' });
};
</script>

<style scoped>
.shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 268px minmax(0, 1fr);
  background:
    radial-gradient(120% 120% at 100% 0%, rgba(0, 163, 74, 0.1), transparent 40%),
    linear-gradient(180deg, #f6f7f8 0%, #eef2ff 100%);
}

.sidebar {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  padding: 16px 12px;
  background: linear-gradient(180deg, #050866 0%, #08118b 100%);
  color: #ffffff;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.shell--admin .sidebar {
  background: linear-gradient(180deg, #040545 0%, #050866 58%, #004ae8 100%);
}

.sidebar__brand-card {
  display: grid;
  grid-template-columns: 44px 1fr;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.16);
}

.sidebar__brand-logo {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 12px;
}

.sidebar__brand-copy strong,
.sidebar__session-card strong,
.sidebar__session-card small,
.sidebar__session-card p {
  display: block;
}

.sidebar__brand-copy strong {
  font-size: 15px;
  line-height: 1.1;
}

.sidebar__session-card {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar__session-label {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(0, 163, 74, 0.16);
  color: #a4f0bf;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sidebar__session-card p {
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.92);
}

.sidebar__session-card small {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.55;
}

.sidebar__session-card strong {
  margin-top: 10px;
  font-size: 16px;
}

.sidebar__menu {
  display: grid;
  align-content: start;
  gap: 6px;
}

.sidebar__item {
  position: relative;
  display: grid;
  grid-template-columns: 4px 36px 1fr;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 11px;
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.84);
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.sidebar__item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  transform: translateY(-1px);
}

.sidebar__item--active {
  background: linear-gradient(135deg, rgba(0, 163, 74, 0.18), rgba(0, 74, 232, 0.2));
  color: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08), 0 12px 26px rgba(0, 74, 232, 0.16);
}

.sidebar__item-glow {
  width: 4px;
  height: 24px;
  border-radius: 999px;
  background: transparent;
}

.sidebar__item--active .sidebar__item-glow {
  background: linear-gradient(180deg, #00a34a 0%, #004ae8 100%);
  box-shadow: 0 0 14px rgba(0, 163, 74, 0.45);
}

.sidebar__item-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(223, 234, 255, 0.94);
  font-size: 21px;
  line-height: 1;
  font-family: 'Material Icons';
  font-weight: 400;
  font-style: normal;
  user-select: none;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-feature-settings: 'liga';
}

.sidebar__item-label {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.15;
}

.sidebar__item--active .sidebar__item-icon {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.12);
}

.sidebar__footer {
  display: grid;
  gap: 12px;
}

.sidebar__logout {
  min-height: 42px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.sidebar__logout:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.shell__main {
  display: grid;
  grid-template-rows: auto 1fr;
  min-width: 0;
}

.topbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 24px;
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(5, 8, 102, 0.08);
  backdrop-filter: blur(14px);
}

.topbar__copy {
  display: grid;
  gap: 6px;
}

.topbar__eyebrow {
  margin: 0;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: #7a88a8;
  font-weight: 600;
}

.topbar__title {
  margin: 0;
  font-size: clamp(26px, 3vw, 34px);
  line-height: 1.08;
  color: #050866;
}

.topbar__profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(244, 247, 252, 0.92));
  border: 1px solid rgba(5, 8, 102, 0.08);
  box-shadow: 0 12px 24px rgba(5, 8, 102, 0.08);
}

.topbar__profile-copy {
  text-align: right;
}

.topbar__profile-copy small {
  display: block;
}

.topbar__profile-copy strong {
  display: block;
  font-size: 15px;
  color: #050866;
}

.topbar__profile-copy small {
  margin-top: 2px;
  color: #6f7f9b;
}

.topbar__avatar {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #050866 0%, #004ae8 56%, #00a34a 100%);
  box-shadow: 0 14px 28px rgba(0, 74, 232, 0.24);
}

.shell--admin .topbar__avatar {
  background: linear-gradient(135deg, #040545 0%, #050866 50%, #004ae8 72%, #00a34a 100%);
}

.shell__content {
  display: flex;
  justify-content: center;
  padding: 22px 20px 32px;
}

.shell__content > * {
  width: 100%;
}

@media (max-width: 1080px) {
  .shell {
    grid-template-columns: 238px minmax(0, 1fr);
  }
}

@media (max-width: 880px) {
  .shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    grid-template-rows: auto auto auto;
    padding: 14px 14px 12px;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .sidebar__menu {
    grid-auto-flow: column;
    grid-auto-columns: minmax(132px, 1fr);
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .sidebar__session-card {
    display: none;
  }

  .sidebar__footer {
    justify-items: end;
  }

  .topbar {
    flex-direction: column;
    padding: 18px 18px 16px;
  }

  .shell__content {
    padding: 18px 14px 28px;
  }
}
</style>


