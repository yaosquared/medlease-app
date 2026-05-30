<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useMutation, useQueryCache } from '@pinia/colada'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AxiosError } from 'axios'

import { createContract } from '@/apis/contracts'
import { createContractSchema } from '@/schemas/contract'
import type { TCreateContractSchema } from '@/schemas/contract'
import type { TApiErrorResponse } from '@/types/api'
import { getApiErrorMessages } from '@/utils/errors'

const props = defineProps<{
  equipmentId: string
}>()

const open = defineModel<boolean>('open')

const toast = useToast()
const queryCache = useQueryCache()

const state = reactive({
  equipmentId: props.equipmentId,
  startDate: null,
  endDate: null,
  notes: '',
})

const { mutate, asyncStatus, error } = useMutation({
  mutation: (payload: TCreateContractSchema) => createContract(payload),
  onSuccess: () => {
    open.value = false
    toast.add({ title: 'Contract created successfully', color: 'success' })
  },
  onError: (err: AxiosError<TApiErrorResponse>) => {
    toast.add({
      title: 'Failed to create contract',
      description: err?.response?.data?.message ?? 'Something went wrong.',
      color: 'error',
    })
  },
  onSettled: () => queryCache.invalidateQueries({ key: ['contracts'] }),
})

const onSubmit = (payload: FormSubmitEvent<TCreateContractSchema>) => {
  mutate({
    equipmentId: payload.data.equipmentId,
    startDate: payload.data.startDate,
    endDate: payload.data.endDate,
    notes: payload.data.notes ?? '',
  })
}

const isLoading = computed(() => asyncStatus.value === 'loading')
const hasErrors = computed(() => !createContractSchema.safeParse(state).success)
const errorMessage = computed(() => (error.value ? getApiErrorMessages(error.value) : null))
</script>

<template>
  <UModal v-model:open="open" title="Create Lease Contract">
    <template #body>
      <UForm
        :schema="createContractSchema"
        :state="state"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Start Date" name="startDate">
            <UInputDate v-model="state.startDate" :ui="{ base: 'justify-center' }" class="w-full" />
          </UFormField>
          <UFormField label="End Date" name="endDate">
            <UInputDate v-model="state.endDate" :ui="{ base: 'justify-center' }" class="w-full" />
          </UFormField>
        </div>
        <UFormField label="Notes" name="notes">
          <UTextarea v-model="state.notes" placeholder="Optional notes" class="w-full" />
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
            Create
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
