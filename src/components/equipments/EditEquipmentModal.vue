<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useMutation, useQueryCache } from '@pinia/colada'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AxiosError } from 'axios'

import { updateEquipment } from '@/apis/equipments'
import { CONDITION_INPUT_OPTIONS, STATUS_INPUT_OPTIONS } from '@/constants/equipments'
import { updateEquipmentSchema } from '@/schemas/equipment'
import type { TUpdateEquipmentSchema } from '@/schemas/equipment'
import type { TEquipment } from '@/types/equipments'
import type { TApiErrorResponse } from '@/types/api'
import { getApiErrorMessages } from '@/utils/errors'

const props = defineProps<{
  equipment: TEquipment | null | undefined
  equipmentId: string
}>()

const open = defineModel<boolean>('open')

const toast = useToast()
const queryCache = useQueryCache()

const hovered = ref(false)

const state = reactive<TUpdateEquipmentSchema>({
  image: undefined,
  imageUrl: '',
  description: '',
  monthlyRate: 0,
  condition: 0,
  status: 0,
})

const { mutate, asyncStatus, error } = useMutation({
  mutation: (payload: TUpdateEquipmentSchema) => updateEquipment(props.equipmentId, payload),
  onSuccess: () => {
    open.value = false
    toast.add({ title: 'Equipment updated', color: 'success' })
  },
  onError: (err: AxiosError<TApiErrorResponse>) => {
    toast.add({
      title: 'Update failed',
      description: err?.response?.data?.message ?? 'Something went wrong.',
      color: 'error',
    })
  },
  onSettled: () => queryCache.invalidateQueries({ key: ['equipment', props.equipmentId] }),
})

watch(
  () => open.value,
  (isOpen) => {
    if (isOpen && props.equipment) {
      state.image = undefined
      state.imageUrl = props.equipment.imageUrl ?? ''
      state.description = props.equipment.description ?? ''
      state.monthlyRate = props.equipment.monthlyRate ?? 0
      state.status = Number(props.equipment.status) ?? 0
      state.condition = Number(props.equipment.condition) ?? 0
    }
  },
)

const onSubmit = (payload: FormSubmitEvent<TUpdateEquipmentSchema>) => {
  mutate(payload.data)
}

const isLoading = computed(() => asyncStatus.value === 'loading')
const hasErrors = computed(() => !updateEquipmentSchema.safeParse(state).success)
const errorMessage = computed(() => (error.value ? getApiErrorMessages(error.value) : null))
</script>

<template>
  <UModal v-model:open="open" title="Edit Equipment">
    <template #body>
      <UForm
        :schema="updateEquipmentSchema"
        :state="state"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <UFormField label="Image" name="image">
          <div
            class="relative"
            :class="{ 'cursor-pointer': hovered && !state.image && state.imageUrl }"
            @mouseenter="hovered = true"
            @mouseleave="hovered = false"
          >
            <UFileUpload
              v-model="state.image"
              accept="image/*"
              label="Click or drag image here"
              description="PNG, JPG, WEBP (max 5MB)"
              class="w-full"
            />
            <div
              v-if="!state.image && state.imageUrl"
              class="absolute inset-0 rounded-lg overflow-hidden pointer-events-none"
            >
              <img :src="state.imageUrl" alt="Current image" class="w-full h-full object-cover" />
              <div
                class="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity"
                :class="hovered ? 'opacity-100' : 'opacity-0'"
              >
                <UIcon name="i-lucide-pencil" class="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </UFormField>
        <UFormField label="Description" name="description">
          <UTextarea v-model="state.description" class="w-full" />
        </UFormField>
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
        <UFormField label="Status" name="status">
          <USelect
            v-model="state.status"
            :items="STATUS_INPUT_OPTIONS"
            value-key="value"
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
            Save changes
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
