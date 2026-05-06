import { computed } from 'vue';
import { useSession } from '@/composables/useSession';
import { getClientPortalData } from '@/services/portalData';

export function useClientPortalData() {
  const { currentProfile } = useSession();

  const companyId = computed(() => currentProfile.value?.companyId);
  const portalData = computed(() => getClientPortalData(companyId.value));

  return {
    companyId,
    currentProfile,
    portalData,
  };
}
