<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@pinia/colada'

import { getContractHistory } from '@/apis/contracts'

const route = useRoute()
const contractId = route.params.contractId as string

const { data, asyncStatus } = useQuery({
  key: () => ['contract', 'history', contractId],
  query: () => getContractHistory(contractId),
})

const history = computed(() => data.value?.data ?? [])

const statusBadge = (status: number) => {
  switch (status) {
    case 0:
      return { label: 'Pending', color: 'warning' as const }
    case 1:
      return { label: 'Active', color: 'info' as const }
    case 2:
      return { label: 'Completed', color: 'success' as const }
    case 3:
      return { label: 'Cancelled', color: 'error' as const }
    default:
      return { label: 'Unknown', color: 'neutral' as const }
  }
}

const roleBadge = (role: number) => {
  switch (role) {
    case 0:
      return { label: 'Super Admin', color: 'success' as const }
    case 1:
      return { label: 'Org Admin', color: 'warning' as const }
    case 2:
      return { label: 'Staff', color: 'neutral' as const }
    case 3:
      return { label: 'Viewer', color: 'neutral' as const }
    default:
      return { label: 'Unknown', color: 'neutral' as const }
  }
}
</script>

<template>
  <USkeleton v-if="asyncStatus === 'loading'" class="h-64 w-full" />
  <div v-else-if="history.length > 0" class="space-y-4">
    <p class="text-xs font-semibold uppercase tracking-wider text-dimmed">Contract History</p>
    <UCard v-for="entry in history" :key="entry.id">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UBadge :color="statusBadge(entry.fromStatus).color" variant="subtle">
              {{ statusBadge(entry.fromStatus).label }}
            </UBadge>
            <template v-if="entry.fromStatus !== entry.toStatus">
              <UIcon name="i-lucide-arrow-right" class="text-dimmed" />
              <UBadge :color="statusBadge(entry.toStatus).color" variant="subtle">
                {{ statusBadge(entry.toStatus).label }}
              </UBadge>
            </template>
          </div>
          <p v-if="entry.updatedAt" class="text-xs text-dimmed">
            {{ new Date(entry.updatedAt).toLocaleString() }}
          </p>
        </div>
      </template>
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-wider text-dimmed">Changed By</p>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-dimmed">Full Name</p>
            <p class="font-medium">
              {{ entry.changedByUser.fullName }} ({{ entry.changedByUser.username }})
            </p>
          </div>
          <div>
            <p class="text-dimmed">Email</p>
            <p class="font-medium">{{ entry.changedByUser.email }}</p>
          </div>
          <div>
            <p class="text-dimmed">Contact Number</p>
            <p class="font-medium">{{ entry.changedByUser.contactNumber }}</p>
          </div>
          <div>
            <p class="text-dimmed">Role</p>
            <UBadge :color="roleBadge(entry.changedByUser.role).color" variant="subtle">
              {{ roleBadge(entry.changedByUser.role).label }}
            </UBadge>
          </div>
        </div>
      </div>
    </UCard>
  </div>
  <UCard v-else>
    <div class="py-8 text-center text-dimmed">No contract history available.</div>
  </UCard>
</template>
