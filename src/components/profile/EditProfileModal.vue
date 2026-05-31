<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useMutation, useQueryCache } from '@pinia/colada'
import { storeToRefs } from 'pinia'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AxiosError } from 'axios'

import { updateProfile } from '@/apis/profile'
import { useProfileStore } from '@/stores/profile'
import { getApiErrorMessages } from '@/utils/errors'
import { editProfileSchema, type TEditProfileSchema } from '@/schemas/profile'
import type { TApiErrorResponse } from '@/types/api'

const open = defineModel<boolean>('open')

const toast = useToast()
const queryCache = useQueryCache()
const { profile } = storeToRefs(useProfileStore())

const state = reactive<TEditProfileSchema>({
  fullName: '',
  username: '',
  contactNumber: '',
})

watch(open, (val) => {
  if (val && profile.value) {
    state.fullName = profile.value.fullName
    state.username = profile.value.username
    state.contactNumber = profile.value.contactNumber
  }
})

const { mutate, asyncStatus, error } = useMutation({
  mutation: (payload: TEditProfileSchema) => updateProfile(payload),
  onSuccess: () => {
    open.value = false
    toast.add({ title: 'Profile updated successfully', color: 'success' })
    queryCache.invalidateQueries({ key: ['profile'] })
  },
  onError: (err: AxiosError<TApiErrorResponse>) => {
    toast.add({
      title: 'Failed to update profile',
      description: err?.response?.data?.message ?? 'Something went wrong.',
      color: 'error',
    })
  },
})

const onSubmit = (payload: FormSubmitEvent<TEditProfileSchema>) => {
  mutate(payload.data)
}

const isLoading = computed(() => asyncStatus.value === 'loading')
const hasErrors = computed(() => !editProfileSchema.safeParse(state).success)
const errorMessage = computed(() => (error.value ? getApiErrorMessages(error.value) : null))
</script>

<template>
  <UModal v-model:open="open" title="Edit profile">
    <template #body>
      <UForm
        :schema="editProfileSchema"
        :state="state"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <UFormField label="Full Name" name="fullName">
          <UInput v-model="state.fullName" placeholder="e.g. Juan dela Cruz" class="w-full" />
        </UFormField>
        <UFormField label="Username" name="username">
          <UInput v-model="state.username" placeholder="e.g. juandc" class="w-full" />
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
