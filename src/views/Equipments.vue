<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuery } from '@pinia/colada'

import { getEquipments } from '@/apis/equipments'
import {
  CONDITION_MAP,
  EQUIPMENTS_PER_PAGE,
  STATUS_MAP,
  STATUS_OPTIONS,
} from '@/constants/equipments'
import { useAuthStore } from '@/stores/auth'
import { formatRate } from '@/utils/format'

const { isOrgAdmin, isStaff, isVendor } = storeToRefs(useAuthStore())
const router = useRouter()

const page = ref(1)
const searchQuery = ref('')
const debouncedSearch = ref('')
const statusFilter = ref<number | null>(null)
const showCreateEquipmentModal = ref(false)

const { data, asyncStatus, error } = useQuery({
  key: () => ['equipments', page.value, statusFilter.value, debouncedSearch.value],
  query: () =>
    getEquipments({
      pageParam: page.value,
      limit: EQUIPMENTS_PER_PAGE,
      status: statusFilter.value ?? undefined,
      search: debouncedSearch.value || undefined,
    }),
})

const equipments = computed(() => data.value?.data ?? [])
const total = computed(() => data.value?.totalCount ?? 0)

const onStatusChange = (value: number | null) => {
  statusFilter.value = value === null ? null : Number(value)
  page.value = 1
}
</script>

<template>
  <div class="h-full flex flex-col gap-4 min-h-0">
    <div v-if="error" class="flex-1 flex justify-center items-center text-red-500">
      Failed to load equipments
    </div>
    <template v-else>
      <div class="flex justify-between items-center gap-2 shrink-0">
        <div class="w-1/2 flex gap-2">
          <SearchBar
            v-model="searchQuery"
            placeholder="Search for equipment name..."
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
            placeholder="Filter by status"
            class="w-48 cursor-pointer"
            @update:model-value="onStatusChange"
          />
        </div>
        <UButton
          v-if="isVendor && (isOrgAdmin || isStaff)"
          icon="i-lucide-plus"
          class="cursor-pointer ml-auto"
          @click="showCreateEquipmentModal = true"
        >
          Add Equipment
        </UButton>
      </div>
      <div
        v-if="asyncStatus === 'loading'"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
      >
        <UCard v-for="n in EQUIPMENTS_PER_PAGE" :key="n">
          <USkeleton class="h-48 w-full rounded-xl mb-3" />
          <USkeleton class="h-4 w-3/4 mb-2" />
          <USkeleton class="h-4 w-1/2" />
        </UCard>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <UCard
          v-for="eq in equipments"
          :key="eq.id"
          class="overflow-hidden cursor-pointer"
          :ui="{ body: 'p-0' }"
          @click="router.push(`/equipments/${eq.id}`)"
        >
          <div class="relative h-48 bg-elevated flex items-center justify-center overflow-hidden">
            <img
              v-if="eq.imageUrl"
              :src="eq.imageUrl"
              :alt="eq.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="flex flex-col items-center gap-2 text-dimmed">
              <UIcon name="i-lucide-monitor" class="w-12 h-12" />
              <span class="text-xs">No image</span>
            </div>
            <div class="absolute top-2 right-2">
              <UBadge :color="STATUS_MAP[eq.status]?.color ?? 'neutral'" variant="solid" size="sm">
                {{ STATUS_MAP[eq.status]?.label ?? 'Unknown' }}
              </UBadge>
            </div>
          </div>
          <div class="flex-1 p-4 flex flex-col justify-between gap-2">
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="font-semibold text-sm leading-tight truncate">{{ eq.name }}</p>
                <p class="text-xs text-dimmed">{{ eq.brand }} · {{ eq.model }}</p>
              </div>
              <UBadge
                :color="CONDITION_MAP[eq.condition]?.color ?? 'neutral'"
                variant="subtle"
                size="sm"
                class="shrink-0"
              >
                {{ CONDITION_MAP[eq.condition]?.label ?? 'Unknown' }}
              </UBadge>
            </div>
            <p class="text-xs text-dimmed line-clamp-2">{{ eq.description }}</p>
            <div class="flex flex-col pt-1">
              <span class="text-sm font-semibold text-primary">
                {{ formatRate(eq.monthlyRate)
                }}<span class="text-xs font-normal text-dimmed">/mo</span>
              </span>
              <div>
                <span class="text-xs text-dimmed">S/N: {{ eq.serialNumber }}</span>
              </div>
            </div>
          </div>
        </UCard>
      </div>
      <div
        v-if="!asyncStatus && equipments.length === 0"
        class="flex flex-col items-center justify-center gap-2 text-dimmed py-16"
      >
        <UIcon name="i-lucide-package-open" class="w-12 h-12" />
        <p>No equipments found</p>
      </div>
      <Pagination v-model:page="page" :total="total" :items-per-page="EQUIPMENTS_PER_PAGE" />
    </template>
    <CreateEquipmentModal v-if="isOrgAdmin || isStaff" v-model:open="showCreateEquipmentModal" />
  </div>
</template>
