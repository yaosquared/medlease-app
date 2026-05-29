<script setup lang="ts">
import { computed, ref, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'

import {
  getOrganizationById,
  getOwnOrganization,
  updateOwnOrganization,
} from '@/apis/organizations'
import { useAuthStore } from '@/stores/auth.ts'
import type { TApiErrorResponse } from '@/types/api'
import type { AxiosError } from 'axios'
import OrganizationActions from './OrganizationActions.vue'
import EditOrganizationModal from './EditOrganizationModal.vue'

const { user } = storeToRefs(useAuthStore())
const route = useRoute()
const toast = useToast()
const queryCache = useQueryCache()

const showEditOrgModal = ref(false)
const form = reactive({
  name: '',
  address: '',
  contactNumber: '',
  email: '',
})

const isOrgAdmin = computed(() => user.value?.role === 'OrgAdmin')
const orgId = route.params.orgId as string

const { data, asyncStatus } = useQuery({
  key: () => (isOrgAdmin.value ? ['organization', 'me'] : ['organization', orgId]),
  query: () => (isOrgAdmin.value ? getOwnOrganization() : getOrganizationById(orgId)),
})

const { mutate: save, isLoading: isSaving } = useMutation({
  mutation: (payload: typeof form) => updateOwnOrganization(payload),
  onSuccess: () => {
    showEditOrgModal.value = false
    toast.add({ title: 'Organization updated', color: 'success' })
  },
  onError: (err: AxiosError<TApiErrorResponse>) => {
    toast.add({
      title: 'Update failed',
      description: err?.response?.data?.message ?? 'Something went wrong.',
      color: 'error',
    })
  },
  onSettled: () => queryCache.invalidateQueries({ key: ['organization', 'me'] }),
})

const org = computed(() => data.value?.data)

watch(
  () => [org.value, showEditOrgModal.value],
  () => {
    if (showEditOrgModal.value && org.value) {
      form.name = org.value.name ?? ''
      form.address = org.value.address ?? ''
      form.contactNumber = org.value.contactNumber ?? ''
      form.email = org.value.email ?? ''
    }
  },
)

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
      <OrganizationActions v-if="!isOrgAdmin && org.status === 0" :id="org.id" />
      <div v-else-if="isOrgAdmin" class="flex justify-end">
        <UButton
          size="sm"
          color="neutral"
          variant="outline"
          icon="i-lucide-pencil"
          class="cursor-pointer"
          @click="showEditOrgModal = true"
        >
          Edit
        </UButton>
      </div>
    </template>
  </UCard>
  <EditOrganizationModal
    v-if="isOrgAdmin"
    v-model:open="showEditOrgModal"
    :organization="org"
    :loading="isSaving"
    @save="save"
  />
</template>
