<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { storeToRefs } from 'pinia'
import type { AxiosError } from 'axios'

import { confirmPayment, getPaymentById } from '@/apis/payments'
import { useAuthStore } from '@/stores/auth'
import type { TApiErrorResponse } from '@/types/api'
import { formatCurrency, formatDate } from '@/utils/format'
import { PENALTY_REASON_OPTIONS } from '@/constants/payments'

const route = useRoute()
const toast = useToast()
const queryCache = useQueryCache()
const { isOrgAdmin, isVendor } = storeToRefs(useAuthStore())

const paymentId = route.params.paymentId as string
const showPenaltyModal = ref(false)
const showDeleteConfirmationtModal = ref(false)

const { data, asyncStatus } = useQuery({
  key: () => ['payment', paymentId],
  query: () => getPaymentById(paymentId),
})

const { mutate: confirm, asyncStatus: confirmStatus } = useMutation({
  mutation: () => confirmPayment(paymentId),
  onSuccess: () => {
    toast.add({ title: 'Payment confirmed successfully', color: 'success' })
    showDeleteConfirmationtModal.value = false
    queryCache.invalidateQueries({ key: ['payment', paymentId] })
  },
  onError: (err: AxiosError<TApiErrorResponse>) => {
    toast.add({
      title: 'Confirmation failed',
      description: err?.response?.data?.message ?? 'Something went wrong.',
      color: 'error',
    })
  },
})

const payment = computed(() => data.value?.data)

