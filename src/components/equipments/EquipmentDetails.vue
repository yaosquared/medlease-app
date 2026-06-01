<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import type { AxiosError } from 'axios'

import { deleteEquipment, getEquipmentById } from '@/apis/equipments'
import { useAuthStore } from '@/stores/auth.ts'
import { CONDITION_MAP, STATUS_MAP } from '@/constants/equipments'
import type { TApiErrorResponse } from '@/types/api.ts'
import EditEquipmentModal from './EditEquipmentModal.vue'
import { formatDate, formatRate } from '@/utils/format.ts'

const { isOrgAdmin, isStaff, isVendor, isClinic } = storeToRefs(useAuthStore())
const route = useRoute()
const router = useRouter()
const toast = useToast()
const queryCache = useQueryCache()

const showEditEquipmentModal = ref(false)
const showLeaseContractModal = ref(false)
const showDeleteConfirmationtModal = ref(false)
const equipmentId = route.params.equipmentId as string

const { data, asyncStatus } = useQuery({
  key: () => ['equipment', equipmentId],
  query: () => getEquipmentById(equipmentId),
})

const { mutate, isLoading: isDeleting } = useMutation({
  mutation: () => deleteEquipment(equipmentId),
  onSuccess: () => {
    showDeleteConfirmationtModal.value = false
    toast.add({ title: 'Equipment updated', color: 'success' })
    router.push('/equipments')
  },
  onError: (err: AxiosError<TApiErrorResponse>) => {
    toast.add({
      title: 'Update failed',
      description: err?.response?.data?.message ?? 'Something went wrong.',
      color: 'error',
    })
  },
  onSettled: () => queryCache.invalidateQueries({ key: ['equipment', equipmentId] }),
})

const equipment = computed(() => data.value?.data)

const conditionBadge = computed(
  () =>
    CONDITION_MAP[equipment.value?.condition ?? -1] ?? {
      label: 'Unknown',
      color: 'neutral' as const,
    },
)

const statusBadge = computed(
  () =>
    STATUS_MAP[equipment.value?.status ?? -1] ?? { label: 'Unknown', color: 'neutral' as const },
)

const onDelete = () => {
  mutate()
}
</script>

<template>
  <USkeleton v-if="asyncStatus === 'loading'" class="h-64 w-full" />
  <UCard v-else-if="equipment">
    <template #header>
      <div class="flex items-start gap-4">
        <div
          class="w-24 h-24 rounded-lg bg-elevated flex items-center justify-center overflow-hidden shrink-0"
        >
          <img
            v-if="equipment.imageUrl"
            :src="equipment.imageUrl"
            :alt="equipment.name"
            class="w-full h-full object-cover"
          />
          <UIcon v-else name="i-lucide-monitor" class="w-10 h-10 text-dimmed" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <h2 class="text-lg font-semibold truncate">{{ equipment.name }}</h2>
              <p class="text-sm text-dimmed">{{ equipment.brand }} · {{ equipment.model }}</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <UBadge :color="conditionBadge.color" variant="subtle">
                {{ conditionBadge.label }}
              </UBadge>
              <UBadge :color="statusBadge.color" variant="subtle">
                {{ statusBadge.label }}
              </UBadge>
            </div>
          </div>
          <p v-if="equipment.description" class="mt-1 text-sm text-dimmed line-clamp-2">
            {{ equipment.description }}
          </p>
        </div>
      </div>
    </template>
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p class="text-dimmed">Serial Number</p>
        <p class="font-medium font-mono">{{ equipment.serialNumber }}</p>
      </div>
      <div>
        <p class="text-dimmed">Monthly Rate</p>
        <p class="font-semibold text-primary">{{ formatRate(equipment.monthlyRate) }}</p>
      </div>
      <div>
        <p class="text-dimmed">Organization</p>
        <p class="font-medium">{{ equipment.organization?.name ?? '—' }}</p>
      </div>
      <div>
        <p class="text-dimmed">Created At</p>
        <p class="font-medium">{{ formatDate(equipment.createdAt) }}</p>
      </div>
      <div v-if="equipment.updatedAt">
        <p class="text-dimmed">Last Updated</p>
        <p class="font-medium">{{ formatDate(equipment.updatedAt) }}</p>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          v-if="isVendor && (isOrgAdmin || isStaff)"
          size="sm"
          color="neutral"
          icon="i-lucide-pencil"
          class="cursor-pointer"
          @click="showEditEquipmentModal = true"
        >
          Edit
        </UButton>
        <!-- NOTE: show button only if the user is an OrgAdmin, from Vendor org, and equipment status is retired -->
        <UButton
          v-if="isVendor && equipment?.status === 4"
          size="sm"
          color="error"
          icon="i-lucide-trash"
          class="cursor-pointer"
          @click="showDeleteConfirmationtModal = true"
        >
          Delete
        </UButton>
        <!-- NOTE: show button only if the user is an OrgAdmin or Staff, from Vendor org, and equipment status is available -->
        <UButton
          v-if="isClinic && (isOrgAdmin || isStaff) && equipment?.status === 0"
          size="sm"
          color="primary"
          icon="i-lucide-file-text"
          class="cursor-pointer"
          @click="showLeaseContractModal = true"
        >
          Lease
        </UButton>
      </div>
    </template>
  </UCard>
  <EditEquipmentModal
    v-if="isVendor && (isOrgAdmin || isStaff)"
    v-model:open="showEditEquipmentModal"
    :equipment="equipment"
    :equipment-id="equipmentId"
  />
  <ConfirmationModal
    v-model:open="showDeleteConfirmationtModal"
    title="Delete Equipment"
    message="Are you sure you want to delete this equipment? This action cannot be undone."
    confirm-text="Delete"
    confirm-color="error"
    :loading="isDeleting"
    @confirm="onDelete"
  />
  <CreateContractModal
    v-if="isClinic && (isOrgAdmin || isStaff) && equipment?.status === 0"
    v-model:open="showLeaseContractModal"
    :equipment-id="equipmentId"
  />
</template>
