<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { storeToRefs } from 'pinia'
import type { AxiosError } from 'axios'
import type { FormSubmitEvent } from '@nuxt/ui'

import { createPayment } from '@/apis/payments'
import { getContracts } from '@/apis/contracts'
import { useAuthStore } from '@/stores/auth'
import { getApiErrorMessages } from '@/utils/errors'
import { createPaymentSchema, type TCreatePaymentSchema } from '@/schemas/payment'
import type { TContract } from '@/types/contract'
import type { TApiErrorResponse } from '@/types/api'
import { PAYMENT_METHOD_OPTIONS } from '@/constants/payments'
import { formatCurrency, formatDate } from '@/utils/format'

const open = defineModel<boolean>('open')

const toast = useToast()
const queryCache = useQueryCache()
const { isOrgAdmin, isStaff } = storeToRefs(useAuthStore())

const state = reactive({
  leaseContractId: '',
  paymentMethod: '',
  remarks: '',
})

const { data: contractsData, status: contractsStatus } = useQuery({
  key: () => ['contracts-for-payment'],
  query: () => getContracts({ pageParam: 1, statuses: [2, 3], excludePending: true }),
  enabled: computed(() => !!open.value && (isOrgAdmin.value || isStaff.value)),
  staleTime: 0,
})

const contractsLoading = computed(() => contractsStatus.value === 'pending')

const contractOptions = computed(() => {
  if (contractsLoading.value) return []
  return ((contractsData.value?.data as TContract[]) ?? []).map((c) => ({
    label: c.contractNumber,
    value: c.id,
    monthlyPayment: c.monthlyPayment,
    startDate: c.startDate,
    endDate: c.endDate,
  }))
})

const selectedContract = computed(
  () => contractOptions.value.find((c) => c.value === state.leaseContractId) ?? null,
)

const { mutate, asyncStatus, error } = useMutation({
  mutation: (payload: TCreatePaymentSchema) => createPayment(payload),
  onSuccess: () => {
    open.value = false
    toast.add({ title: 'Payment recorded successfully', color: 'success' })
  },
  onError: (err: AxiosError<TApiErrorResponse>) => {
    toast.add({
      title: 'Failed to record payment',
      description: err?.response?.data?.message ?? 'Something went wrong.',
      color: 'error',
    })
  },
  onSettled: () => queryCache.invalidateQueries({ key: ['payments'] }),
})

const resetForm = () => {
  state.leaseContractId = ''
  state.paymentMethod = ''
  state.remarks = ''
}

const onSubmit = (payload: FormSubmitEvent<TCreatePaymentSchema>) => {
  mutate(payload.data)
}

watch(open, (val) => {
  if (!val) {
    resetForm()
    queryCache.invalidateQueries({ key: ['contracts-for-payment'] })
  }
})

const isLoading = computed(() => asyncStatus.value === 'loading')
const hasErrors = computed(() => !createPaymentSchema.safeParse(state).success)
const errorMessage = computed(() => (error.value ? getApiErrorMessages(error.value) : null))
</script>

<template>
  <UModal v-model:open="open" title="Record payment">
    <template #body>
      <UForm
        :schema="createPaymentSchema"
        :state="state"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <UFormField label="Contract" name="leaseContractId">
          <USelect
            v-model="state.leaseContractId"
            :items="contractOptions"
            value-key="value"
            label-key="label"
            :placeholder="contractsLoading ? 'Loading contracts...' : 'Select a contract'"
            :disabled="contractsLoading"
            class="w-full"
          />
        </UFormField>

        <div
          v-if="selectedContract"
          class="rounded-lg border border-default bg-elevated text-sm overflow-hidden"
        >
          <p
            class="text-xs font-semibold uppercase tracking-wide text-dimmed px-4 py-2 border-b border-default"
          >
            Payment summary
          </p>
          <div class="grid grid-cols-2 gap-x-4 gap-y-3 p-4">
            <div>
              <p class="text-dimmed text-xs mb-0.5">Contract</p>
              <p class="font-medium font-mono">{{ selectedContract.label }}</p>
            </div>
            <div>
              <p class="text-dimmed text-xs mb-0.5">Monthly amount</p>
              <p class="font-semibold text-primary text-base">
                {{ formatCurrency(selectedContract.monthlyPayment) }}
              </p>
            </div>
            <div>
              <p class="text-dimmed text-xs mb-0.5">Start date</p>
              <p class="font-medium">{{ formatDate(selectedContract.startDate) }}</p>
            </div>
            <div>
              <p class="text-dimmed text-xs mb-0.5">End date</p>
              <p class="font-medium">{{ formatDate(selectedContract.endDate) }}</p>
            </div>
          </div>
          <div
            class="flex items-start gap-2 px-4 py-2.5 border-t border-default text-xs text-dimmed"
          >
            <UIcon name="i-lucide-info" class="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p>Final amount may include penalties added by the vendor upon review.</p>
          </div>
        </div>

        <UFormField label="Payment method" name="paymentMethod">
          <USelect
            v-model="state.paymentMethod"
            :items="PAYMENT_METHOD_OPTIONS"
            value-key="value"
            placeholder="Select payment method"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Remarks" name="remarks">
          <UTextarea
            v-model="state.remarks"
            placeholder="Optional remarks..."
            class="w-full"
            :rows="3"
          />
        </UFormField>

        <ApiErrorAlert :messages="errorMessage" />

        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :disabled="isLoading"
            class="cursor-pointer"
            @click="open = false"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            color="primary"
            :loading="isLoading"
            :disabled="hasErrors"
            :class="hasErrors ? 'cursor-not-allowed' : 'cursor-pointer'"
          >
            Record payment
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
