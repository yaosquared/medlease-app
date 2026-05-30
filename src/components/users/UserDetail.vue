<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuery } from '@pinia/colada'

import { getOwnOrgUserById, getUserById } from '@/apis/users'
import UserActions from './UserActions.vue'
import { useAuthStore } from '@/stores/auth.ts'

const { isSuperAdmin } = storeToRefs(useAuthStore())
const route = useRoute()

const userId = route.params.orgId as string

const { data, asyncStatus } = useQuery({
  key: () => [isSuperAdmin.value ? 'super-admin' : 'admin', 'user', userId],
  query: () => (isSuperAdmin.value ? getUserById(userId) : getOwnOrgUserById(userId)),
})

const org = computed(() => data.value?.data)

const roleBadge = computed(() => {
  switch (org.value?.role) {
    case 0:
      return { label: 'Super Admin', color: 'success' as const }
    case 1:
      return { label: 'Org Admin', color: 'warning' as const }
    case 2:
      return { label: 'Staff', color: 'neutral' as const }
    default:
      return { label: 'Viewer', color: 'neutral' as const }
  }
})

const orgTypeBadge = computed(() => {
  switch (org.value?.organization?.type) {
    case 0:
      return { label: 'Clinic', color: 'info' as const }
    case 1:
      return { label: 'Vendor', color: 'primary' as const }
    default:
      return { label: 'Unknown', color: 'neutral' as const }
  }
})

const orgStatusBadge = computed(() => {
  switch (org.value?.organization?.status) {
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
</script>

<template>
  <USkeleton v-if="asyncStatus === 'loading'" class="h-64 w-full" />
  <UCard v-else-if="org">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold">{{ org.fullName }} ({{ org.username }})</h2>
          <p class="text-sm text-dimmed">{{ org.email }}</p>
        </div>
        <UBadge :color="roleBadge.color" variant="subtle">{{ roleBadge.label }}</UBadge>
      </div>
    </template>
    <div class="space-y-4">
      <p class="text-xs font-semibold uppercase tracking-wider text-dimmed">User Details</p>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-dimmed">Contact Number</p>
          <p class="font-medium">{{ org.contactNumber }}</p>
        </div>
        <div>
          <p class="text-dimmed">Is Active</p>
          <p class="font-medium">{{ org.isActive ? 'Yes' : 'No' }}</p>
        </div>
        <div>
          <p class="text-dimmed">Created At</p>
          <p class="font-medium">{{ new Date(org.createdAt).toLocaleDateString() }}</p>
        </div>
        <div v-if="org.updatedAt">
          <p class="text-dimmed">Updated At</p>
          <p class="font-medium">{{ new Date(org.updatedAt).toLocaleDateString() }}</p>
        </div>
      </div>
    </div>
    <USeparator class="my-4" />
    <div v-if="org.organization" class="space-y-4">
      <div class="flex items-center justify-between">
        <p class="text-xs font-semibold uppercase tracking-wider text-dimmed">
          Organization Details
        </p>
        <div class="flex items-center gap-2">
          <UBadge :color="orgTypeBadge.color" variant="subtle">{{ orgTypeBadge.label }}</UBadge>
          <UBadge :color="orgStatusBadge.color" variant="subtle">{{ orgStatusBadge.label }}</UBadge>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-dimmed">Name</p>
          <p class="font-medium">{{ org.organization.name }}</p>
        </div>
        <div>
          <p class="text-dimmed">Email</p>
          <p class="font-medium">{{ org.organization.email }}</p>
        </div>
        <div>
          <p class="text-dimmed">Contact Number</p>
          <p class="font-medium">{{ org.organization.contactNumber }}</p>
        </div>
        <div>
          <p class="text-dimmed">Address</p>
          <p class="font-medium">{{ org.organization.address }}</p>
        </div>
        <div>
          <p class="text-dimmed">Created At</p>
          <p class="font-medium">{{ new Date(org.organization.createdAt).toLocaleDateString() }}</p>
        </div>
        <div v-if="org.organization.updatedAt">
          <p class="text-dimmed">Updated At</p>
          <p class="font-medium">{{ new Date(org.organization.updatedAt).toLocaleDateString() }}</p>
        </div>
      </div>
    </div>
    <template v-if="org.isActive" #footer>
      <UserActions :id="org.id" :contact-number="org.contactNumber" :role="org.role" />
    </template>
  </UCard>
</template>
