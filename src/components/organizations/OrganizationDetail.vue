<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuery } from '@pinia/colada'

import { getOrganizationById, getOwnOrganization } from '@/apis/organizations'
import { useAuthStore } from '@/stores/auth.ts'
import OrganizationActions from './OrganizationActions.vue'
import EditOrganizationModal from './EditOrganizationModal.vue'

const { isSuperAdmin, isOrgAdmin } = storeToRefs(useAuthStore())
const route = useRoute()

const showEditOrgModal = ref(false)
const orgId = route.params.orgId as string

const { data, asyncStatus } = useQuery({
  key: () => (isSuperAdmin.value ? ['organization', orgId] : ['organization', 'me']),
  query: () => (isSuperAdmin.value ? getOrganizationById(orgId) : getOwnOrganization()),
})

const org = computed(() => data.value?.data)

const statusBadge = computed(() => {
  switch (org.value?.status) {
    case 0:
      return { label: 'Pending', color: 'warning' as const }
    case 1:
      return { label: 'Verified', color: 'success' as const }
    case 2:
      return { label: 'Rejected', color: 'error' as const }
    case 3:
      return { label: 'Disabled', color: 'neutral' as const }
    default:
      return { label: 'Unknown', color: 'neutral' as const }
  }
})

const typeBadge = computed(() => {
  switch (org.value?.type) {
    case 0:
      return { label: 'Clinic', color: 'info' as const }
    case 1:
      return { label: 'Vendor', color: 'primary' as const }
    default:
      return { label: 'Unknown', color: 'neutral' as const }
  }
})
</script>

<template>
  <USkeleton v-if="asyncStatus === 'loading'" class="h-64 w-full" />
  <UCard v-else-if="org">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold">{{ org.name }}</h2>
          <p class="text-sm text-dimmed">{{ org.email }}</p>
        </div>
        <div class="flex items-center gap-2">
          <UBadge :color="typeBadge.color" variant="subtle">{{ typeBadge.label }}</UBadge>
          <UBadge :color="statusBadge.color" variant="subtle">{{ statusBadge.label }}</UBadge>
        </div>
      </div>
    </template>
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p class="text-dimmed">Address</p>
        <p class="font-medium">{{ org.address }}</p>
      </div>
      <div>
        <p class="text-dimmed">Contact Number</p>
        <p class="font-medium">{{ org.contactNumber }}</p>
      </div>
      <div>
        <p class="text-dimmed">Total Users</p>
        <p class="font-medium">{{ org.totalUsers }}</p>
      </div>
      <div>
        <p class="text-dimmed">Total Equipment</p>
        <p class="font-medium">{{ org.totalEquipment }}</p>
      </div>
      <div>
        <p class="text-dimmed">Created At</p>
        <p class="font-medium">{{ new Date(org.createdAt).toLocaleDateString() }}</p>
      </div>
      <div v-if="org.approvedAt">
        <p class="text-dimmed">Approved At</p>
        <p class="font-medium">{{ new Date(org.approvedAt).toLocaleDateString() }}</p>
      </div>
    </div>
    <template #footer>
      <!-- NOTE: show actions only if the user is a SuperAdmin and the org is still pending review -->
      <OrganizationActions v-if="isSuperAdmin && org.status === 0" :id="org.id" />
      <div v-else-if="isOrgAdmin" class="flex justify-end">
        <UButton
          size="sm"
          color="neutral"
          icon="i-lucide-pencil"
          class="cursor-pointer"
          @click="showEditOrgModal = true"
        >
          Edit
        </UButton>
      </div>
    </template>
  </UCard>
  <EditOrganizationModal v-if="isOrgAdmin" v-model:open="showEditOrgModal" :organization="org" />
</template>
