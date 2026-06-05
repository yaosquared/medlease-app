<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useMutation, useQueryCache } from '@pinia/colada'
import type { AxiosError } from 'axios'
import type { FormSubmitEvent } from '@nuxt/ui'

import { addPenalty } from '@/apis/payments'
import { getApiErrorMessages } from '@/utils/errors'
import { addPenaltySchema, type TAddPenaltySchema } from '@/schemas/payment'
import type { TApiErrorResponse } from '@/types/api'
import { formatCurrency } from '@/utils/format'
import { PENALTY_REASON_OPTIONS } from '@/constants/payments'

const open = defineModel<boolean>('open')

const props = defineProps<{
  paymentId: string
  monthlyAmount: number
}>()

const toast = useToast()
const queryCache = useQueryCache()

const state = reactive({
  penaltyReasons: [] as number[],
  remarks: '',
})

const selectedPenalties = computed(() =>
  PENALTY_REASON_OPTIONS.filter((o) => state.penaltyReasons.includes(o.value)),
)

const penaltyAmount = computed(() => {
  const totalRate = selectedPenalties.value.reduce((sum, p) => sum + p.rate, 0)
  return (props.monthlyAmount * totalRate) / 100
})

const resetForm = () => {
  state.penaltyReasons = []
  state.remarks = ''
}

const { mutate, asyncStatus, error } = useMutation({
  mutation: (payload: TAddPenaltySchema) => addPenalty(props.paymentId, payload),
  onSuccess: () => {
    open.value = false
    toast.add({ title: 'Penalty added successfully', color: 'success' })
  },
  onError: (err: AxiosError<TApiErrorResponse>) => {
    toast.add({
      title: 'Failed to add penalty',
      description: err?.response?.data?.message ?? 'Something went wrong.',
      color: 'error',
    })
  },
  onSettled: () => queryCache.invalidateQueries({ key: ['payment', props.paymentId] }),
})

const onSubmit = (payload: FormSubmitEvent<TAddPenaltySchema>) => {
  mutate({ penaltyReasons: payload.data.penaltyReasons, remarks: payload.data.remarks })
}

watch(open, (val) => {
  if (!val) resetForm()
})

const isLoading = computed(() => asyncStatus.value === 'loading')
const hasErrors = computed(() => !addPenaltySchema.safeParse(state).success)
const errorMessage = computed(() => (error.value ? getApiErrorMessages(error.value) : null))
</script>

<template>
  <UModal v-model:open="open" title="Add penalty">
    <template #body>
      <UForm
        :schema="addPenaltySchema"
        :state="state"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <UFormField label="Penalty reasons" name="penaltyReasons">
          <USelectMenu
            v-model="state.penaltyReasons"
            :items="PENALTY_REASON_OPTIONS"
            value-key="value"
            label-key="label"
            multiple
            placeholder="Select penalty reasons"
            class="w-full"
          />
        </UFormField>
        <div class="rounded-lg border border-default bg-elevated text-sm overflow-hidden">
          <div class="grid grid-cols-2 gap-3 p-3">
            <div>
              <p class="text-dimmed">Monthly leasing amount</p>
              <p class="font-semibold text-primary">{{ formatCurrency(monthlyAmount) }}</p>
            </div>
            <div>
              <p class="text-dimmed">Penalty amount</p>
              <p class="font-semibold" :class="penaltyAmount > 0 ? 'text-red-500' : 'text-dimmed'">
                {{ penaltyAmount > 0 ? formatCurrency(penaltyAmount) : '—' }}
              </p>
            </div>
            <template v-if="selectedPenalties.length > 0">
              <div class="col-span-2 flex flex-col gap-1">
                <div
                  v-for="p in selectedPenalties"
                  :key="p.value"
                  class="flex items-center gap-1 text-xs text-dimmed"
                >
                  <UIcon name="i-lucide-info" class="w-3 h-3 shrink-0" />
                  {{ p.label }} — {{ p.rate }}% of monthly amount
                </div>
              </div>
            </template>
            <div class="col-span-2 border-t border-default pt-2">
              <p class="text-dimmed">Total amount</p>
              <p class="font-bold text-primary">
                {{ formatCurrency(monthlyAmount + penaltyAmount) }}
              </p>
            </div>
          </div>
        </div>
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
            Add penalty
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
