<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuery } from '@pinia/colada'

import { getAdminDashboardStats } from '@/apis/dashboard'
import { getOwnUsers } from '@/apis/users'
import { getContracts } from '@/apis/contracts'
import { getPayments } from '@/apis/payments'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { isClinic } = storeToRefs(useAuthStore())

const { data: statsData, asyncStatus: statsStatus } = useQuery({
  key: () => ['dashboard'],
  query: () => getAdminDashboardStats(),
})

const { data: usersData, asyncStatus: usersStatus } = useQuery({
  key: () => ['users', 1],
  query: () => getOwnUsers({ pageParam: 1, limit: 5 }),
})

const { data: contractsData, asyncStatus: contractsStatus } = useQuery({
  key: () => ['contracts', 1],
  query: () => getContracts({ pageParam: 1, limit: 5 }),
})

const { data: paymentsData, asyncStatus: paymentsStatus } = useQuery({
  key: () => ['payments', 1],
  query: () => getPayments({ pageParam: 1, limit: 3 }),
})

const recentUsers = computed(() => usersData.value?.data ?? [])
const recentContracts = computed(() => contractsData.value?.data ?? [])
const recentPayments = computed(() => paymentsData.value?.data ?? [])
const isLoading = computed(() => statsStatus.value === 'loading')

const getRoleBadge = (role: number) => {
  switch (role) {
    case 1:
      return { label: 'Org Admin', color: 'warning' as const }
    case 2:
      return { label: 'Staff', color: 'neutral' as const }
    default:
      return { label: 'Viewer', color: 'neutral' as const }
  }
}

const getContractStatusBadge = (status: number) => {
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

const getPaymentStatusBadge = (status: number) => {
  switch (status) {
    case 0:
      return { label: 'Pending', color: 'warning' as const }
    case 1:
      return { label: 'Processing', color: 'info' as const }
    case 2:
      return { label: 'Paid', color: 'success' as const }
    case 3:
      return { label: 'Overdue', color: 'error' as const }
    default:
      return { label: 'Unknown', color: 'neutral' as const }
  }
}

const stats = computed(() => {
  const all = [
    {
      label: 'Total Users',
      value: statsData.value?.data?.totalUsers ?? 0,
      icon: 'i-lucide-users',
      color: 'text-violet-500',
      bg: 'bg-violet-50 dark:bg-violet-950',
    },
    {
      label: 'Active Contracts',
      value: statsData.value?.data?.activeContracts ?? 0,
      icon: 'i-lucide-file-text',
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      label: 'Pending Payments',
      value: statsData.value?.data?.pendingPayments ?? 0,
      icon: 'i-lucide-credit-card',
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950',
    },
    ...(!isClinic.value
      ? [
          {
            label: 'Total Equipment',
            value: statsData.value?.data?.totalEquipment ?? 0,
            icon: 'i-lucide-monitor',
            color: 'text-emerald-500',
            bg: 'bg-emerald-50 dark:bg-emerald-950',
          },
        ]
      : []),
  ]
  return all
})
</script>

<template>
  <div class="h-full flex flex-col gap-6">
    <div class="grid grid-cols-2 gap-4" :class="isClinic ? 'lg:grid-cols-3' : 'lg:grid-cols-4'">
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
    <div class="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <UCard class="flex flex-col min-h-0" :ui="{ body: 'flex flex-col flex-1 min-h-0' }">
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
        <USkeleton v-if="usersStatus === 'loading'" class="flex-1 min-h-0 w-full" />
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
      <UCard class="flex flex-col min-h-0" :ui="{ body: 'flex flex-col flex-1 min-h-0' }">
        <template #header>
          <div class="flex items-center justify-between">
            <p class="font-semibold">Recent Contracts</p>
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              trailing-icon="i-lucide-arrow-right"
              class="cursor-pointer"
              @click="router.push('/contracts')"
            >
              View all
            </UButton>
          </div>
        </template>
        <USkeleton v-if="contractsStatus === 'loading'" class="flex-1 min-h-0 w-full" />
        <div v-else class="flex flex-col divide-y divide-default">
          <div
            v-for="contract in recentContracts"
            :key="contract.id"
            class="flex items-center justify-between py-3 cursor-pointer hover:bg-elevated/50 px-1 rounded"
            @click="router.push(`/contracts/${contract.id}`)"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0"
              >
                <UIcon name="i-lucide-file-text" class="text-blue-500 size-4" />
              </div>
              <div>
                <p class="text-sm font-medium">{{ contract.equipmentName ?? contract.id }}</p>
                <p class="text-xs text-dimmed">
                  {{ new Date(contract.createdAt).toLocaleDateString() }}
                </p>
              </div>
            </div>
            <UBadge :color="getContractStatusBadge(contract.status).color" variant="subtle">
              {{ getContractStatusBadge(contract.status).label }}
            </UBadge>
          </div>
          <p v-if="recentContracts.length === 0" class="text-sm text-dimmed text-center py-6">
            No contracts found.
          </p>
        </div>
      </UCard>
      <UCard
        class="flex flex-col min-h-0 lg:col-span-2"
        :ui="{ body: 'flex flex-col flex-1 min-h-0' }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <p class="font-semibold">Recent Payments</p>
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              trailing-icon="i-lucide-arrow-right"
              class="cursor-pointer"
              @click="router.push('/payments')"
            >
              View all
            </UButton>
          </div>
        </template>
        <USkeleton v-if="paymentsStatus === 'loading'" class="flex-1 min-h-0 w-full" />
        <div v-else class="flex flex-col divide-y divide-default">
          <div
            v-for="payment in recentPayments"
            :key="payment.id"
            class="flex items-center justify-between py-3 cursor-pointer hover:bg-elevated/50 px-1 rounded"
            @click="router.push(`/payments/${payment.id}`)"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0"
              >
                <UIcon name="i-lucide-credit-card" class="text-amber-500 size-4" />
              </div>
              <div>
                <p class="text-sm font-medium">{{ payment.referenceNumber ?? payment.id }}</p>
                <p class="text-xs text-dimmed">
                  {{ new Date(payment.createdAt).toLocaleDateString() }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <p class="text-sm font-semibold">₱{{ Number(payment.amount).toLocaleString() }}</p>
              <UBadge :color="getPaymentStatusBadge(payment.status).color" variant="subtle">
                {{ getPaymentStatusBadge(payment.status).label }}
              </UBadge>
            </div>
          </div>
          <p v-if="recentPayments.length === 0" class="text-sm text-dimmed text-center py-6">
            No payments found.
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
