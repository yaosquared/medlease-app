<script setup lang="ts">
import { ref, computed, h, resolveComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@pinia/colada'
import type { TableColumn, TableRow } from '@nuxt/ui'

import { getPayments } from '@/apis/payments'
import { PAYMENT_STATUS_OPTIONS, PAYMENTS_PER_PAGE } from '@/constants/payments'
import type { TPayment } from '@/types/payment'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { formatCurrency, formatDate } from '@/utils/format'

const { isOrgAdmin, isStaff, isClinic } = storeToRefs(useAuthStore())
const UBadge = resolveComponent('UBadge')
const router = useRouter()

const page = ref(1)
const searchQuery = ref('')
const debouncedSearch = ref('')
const statusFilter = ref<number | null>(null)
const showCreatePaymentModal = ref(false)

const { data, asyncStatus, error } = useQuery({
  key: () => ['payments', page.value, statusFilter.value, debouncedSearch.value],
  query: () =>
    getPayments({
      pageParam: page.value,
      limit: PAYMENTS_PER_PAGE,
      status: statusFilter.value ?? undefined,
      search: debouncedSearch.value || undefined,
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
    // case 1:
    //   return { label: 'Processing', color: 'info' as const }
    case 2:
      return { label: 'Paid', color: 'success' as const }
    // case 3:
    //   return { label: 'Overdue', color: 'error' as const }
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
      <div class="flex justify-between items-center gap-2">
        <div class="w-1/2 flex gap-2">
          <SearchBar
            v-model="searchQuery"
            placeholder="Search for payment reference..."
            class="max-w-sm"
            @search="
              (val) => {
                debouncedSearch = val
                page = 1
              }
            "
          />
          <USelect
            :model-value="statusFilter"
            :items="PAYMENT_STATUS_OPTIONS"
            value-key="value"
            placeholder="Filter by status"
            class="w-48 cursor-pointer"
            @update:model-value="onStatusChange"
          />
        </div>
        <UButton
          v-if="isClinic && (isOrgAdmin || isStaff)"
          icon="i-lucide-plus"
          class="cursor-pointer ml-auto"
          @click="showCreatePaymentModal = true"
        >
          Add Payment
        </UButton>
      </div>
      <div class="flex flex-col gap-4">
        <UTable
          :data="rows"
          :columns="columns"
          :loading="asyncStatus === 'loading'"
          class="flex-1 cursor-pointer"
          @select="goToDetails"
        />
        <Pagination v-model:page="page" :total="total" :items-per-page="PAYMENTS_PER_PAGE" />
      </div>
    </div>
  </div>
  <CreatePaymentModal
    v-if="isClinic && (isOrgAdmin || isStaff)"
    v-model:open="showCreatePaymentModal"
  />
</template>
