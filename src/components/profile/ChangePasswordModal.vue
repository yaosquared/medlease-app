<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useMutation } from '@pinia/colada'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AxiosError } from 'axios'

import { changePassword } from '@/apis/profile'
import { getApiErrorMessages } from '@/utils/errors'
import { changePasswordSchema, type TChangePasswordSchema } from '@/schemas/profile'
import type { TApiErrorResponse } from '@/types/api'

const open = defineModel<boolean>('open')

const toast = useToast()
const showPasswords = ref(false)

const state = reactive<TChangePasswordSchema>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const { mutate, asyncStatus, error } = useMutation({
  mutation: (payload: TChangePasswordSchema) => changePassword(payload),
  onSuccess: () => {
    open.value = false
    toast.add({ title: 'Password changed successfully', color: 'success' })
    resetForm()
  },
  onError: (err: AxiosError<TApiErrorResponse>) => {
    toast.add({
      title: 'Failed to change password',
      description: err?.response?.data?.message ?? 'Something went wrong.',
      color: 'error',
    })
  },
})

const resetForm = () => {
  state.currentPassword = ''
  state.newPassword = ''
  state.confirmPassword = ''
  showPasswords.value = false
}

const onSubmit = (payload: FormSubmitEvent<TChangePasswordSchema>) => {
  mutate(payload.data)
}

const isLoading = computed(() => asyncStatus.value === 'loading')
const hasErrors = computed(() => !changePasswordSchema.safeParse(state).success)
const errorMessage = computed(() => (error.value ? getApiErrorMessages(error.value) : null))
</script>

<template>
  <UModal v-model:open="open" title="Change password">
    <template #body>
      <UForm
        :schema="changePasswordSchema"
        :state="state"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <UFormField label="Current password" name="currentPassword">
          <UInput
            v-model="state.currentPassword"
            :type="showPasswords ? 'text' : 'password'"
            placeholder="Enter current password"
            class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                :icon="showPasswords ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="showPasswords ? 'Hide password' : 'Show password'"
                @click="showPasswords = !showPasswords"
              />
            </template>
          </UInput>
        </UFormField>
        <UFormField label="New password" name="newPassword">
          <UInput
            v-model="state.newPassword"
            :type="showPasswords ? 'text' : 'password'"
            placeholder="Min. 8 characters"
            class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                :icon="showPasswords ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="showPasswords ? 'Hide password' : 'Show password'"
                @click="showPasswords = !showPasswords"
              />
            </template>
          </UInput>
        </UFormField>
        <UFormField label="Confirm new password" name="confirmPassword">
          <UInput
            v-model="state.confirmPassword"
            :type="showPasswords ? 'text' : 'password'"
            placeholder="Re-enter new password"
            class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                :icon="showPasswords ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="showPasswords ? 'Hide password' : 'Show password'"
                @click="showPasswords = !showPasswords"
              />
            </template>
          </UInput>
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
            Change password
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
