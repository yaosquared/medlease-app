<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@pinia/colada'

import { getDashboardStats } from '@/apis/dashboard'
import { getOrganizations } from '@/apis/organizations'
import { getUsers } from '@/apis/users'

const router = useRouter()

const { data: statsData, asyncStatus: statsStatus } = useQuery({
  key: () => ['dashboard'],
  query: () => getDashboardStats(),
})

const { data: orgsData, asyncStatus: orgsStatus } = useQuery({
  key: () => ['organizations', 1, null],
  query: () => getOrganizations({ pageParam: 1, limit: 10 }),
})

const { data: usersData, asyncStatus: usersStatus } = useQuery({
  key: () => ['users', 1, null],
  query: () => getUsers({ pageParam: 1, limit: 10 }),
})

const recentOrgs = computed(() => orgsData.value?.data ?? [])
const recentUsers = computed(() => usersData.value?.data ?? [])
const isLoading = computed(() => statsStatus.value === 'loading')

const getOrgStatusBadge = (status: number) => {
  switch (status) {
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
}

const getOrgTypeBadge = (type: number) => {
  switch (type) {
    case 0:
      return { label: 'Clinic', color: 'info' as const }
    case 1:
      return { label: 'Vendor', color: 'primary' as const }
    default:
      return { label: 'Unknown', color: 'neutral' as const }
  }
}

const getRoleBadge = (role: number) => {
  switch (role) {
    case 0:
      return { label: 'Super Admin', color: 'success' as const }
    case 1:
      return { label: 'Org Admin', color: 'warning' as const }
    case 2:
      return { label: 'Staff', color: 'neutral' as const }
    default:
      return { label: 'Viewer', color: 'neutral' as const }
  }
}

const stats = computed(() => [
  {
    label: 'Total Organizations',
    value: statsData.value?.data?.totalOrganizations ?? 0,
    icon: 'i-lucide-building-2',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950',
    to: '/organizations',
  },
  {
    label: 'Total Users',
    value: statsData.value?.data?.totalUsers ?? 0,
    icon: 'i-lucide-users',
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950',
    to: '/users',
  },
  {
    label: 'Pending Approvals',
    value: statsData.value?.data?.pendingOrganizations ?? 0,
    icon: 'i-lucide-clock',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950',
    to: '/organizations',
  },
  {
    label: 'Active Users',
    value: statsData.value?.data?.activeUsers ?? 0,
    icon: 'i-lucide-user-check',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    to: '/users',
  },
])
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <template v-if="isLoading">
        <USkeleton v-for="i in 4" :key="i" class="h-28 rounded-xl" />
      </template>
      <template v-else>
        <UCard v-for="stat in stats" :key="stat.label">
          <div class="flex items-center gap-4">
            <div :class="[stat.bg, 'p-3 rounded-lg shrink-0']">
              <UIcon :name="stat.icon" :class="[stat.color, 'size-6']" />
            </div>
            <div>
              <p class="text-2xl font-bold">{{ stat.value }}</p>
              <p class="text-sm text-dimmed">{{ stat.label }}</p>
            </div>
          </div>
        </UCard>
      </template>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <p class="font-semibold">Recent Organizations</p>
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              trailing-icon="i-lucide-arrow-right"
              class="cursor-pointer"
              @click="router.push('/organizations')"
            >
              View all
            </UButton>
          </div>
        </template>
        <USkeleton v-if="orgsStatus === 'loading'" class="h-48 w-full" />
        <div v-else class="flex flex-col divide-y divide-default">
          <div
            v-for="org in recentOrgs"
            :key="org.id"
            class="flex items-center justify-between py-3 cursor-pointer hover:bg-elevated/50 px-1 rounded"
            @click="router.push(`/organizations/${org.id}`)"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"
              >
                <UIcon name="i-lucide-building-2" class="text-primary size-4" />
              </div>
              <div>
                <p class="text-sm font-medium">{{ org.name }}</p>
                <p class="text-xs text-dimmed">{{ org.email ?? '—' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <UBadge :color="getOrgTypeBadge(org.type).color" variant="subtle">
                {{ getOrgTypeBadge(org.type).label }}
              </UBadge>
              <UBadge :color="getOrgStatusBadge(org.status).color" variant="subtle">
                {{ getOrgStatusBadge(org.status).label }}
              </UBadge>
            </div>
          </div>
          <p v-if="recentOrgs.length === 0" class="text-sm text-dimmed text-center py-6">
            No organizations found.
          </p>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <p class="font-semibold">Recent Users</p>
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              trailing-icon="i-lucide-arrow-right"
              class="cursor-pointer"
              @click="router.push('/users')"
            >
              View all
            </UButton>
          </div>
        </template>
        <USkeleton v-if="usersStatus === 'loading'" class="h-48 w-full" />
        <div v-else class="flex flex-col divide-y divide-default">
          <div
            v-for="user in recentUsers"
            :key="user.id"
            class="flex items-center justify-between py-3 cursor-pointer hover:bg-elevated/50 px-1 rounded"
            @click="router.push(`/users/${user.id}`)"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0"
              >
                <UIcon name="i-lucide-user" class="text-violet-500 size-4" />
              </div>
              <div>
                <p class="text-sm font-medium">{{ user.fullName }}</p>
                <p class="text-xs text-dimmed">{{ user.email }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <UBadge :color="getRoleBadge(user.role).color" variant="subtle">
                {{ getRoleBadge(user.role).label }}
              </UBadge>
              <UBadge :color="user.isActive ? 'success' : 'error'" variant="subtle">
                {{ user.isActive ? 'Active' : 'Inactive' }}
              </UBadge>
            </div>
          </div>
          <p v-if="recentUsers.length === 0" class="text-sm text-dimmed text-center py-6">
            No users found.
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
