<script setup lang="ts">
import { ref, computed, resolveComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@pinia/colada'
import type { TableColumn, TableRow } from '@nuxt/ui'

import { getOrganizations } from '@/apis/organizations'
import { ORGS_PER_PAGE, STATUS_OPTIONS } from '@/constants/organizations'
import type { TOrganization } from '@/types/organization'

const UBadge = resolveComponent('UBadge')
const router = useRouter()

const page = ref(1)
const statusFilter = ref<number | null>(null)

const { data, asyncStatus, error } = useQuery({
  key: () => ['organizations', page.value, statusFilter.value],
  query: () =>
    getOrganizations({
      pageParam: page.value,
      limit: ORGS_PER_PAGE,
      status: statusFilter.value ?? undefined,
    }),
})

const rows = computed(() => data.value?.data ?? [])
const total = computed(() => data.value?.totalCount ?? 0)

const organizationColumns: TableColumn<TOrganization>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.getValue('name'),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const { label, color } = getTypeBadge(row.getValue('type'))
      return h(UBadge, { variant: 'subtle', color }, () => label)
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
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => row.getValue('address'),
  },
  {
    accessorKey: 'contactNumber',
    header: 'Contact Number',
    cell: ({ row }) => row.getValue('contactNumber'),
  },
  {
    accessorKey: 'totalUsers',
    header: 'Total Users',
    cell: ({ row }) => row.getValue('totalUsers'),
  },
  {
    accessorKey: 'totalEquipment',
    header: 'Total Equipment',
    cell: ({ row }) => row.getValue('totalEquipment'),
  },
]

const getTypeBadge = (type: number) => {
  switch (type) {
    case 0:
      return { label: 'Clinic', color: 'info' as const }
    case 1:
      return { label: 'Vendor', color: 'primary' as const }
    default:
      return { label: 'Unknown', color: 'neutral' as const }
  }
}

const getStatusBadge = (status: number) => {
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

const onStatusChange = (value: number | null) => {
  statusFilter.value = value === null ? null : Number(value)
  page.value = 1
}

const goToDetails = (_e: Event, row: TableRow<TOrganization>) => {
  router.push(`/organizations/${row.original.id}`)
}
</script>

<template>
  <div class="h-full flex flex-col gap-4">
    <div v-if="error" class="flex-1 flex justify-center items-center text-red-500">
      Failed to load organizations
    </div>
    <div v-else>
      <div class="flex items-center gap-2">
        <USelect
          :model-value="statusFilter"
          :items="STATUS_OPTIONS"
          value-key="value"
          placeholder="Filter by status"
          class="w-48"
          @update:model-value="onStatusChange"
        />
      </div>
      <div class="flex flex-col gap-4">
        <UTable
          :data="rows"
          :columns="organizationColumns"
          :loading="asyncStatus === 'loading'"
          class="flex-1 cursor-pointer"
          @select="goToDetails"
        />
        <Pagination v-model:page="page" :total="total" :items-per-page="ORGS_PER_PAGE" />
      </div>
    </div>
  </div>
</template>
