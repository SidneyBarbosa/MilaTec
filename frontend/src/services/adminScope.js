import { computed, ref, watch } from 'vue';

const STORAGE_KEY = 'milatec_admin_company_id';

const readStoredCompanyId = () => {
  if (typeof localStorage === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEY) || '';
};

export const selectedAdminCompanyId = ref(readStoredCompanyId());

watch(selectedAdminCompanyId, (companyId) => {
  if (typeof localStorage === 'undefined') return;

  if (companyId) {
    localStorage.setItem(STORAGE_KEY, companyId);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
});

export const isAdminCompanyFiltered = computed(() => Boolean(selectedAdminCompanyId.value));

export const filterBySelectedAdminCompany = (items = []) => {
  if (!selectedAdminCompanyId.value) return items;
  return items.filter((item) => item?.companyId === selectedAdminCompanyId.value);
};

export const setSelectedAdminCompany = (companyId = '') => {
  selectedAdminCompanyId.value = companyId || '';
};

export const clearSelectedAdminCompany = () => {
  selectedAdminCompanyId.value = '';
};
