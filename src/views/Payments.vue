<script setup lang="ts">
import { ref, computed, h, resolveComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@pinia/colada'
import { useMediaQuery } from '@vueuse/core'
import type { TableColumn, TableRow } from '@nuxt/ui'

import { getPayments } from '@/apis/payments'
import {
  PAYMENT_STATUS_OPTIONS,
  PAYMENTS_PER_PAGE,
  PENALTY_REASON_OPTIONS,
} from '@/constants/payments'
import type { TPayment } from '@/types/payment'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { formatCurrency, formatDate } from '@/utils/format'

const { isSuperAdmin, isOrgAdmin, isStaff, isClinic, isVendor } = storeToRefs(useAuthStore())
const UBadge = resolveComponent('UBadge')
const router = useRouter()
const isMobile = useMediaQuery('(max-width: 425px)')

const page = ref(1)
const searchQuery = ref('')
const debouncedSearch = ref('')
const statusFilter = ref<number | null>(null)
const showCreatePaymentModal = ref(false)

const { data, asyncStatus, error } = useQuery({
  key: () => [
    'payments',
    page.value,
    statusFilter.value,
    debouncedSearch.value,
    isSuperAdmin.value,
  ],
  query: () =>
    getPayments({
      pageParam: page.value,
      limit: PAYMENTS_PER_PAGE,
      status: statusFilter.value ?? undefined,
      search: debouncedSearch.value || undefined,
      isSuperAdmin: isSuperAdmin.value,
    }),
})

const rows = computed(() => data.value?.data ?? [])
const total = computed(() => data.value?.totalCount ?? 0)

const columns: TableColumn<TPayment>[] = [
  {
    accessorKey: 'transactionReference',
    header: 'Reference',
    cell: ({ row }) => {
      const value = row.getValue('transactionReference') as string
      return value?.length > 20 ? `${value.slice(0, 20)}...` : value
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const { label, color } = getStatusBadge(row.getValue('status'))
      return h(UBadge, { variant: 'subtle', color }, () => label)
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => formatCurrency(row.getValue('amount')),
  },
  {
    accessorKey: 'penaltyReasons',
    header: 'Penalty reasons',
    cell: ({ row }) => {
      const reasons = row.getValue('penaltyReasons') as number[]
      if (!reasons?.length) return '-'
      const labels = reasons.map(
        (r) => PENALTY_REASON_OPTIONS.find((o) => o.value === r)?.label ?? r,
      )
      if (labels.length <= 2) return labels.join(', ')
      return `${labels.slice(0, 2).join(', ')} +${labels.length - 2} more`
    },
  },
  {
    accessorKey: 'penaltyAmount',
    header: 'Penalty amount',
    cell: ({ row }) => formatCurrency(row.getValue('penaltyAmount')),
  },
  {
    accessorKey: 'dueDate',
    header: 'Due date',
    cell: ({ row }) => formatDate(row.getValue('dueDate')),
  },
  {
    accessorKey: 'paidAt',
    header: 'Paid at',
    cell: ({ row }) => formatDate(row.getValue('paidAt')),
  },
]

const getStatusBadge = (status: number) => {
  switch (status) {
    case 0:
      return { label: 'Pending', color: 'warning' as const }
    case 1:
      return { label: 'Paid', color: 'success' as const }
    default:
      return { label: 'Unknown', color: 'neutral' as const }
  }
}

const goToDetails = (_e: Event, row: TableRow<TPayment>) => {
  router.push(`/payments/${row.original.id}`)
}

const onStatusChange = (value: number | null) => {
  statusFilter.value = value
  page.value = 1
}
</script>

<template>
  <div class="h-full flex flex-col gap-4">
    <div v-if="error" class="flex-1 flex justify-center items-center text-red-500">
      Failed to load payments
    </div>
    <div v-else class="flex flex-col gap-4">
      <div class="flex flex-col md:flex-row md:justify-between items-center gap-2">
        <div class="w-full lg:w-1/2 flex flex-col md:flex-row gap-2">
          <SearchBar
            v-model="searchQuery"
            placeholder="Search for payment reference..."
            class="md:max-w-sm"
            @search="
              (val) => {
                debouncedSearch = val
                page = 1
              }
            "
          />
          <div class="flex gap-2">
            <USelect
              :model-value="statusFilter"
              :items="PAYMENT_STATUS_OPTIONS"
              value-key="value"
              placeholder="Filter by status"
              :class="['cursor-pointer', isVendor || isSuperAdmin ? 'w-full md:w-48' : 'w-48']"
              @update:model-value="onStatusChange"
            />
            <UButton
              icon="i-lucide-plus"
              v-if="isMobile && isClinic && (isOrgAdmin || isStaff)"
              class="w-1/2 flex justify-center cursor-pointer ml-auto"
              @click="showCreatePaymentModal = true"
            >
              Add Payment
            </UButton>
          </div>
        </div>
        <UButton
          v-if="!isMobile && isClinic && (isOrgAdmin || isStaff)"
          icon="i-lucide-plus"
          class="cursor-pointer ml-auto whitespace-nowrap"
          @click="showCreatePaymentModal = true"
        >
          Add Payment
        </UButton>
      </div>
      <div class="flex flex-col gap-4">
        <div class="w-[calc(100vw-2rem)] lg:w-auto overflow-x-auto">
          <UTable
            :data="rows"
            :columns="columns"
            :loading="asyncStatus === 'loading'"
            class="cursor-pointer"
            @select="goToDetails"
          />
        </div>
        <Pagination v-model:page="page" :total="total" :items-per-page="PAYMENTS_PER_PAGE" />
      </div>
    </div>
    <CreatePaymentModal
      v-if="isClinic && (isOrgAdmin || isStaff)"
      v-model:open="showCreatePaymentModal"
    />
  </div>
</template>
