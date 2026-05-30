<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMutation, useQuery } from '@pinia/colada'
import { storeToRefs } from 'pinia'

import {
  approveContract,
  cancelContract,
  completeContract,
  getContractById,
} from '@/apis/contracts'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const { isOrgAdmin, isVendor } = storeToRefs(useAuthStore())
const contractId = route.params.contractId as string

const { data, asyncStatus, refresh } = useQuery({
  key: () => ['contract', contractId],
  query: () => getContractById(contractId),
})

const contract = computed(() => data.value?.data)

const { mutate: approve, asyncStatus: approveStatus } = useMutation({
  mutation: () => approveContract(contractId),
  onSuccess: () => {
    approveOpen.value = false
    refresh()
  },
})

const { mutate: cancel, asyncStatus: cancelStatus } = useMutation({
  mutation: () => cancelContract(contractId),
  onSuccess: () => {
    cancelOpen.value = false
    refresh()
  },
})

const { mutate: complete, asyncStatus: completeStatus } = useMutation({
  mutation: () => completeContract(contractId),
  onSuccess: () => {
    completeOpen.value = false
    refresh()
  },
})

const approveOpen = ref(false)
const cancelOpen = ref(false)
const completeOpen = ref(false)

const statusBadge = computed(() => {
  switch (contract.value?.status) {
    case 0:
      return { label: 'Pending', color: 'warning' as const }
    case 1:
      return { label: 'Active', color: 'info' as const }
    case 2:
      return { label: 'Completed', color: 'success' as const }
    default:
      return { label: 'Cancelled', color: 'error' as const }
  }
})

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)

const formatDate = (date: string | null) =>
  date ? new Date(date).toLocaleDateString('en-PH', { dateStyle: 'medium' }) : '—'

const goToHistory = () => {
  router.push(`/contracts/${contractId}/history`)
}
</script>

<template>
  <USkeleton v-if="asyncStatus === 'loading'" class="h-64 w-full" />
  <UCard v-else-if="contract">
    <template #header>
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <h2 class="text-lg font-semibold">{{ contract.contractNumber }}</h2>
          <p class="text-sm text-dimmed">
            {{ contract.lessorOrganization?.name }} → {{ contract.lesseeOrganization?.name }}
          </p>
        </div>
        <UBadge :color="statusBadge.color" variant="subtle">
          {{ statusBadge.label }}
        </UBadge>
      </div>
    </template>
    <div class="space-y-6 text-sm">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-dimmed mb-3">Equipment</p>
        <div class="flex items-center gap-3">
          <div
            class="w-16 h-16 rounded-lg bg-elevated flex items-center justify-center overflow-hidden shrink-0"
          >
            <img
              v-if="contract.equipment?.imageUrl"
              :src="contract.equipment.imageUrl"
              :alt="contract.equipment.name"
              class="w-full h-full object-cover"
            />
            <UIcon v-else name="i-lucide-monitor" class="w-8 h-8 text-dimmed" />
          </div>
          <div>
            <p class="font-medium">{{ contract.equipment?.name }}</p>
            <p class="text-dimmed">
              {{ contract.equipment?.brand }} · {{ contract.equipment?.model }}
            </p>
            <p class="font-mono text-xs text-dimmed">{{ contract.equipment?.serialNumber }}</p>
          </div>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-dimmed mb-3">
          Contract Details
        </p>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-dimmed">Monthly Payment</p>
            <p class="font-semibold text-primary">{{ formatCurrency(contract.monthlyPayment) }}</p>
          </div>
          <div>
            <p class="text-dimmed">Created At</p>
            <p class="font-medium">{{ formatDate(contract.createdAt) }}</p>
          </div>
          <div>
            <p class="text-dimmed">Start Date</p>
            <p class="font-medium">{{ formatDate(contract.startDate) }}</p>
          </div>
          <div>
            <p class="text-dimmed">End Date</p>
            <p class="font-medium">{{ formatDate(contract.endDate) }}</p>
          </div>
          <div v-if="contract.notes" class="col-span-2">
            <p class="text-dimmed">Notes</p>
            <p class="font-medium">{{ contract.notes }}</p>
          </div>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-dimmed mb-3">Parties</p>
        <div class="grid grid-cols-2 gap-4">
          <div class="p-3 rounded-lg bg-elevated space-y-1">
            <p class="text-xs text-dimmed uppercase tracking-wide">Lessor (Vendor)</p>
            <p class="font-medium">{{ contract.lessorOrganization?.name }}</p>
            <p class="text-dimmed">{{ contract.lessorOrganization?.email }}</p>
            <p class="text-dimmed">{{ contract.lessorOrganization?.contactNumber }}</p>
          </div>
          <div class="p-3 rounded-lg bg-elevated space-y-1">
            <p class="text-xs text-dimmed uppercase tracking-wide">Lessee (Clinic)</p>
            <p class="font-medium">{{ contract.lesseeOrganization?.name }}</p>
            <p class="text-dimmed">{{ contract.lesseeOrganization?.email }}</p>
            <p class="text-dimmed">{{ contract.lesseeOrganization?.contactNumber }}</p>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          size="sm"
          color="neutral"
          icon="i-lucide-eye"
          class="cursor-pointer"
          @click="goToHistory"
        >
          View History
        </UButton>
        <!-- NOTE: if user is from Vendor org, with OrgAdmin role, and contract status is pending -->
        <UButton
          v-if="isVendor && isOrgAdmin && contract.status === 0"
          size="sm"
          color="success"
          icon="i-lucide-thumbs-up"
          class="cursor-pointer"
          @click="approveOpen = true"
        >
          Approve
        </UButton>
        <!-- NOTE: if user have OrgAdmin role, and contract status is active -->
        <UButton
          v-if="isOrgAdmin && contract.status === 1"
          size="sm"
          color="error"
          icon="i-lucide-circle-x"
          class="cursor-pointer"
          @click="cancelOpen = true"
        >
          Cancel
        </UButton>
        <!-- NOTE: if user have OrgAdmin role, and contract status is active -->
        <UButton
          v-if="isVendor && isOrgAdmin && contract.status === 1"
          size="sm"
          color="success"
          icon="i-lucide-circle-check"
          class="cursor-pointer"
          @click="completeOpen = true"
        >
          Complete
        </UButton>
      </div>
    </template>
  </UCard>
  <ConfirmationModal
    v-model:open="approveOpen"
    title="Approve Contract"
    message="Are you sure you want to approve this contract? This will mark it as active."
    confirm-text="Approve"
    confirm-color="success"
    :loading="approveStatus === 'loading'"
    @confirm="approve()"
  />
  <ConfirmationModal
    v-model:open="cancelOpen"
    title="Cancel Contract"
    message="Are you sure you want to cancel this contract? This action cannot be undone."
    confirm-text="Cancel Contract"
    confirm-color="error"
    :loading="cancelStatus === 'loading'"
    @confirm="cancel()"
  />
  <ConfirmationModal
    v-model:open="completeOpen"
    title="Complete Contract"
    message="Are you sure you want to mark this contract as completed?"
    confirm-text="Complete"
    confirm-color="success"
    :loading="completeStatus === 'loading'"
    @confirm="complete()"
  />
</template>
