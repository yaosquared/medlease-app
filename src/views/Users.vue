<script setup lang="ts">
import { ref, computed, h, resolveComponent } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuery } from '@pinia/colada'
import type { TableColumn, TableRow } from '@nuxt/ui'

import { getOwnUsers, getUsers } from '@/apis/users'
import { useAuthStore } from '@/stores/auth'
import { ROLE_OPTIONS, USERS_PER_PAGE } from '@/constants/users'
import type { TUser } from '@/types/users'

const { isSuperAdmin, isOrgAdmin } = storeToRefs(useAuthStore())
const UBadge = resolveComponent('UBadge')
const router = useRouter()

const page = ref(1)
const searchQuery = ref('')
const debouncedSearch = ref('')
const roleFilter = ref<number | null>(null)
const showCreateUserModal = ref(false)

const { data, asyncStatus, error } = useQuery({
  key: () => ['users', page.value, roleFilter.value, debouncedSearch.value],
  query: () => {
    const params = {
      pageParam: page.value,
      limit: USERS_PER_PAGE,
      role: roleFilter.value ?? undefined,
      search: debouncedSearch.value || undefined,
    }
    return isSuperAdmin.value ? getUsers(params) : getOwnUsers(params)
  },
})

const rows = computed(() => data.value?.data ?? [])
const total = computed(() => data.value?.totalCount ?? 0)

const usersColumns: TableColumn<TUser>[] = [
  {
    accessorKey: 'fullName',
    header: 'Full Name',
    cell: ({ row }) => row.getValue('fullName'),
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => row.getValue('username'),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const { label, color } = getRoleBadge(row.getValue('role'))
      return h(UBadge, { variant: 'subtle', color }, () => label)
    },
  },
  {
    accessorKey: 'organization',
    header: 'Organization Type',
    cell: ({ row }) => {
      const org = row.getValue('organization') as { type: number } | null
      if (!org) return '—'
      const { label, color } = getTypeBadge(org.type)
      return h(UBadge, { variant: 'subtle', color }, () => label)
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => row.getValue('email'),
  },
  {
    accessorKey: 'contactNumber',
    header: 'Contact Number',
    cell: ({ row }) => row.getValue('contactNumber'),
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

const getRoleBadge = (status: number) => {
  switch (status) {
    case 0:
      return { label: 'Super Admin', color: 'success' as const }
    case 1:
      return { label: 'Org Admin', color: 'warning' as const }
    case 2:
      return { label: 'Staff', color: 'info' as const }
    default:
      return { label: 'Viewer', color: 'neutral' as const }
  }
}

const roleFilterOptions = computed(() =>
  isSuperAdmin.value ? ROLE_OPTIONS : ROLE_OPTIONS.filter((o) => o.value !== 0),
)

const onRoleChange = (value: number | null) => {
  roleFilter.value = value === null ? null : Number(value)
  page.value = 1
}

const goToDetails = (_e: Event, row: TableRow<TUser>) => {
  router.push(`/users/${row.original.id}`)
}
</script>

<template>
  <div class="h-full flex flex-col gap-4">
    <div v-if="error" class="flex-1 flex justify-center items-center text-red-500">
      Failed to load users
    </div>
    <div v-else class="flex flex-col gap-4">
      <div class="flex justify-between items-center gap-2">
        <div class="w-1/2 flex gap-2">
          <SearchBar
            v-model="searchQuery"
            class="max-w-sm"
            placeholder="Search for full name / username..."
            @search="
              (val) => {
                debouncedSearch = val
                page = 1
              }
            "
          />
          <USelect
            :model-value="roleFilter"
            :items="roleFilterOptions"
            value-key="value"
            placeholder="Filter by role"
            class="w-48 cursor-pointer"
            @update:model-value="onRoleChange"
          />
        </div>
        <UButton
          v-if="isOrgAdmin"
          icon="i-lucide-plus"
          class="cursor-pointer ml-auto"
          @click="showCreateUserModal = true"
        >
          Add User
        </UButton>
      </div>
      <div class="flex flex-col gap-4">
        <UTable
          :data="rows"
          :columns="usersColumns"
          :loading="asyncStatus === 'loading'"
          class="flex-1 cursor-pointer"
          @select="goToDetails"
        />
        <Pagination v-model:page="page" :total="total" :items-per-page="USERS_PER_PAGE" />
      </div>
    </div>
    <CreateUserModal v-if="isOrgAdmin" v-model:open="showCreateUserModal" />
  </div>
</template>
