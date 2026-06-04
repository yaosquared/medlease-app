<script setup lang="ts">
import { ref, computed, h, resolveComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@pinia/colada'
import type { TableColumn, TableRow } from '@nuxt/ui'

import { getContracts } from '@/apis/contracts'
import { CONTRACTS_PER_PAGE, STATUS_OPTIONS } from '@/constants/contracts'
import type { TContract } from '@/types/contract'
import { formatDate, formatRate } from '@/utils/format'

const UBadge = resolveComponent('UBadge')
const router = useRouter()

const page = ref(1)
const searchQuery = ref('')
const debouncedSearch = ref('')
const statusFilter = ref<number | null>(null)

const { data, asyncStatus, error } = useQuery({
  key: () => ['contracts', page.value, statusFilter.value, debouncedSearch.value],
  query: () =>
    getContracts({
      pageParam: page.value,
      limit: CONTRACTS_PER_PAGE,
      statuses:
        statusFilter.value !== null && statusFilter.value !== undefined
          ? [statusFilter.value]
          : undefined,
      search: debouncedSearch.value || undefined,
    }),
})

const rows = computed(() => data.value?.data ?? [])
const total = computed(() => data.value?.totalCount ?? 0)

const usersColumns: TableColumn<TContract>[] = [
  {
    accessorKey: 'contractNumber',
    header: 'Reference',
    cell: ({ row }) => {
      const value = row.getValue('contractNumber') as string
      return value?.length > 20 ? `${value.slice(0, 20)}...` : value
    },
  },
  {
    accessorKey: 'status',
    header: 'Contract Status',
    cell: ({ row }) => {
      const { label, color } = getStatusBadge(row.getValue('status'))
      return h(UBadge, { variant: 'subtle', color }, () => label)
    },
  },
  {
    accessorKey: 'hasPendingPayment',
    header: 'Payment Status',
    cell: ({ row }) => {
      const hasPending = row.getValue('hasPendingPayment') as boolean
      const hasPaid = row.original.hasPaidPayment

      if (hasPending)
        return h(UBadge, { variant: 'subtle', color: 'warning' }, () => 'Pending Payment')
      if (hasPaid) return h(UBadge, { variant: 'subtle', color: 'success' }, () => 'Paid')
      return '—'
    },
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => formatDate(row.getValue('startDate')),
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => formatDate(row.getValue('endDate')),
  },
  {
    accessorKey: 'monthlyPayment',
    header: 'Monthly Payment',
    cell: ({ row }) => formatRate(row.getValue('monthlyPayment')),
  },
]

const getStatusBadge = (status: number) => {
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

const goToDetails = (_e: Event, row: TableRow<TContract>) => {
  router.push(`/contracts/${row.original.id}`)
}

const onStatusChange = (value: number | null) => {
  statusFilter.value = value
  page.value = 1
}
</script>

<template>
  <div class="h-full flex flex-col gap-4">
    <div v-if="error" class="flex-1 flex justify-center items-center text-red-500">
      Failed to load users
    </div>
    <div v-else class="flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <SearchBar
          v-model="searchQuery"
          placeholder="Search for contract reference..."
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
          :items="STATUS_OPTIONS"
          value-key="value"
          placeholder="Filter by role"
          class="w-48 cursor-pointer"
          @update:model-value="onStatusChange"
        />
      </div>
      <UTable
        :data="rows"
        :columns="usersColumns"
        :loading="asyncStatus === 'loading'"
        class="flex-1 cursor-pointer"
        @select="goToDetails"
      />
      <Pagination v-model:page="page" :total="total" :items-per-page="CONTRACTS_PER_PAGE" />
    </div>
  </div>
</template>
