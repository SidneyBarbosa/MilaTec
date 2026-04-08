import { computed, ref } from 'vue';

const STORAGE_KEY_ROLE = 'milatec:session-role';
const STORAGE_KEY_EMAIL = 'milatec:session-email';

const profileDirectory = Object.freeze({
  client: Object.freeze({
    role: 'client',
    label: 'Cliente',
    areaLabel: 'Área do Cliente',
    name: 'João Miguel',
    company: 'Grupo Horizonte',
    defaultEmail: 'joao@grupohorizonte.com',
    initials: 'JM',
    scopeLabel: 'Consulta restrita a empresa, obras, projetos, entregas e anexos vinculados',
  }),
  admin: Object.freeze({
    role: 'admin',
    label: 'Administrador',
    areaLabel: 'Área Administrativa',
    name: 'Ana Paula',
    company: 'MilaTec',
    defaultEmail: 'operacoes@milatec.com.br',
    initials: 'AP',
    scopeLabel: 'Leitura operacional multiempresa com exposição mínima por perfil',
  }),
});

function readStorage(key) {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(key) || '';
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') return;

  if (!value) {
    window.localStorage.removeItem(key);
    return;
  }

  window.localStorage.setItem(key, value);
}

const storedRole = readStorage(STORAGE_KEY_ROLE);

const sessionRole = ref(profileDirectory[storedRole] ? storedRole : '');
const sessionEmail = ref(readStorage(STORAGE_KEY_EMAIL));

export const profileOptions = Object.values(profileDirectory).map((profile) => ({
  role: profile.role,
  label: profile.label,
  areaLabel: profile.areaLabel,
  defaultEmail: profile.defaultEmail,
  description: profile.scopeLabel,
}));

export function getProfile(role = sessionRole.value, email = sessionEmail.value) {
  const baseProfile = profileDirectory[role];

  if (!baseProfile) return null;

  return {
    ...baseProfile,
    email: email || baseProfile.defaultEmail,
  };
}

export function canAccessRoles(roles, role = sessionRole.value) {
  if (!Array.isArray(roles) || roles.length === 0) return true;
  return roles.includes(role);
}

export function resolveDefaultRoute(role = sessionRole.value) {
  if (role === 'admin') return { name: 'admin-clients' };
  if (role === 'client') return { name: 'client-company' };
  return { name: 'login' };
}

export function signIn({ role, email }) {
  const nextRole = profileDirectory[role] ? role : 'client';

  sessionRole.value = nextRole;
  sessionEmail.value = email || profileDirectory[nextRole].defaultEmail;

  writeStorage(STORAGE_KEY_ROLE, nextRole);
  writeStorage(STORAGE_KEY_EMAIL, sessionEmail.value);
}

export function signOut() {
  sessionRole.value = '';
  sessionEmail.value = '';

  writeStorage(STORAGE_KEY_ROLE, '');
  writeStorage(STORAGE_KEY_EMAIL, '');
}

export function useSession() {
  const currentRole = computed(() => sessionRole.value);
  const currentProfile = computed(() => getProfile());

  return {
    sessionRole: currentRole,
    currentProfile,
    profileOptions,
    signIn,
    signOut,
    resolveDefaultRoute,
    canAccessRoles,
  };
}

export { sessionRole };

