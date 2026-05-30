<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useQueryCache, useMutation } from '@pinia/colada'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AxiosError } from 'axios'

import { updateOwnOrganization } from '@/apis/organizations'
import { updateOrganizationSchema } from '@/schemas/organization'
import type { TUpdateOrganizationSchema } from '@/schemas/organization'
import type { TApiErrorResponse } from '@/types/api'
import type { TOrganization } from '@/types/organization'
import { getApiErrorMessages } from '@/utils/errors'
import ApiErrorAlert from '../ui/ApiErrorAlert.vue'

const props = defineProps<{
  open: boolean
  organization: TOrganization | null | undefined
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const toast = useToast()
const queryCache = useQueryCache()

const state = reactive({
  name: '',
  email: '',
  address: '',
  contactNumber: '',
})

const { mutate, asyncStatus, error } = useMutation({
  mutation: (payload: TUpdateOrganizationSchema) => updateOwnOrganization(payload),
  onSuccess: () => {
    emit('update:open', false)
    toast.add({ title: 'Organization updated', color: 'success' })
  },
  onError: (err: AxiosError<TApiErrorResponse>) => {
    toast.add({
      title: 'Update failed',
      description: err?.response?.data?.message ?? 'Something went wrong.',
      color: 'error',
    })
  },
  onSettled: () => queryCache.invalidateQueries({ key: ['organization', 'me'] }),
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.organization) {
      state.name = props.organization.name ?? ''
      state.email = props.organization.email ?? ''
      state.address = props.organization.address ?? ''
      state.contactNumber = props.organization.contactNumber ?? ''
    }
  },
)

const onSubmit = (payload: FormSubmitEvent<TUpdateOrganizationSchema>) => {
  mutate(payload.data)
}

const isLoading = computed(() => asyncStatus.value === 'loading')
const hasErrors = computed(() => !updateOrganizationSchema.safeParse(state).success)
const errorMessage = computed(() => (error.value ? getApiErrorMessages(error.value) : null))
</script>

<template>
  <UModal :open="open" @update:open="emit('update:open', $event)" title="Edit Organization">
    <template #body>
      <UForm
        :schema="updateOrganizationSchema"
        :state="state"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <UFormField label="Name" name="name">
          <UInput v-model="state.name" placeholder="e.g. St. Luke's" class="w-full" />
        </UFormField>
        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="e.g. org@email.com"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Address" name="address">
          <UInput
            v-model="state.address"
            placeholder="e.g. Street, City, Province"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Contact Number" name="contactNumber">
          <UInput v-model="state.contactNumber" placeholder="e.g. 09123456789" class="w-full" />
        </UFormField>
        <ApiErrorAlert :messages="errorMessage" />
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :disabled="isLoading"
            class="cursor-pointer"
            @click="emit('update:open', false)"
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
