<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation, useQueryCache } from '@pinia/colada'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AxiosError } from 'axios'

import { createEquipment } from '@/apis/equipments'
import { CONDITION_INPUT_OPTIONS } from '@/constants/equipments'
import { createEquipmentSchema } from '@/schemas/equipment'
import type { TCreateEquipmentSchema } from '@/schemas/equipment'
import type { TApiErrorResponse } from '@/types/api'
import { getApiErrorMessages } from '@/utils/errors'

const open = defineModel<boolean>('open')

const toast = useToast()
const router = useRouter()
const queryCache = useQueryCache()

const state = reactive({
  imageUrl: '',
  name: '',
  brand: '',
  model: '',
  serialNumber: '',
  description: '',
  monthlyRate: 0,
  condition: 0,
  status: 0,
})

const { mutate, asyncStatus, error } = useMutation({
  mutation: (payload: TCreateEquipmentSchema) => createEquipment(payload),
  onSuccess: () => {
    open.value = false
    toast.add({ title: 'Equipment created successfully', color: 'success' })
    router.push('/equipments')
  },
  onError: (err: AxiosError<TApiErrorResponse>) => {
    toast.add({
      title: 'Failed to create equipment',
      description: err?.response?.data?.message ?? 'Something went wrong.',
      color: 'error',
    })
  },
  onSettled: () => queryCache.invalidateQueries({ key: ['equipments'] }),
})

const onSubmit = (payload: FormSubmitEvent<TCreateEquipmentSchema>) => {
  mutate(payload.data)
}

const isLoading = computed(() => asyncStatus.value === 'loading')
const hasErrors = computed(() => !createEquipmentSchema.safeParse(state).success)
const errorMessage = computed(() => (error.value ? getApiErrorMessages(error.value) : null))
</script>

<template>
  <UModal v-model:open="open" title="Add Equipment">
    <template #body>
      <UForm
        :schema="createEquipmentSchema"
        :state="state"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <UFormField label="Image URL" name="imageUrl">
          <UInput
            v-model="state.imageUrl"
            placeholder="https://example.com/image.jpg"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Name" name="name">
          <UInput v-model="state.name" placeholder="MRI Machine" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Brand" name="brand">
            <UInput v-model="state.brand" placeholder="Siemens" class="w-full" />
          </UFormField>
          <UFormField label="Model" name="model">
            <UInput v-model="state.model" placeholder="MAGNETOM Altea" class="w-full" />
          </UFormField>
        </div>
        <UFormField label="Serial Number" name="serialNumber">
          <UInput v-model="state.serialNumber" placeholder="SN-2024-001" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Monthly Rate (PHP)" name="monthlyRate">
            <UInput v-model.number="state.monthlyRate" type="number" min="0" class="w-full" />
          </UFormField>
          <UFormField label="Condition" name="condition">
            <USelect
              v-model="state.condition"
              :items="CONDITION_INPUT_OPTIONS"
              value-key="value"
              class="w-full"
            />
          </UFormField>
        </div>
        <UFormField label="Description" name="description">
          <UTextarea
            v-model="state.description"
            placeholder="Optional description"
            class="w-full"
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
            Create
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