const statusBadge = computed(() => {
  switch (payment.value?.status) {
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
})
</script>

<template>
  <USkeleton v-if="asyncStatus === 'loading'" class="h-64 w-full" />
  <UCard v-else-if="payment">
    <template #header>
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <h2 class="text-lg font-semibold font-mono">{{ payment.transactionReference }}</h2>
          <p class="text-sm text-dimmed">
            {{ payment.leaseContract?.lessorOrganization?.name }} →
            {{ payment.leaseContract?.lesseeOrganization?.name }}
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
              v-if="payment.leaseContract?.equipment?.imageUrl"
              :src="payment.leaseContract.equipment.imageUrl"
              :alt="payment.leaseContract.equipment.name"
              class="w-full h-full object-cover"
            />
            <UIcon v-else name="i-lucide-monitor" class="w-8 h-8 text-dimmed" />
          </div>
          <div>
            <p class="font-medium">{{ payment.leaseContract?.equipment?.name }}</p>
            <p class="text-dimmed">
              {{ payment.leaseContract?.equipment?.brand }} ·
              {{ payment.leaseContract?.equipment?.model }}
            </p>
            <p class="font-mono text-xs text-dimmed">
              {{ payment.leaseContract?.equipment?.serialNumber }}
            </p>
          </div>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-dimmed mb-3">
          Payment details
        </p>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-dimmed">Payment method</p>
            <p class="font-medium">{{ payment.paymentMethod }}</p>
          </div>
          <div>
            <p class="text-dimmed">Amount</p>
            <p class="font-semibold text-primary">{{ formatCurrency(payment.amount) }}</p>
          </div>
          <div class="col-span-2">
            <p class="text-dimmed mb-1">Penalty reasons</p>
            <p v-if="!payment.penaltyReasons?.length" class="font-medium">-</p>
            <div v-else class="grid grid-cols-2 gap-1">
              <div
                v-for="reason in payment.penaltyReasons"
                :key="reason"
                class="flex items-center gap-2"
              >
                <UIcon name="i-lucide-triangle-alert" class="w-3.5 h-3.5 text-red-500 shrink-0" />
                <p class="font-medium">
                  {{ PENALTY_REASON_OPTIONS.find((o) => o.value === reason)?.label }}
                </p>
              </div>
            </div>
          </div>
          <div>
            <p class="text-dimmed">Penalty amount</p>
            <p class="font-medium" :class="payment.penaltyAmount > 0 ? 'text-red-500' : ''">
              {{ formatCurrency(payment.penaltyAmount ?? 0) }}
            </p>
          </div>
          <div>
            <p class="text-dimmed">Total amount</p>
            <p class="font-semibold text-primary">
              {{ formatCurrency((payment.amount ?? 0) + (payment.penaltyAmount ?? 0)) }}
            </p>
          </div>
          <div>
            <p class="text-dimmed">Due date</p>
            <p
              class="font-medium"
              :class="{ 'text-red-500': new Date(payment.dueDate) < new Date() }"
            >
              {{ formatDate(payment.dueDate) }}
            </p>
          </div>
          <div>
            <p class="text-dimmed">Paid at</p>
            <p class="font-medium">{{ formatDate(payment.paidAt) }}</p>
          </div>
          <div>
            <p class="text-dimmed">Created at</p>
            <p class="font-medium">{{ formatDate(payment.createdAt) }}</p>
          </div>
          <div v-if="payment.remarks" class="col-span-2">
            <p class="text-dimmed">Remarks</p>
            <p class="font-medium">{{ payment.remarks }}</p>
          </div>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-dimmed mb-3">Lease contract</p>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-dimmed">Contract number</p>
            <p class="font-medium font-mono">{{ payment.leaseContract?.contractNumber }}</p>
          </div>
          <div>
            <p class="text-dimmed">Monthly payment</p>
            <p class="font-medium">
              {{ formatCurrency(payment.leaseContract?.monthlyPayment ?? 0) }}
            </p>
          </div>
          <div>
            <p class="text-dimmed">Start date</p>
            <p class="font-medium">{{ formatDate(payment.leaseContract?.startDate) }}</p>
          </div>
          <div>
            <p class="text-dimmed">End date</p>
            <p class="font-medium">{{ formatDate(payment.leaseContract?.endDate) }}</p>
          </div>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-dimmed mb-3">Parties</p>
        <div class="grid grid-cols-2 gap-4">
          <div class="p-3 rounded-lg bg-elevated space-y-1">
            <p class="text-xs text-dimmed uppercase tracking-wide">Lessor (Vendor)</p>
            <p class="font-medium">{{ payment.leaseContract?.lessorOrganization?.name }}</p>
            <p class="text-dimmed">{{ payment.leaseContract?.lessorOrganization?.email }}</p>
            <p class="text-dimmed">
              {{ payment.leaseContract?.lessorOrganization?.contactNumber }}
            </p>
          </div>
          <div class="p-3 rounded-lg bg-elevated space-y-1">
            <p class="text-xs text-dimmed uppercase tracking-wide">Lessee (Clinic)</p>
            <p class="font-medium">{{ payment.leaseContract?.lesseeOrganization?.name }}</p>
            <p class="text-dimmed">{{ payment.leaseContract?.lesseeOrganization?.email }}</p>
            <p class="text-dimmed">
              {{ payment.leaseContract?.lesseeOrganization?.contactNumber }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          v-if="isVendor && isOrgAdmin && payment.status === 0 && !payment.penaltyReasons?.length"
          size="sm"
          color="error"
          icon="i-lucide-triangle-alert"
          class="cursor-pointer"
          @click="showPenaltyModal = true"
        >
          Add penalty
        </UButton>
        <UButton
          v-if="isVendor && isOrgAdmin && (payment.status === 0 || payment.status === 3)"
          size="sm"
          color="success"
          icon="i-lucide-circle-check"
          class="cursor-pointer"
          :loading="confirmStatus === 'loading'"
          @click="showDeleteConfirmationtModal = true"
        >
          Confirm payment
        </UButton>
      </div>
    </template>
  </UCard>
  <AddPenaltyModal
    v-model:open="showPenaltyModal"
    :payment-id="paymentId"
    :monthly-amount="payment?.leaseContract?.monthlyPayment ?? 0"
  />
  <ConfirmationModal
    v-model:open="showDeleteConfirmationtModal"
    title="Confirm Payment"
    message="Are you sure you want to confirm this payment? This action cannot be undone."
    confirm-text="Confirm"
    confirm-color="success"
    :loading="confirmStatus === 'loading'"
    @confirm="confirm"
  />
</template>
