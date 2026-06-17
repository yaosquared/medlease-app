<script setup lang="ts">
import { computed } from 'vue'
import { useMutation, useQueryCache } from '@pinia/colada'
import { storeToRefs } from 'pinia'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AxiosError } from 'axios'

import { updateOwnOrgUser } from '@/apis/users'
import { useAuthStore } from '@/stores/auth'
import { ROLE_INPUT_OPTIONS } from '@/constants/users.ts'
import { updateUserSchema } from '@/schemas/user'
import type { TUpdateUserSchema } from '@/schemas/user'
import type { TApiErrorResponse } from '@/types/api'
import { getApiErrorMessages } from '@/utils/errors'

const props = defineProps<{
  userId: string
}>()

const open = defineModel<boolean>('open')
const state = defineModel<TUpdateUserSchema>('form', {
  default: () => ({ contactNumber: '', role: 2 }),
})

const { isSuperAdmin } = storeToRefs(useAuthStore())
const toast = useToast()
const queryCache = useQueryCache()

const { mutate, asyncStatus, error } = useMutation({
  mutation: (payload: TUpdateUserSchema) => updateOwnOrgUser(props.userId, payload),
  onSuccess: () => {
    open.value = false
    toast.add({ title: 'User updated successfully', color: 'success' })
  },
  onError: (err: AxiosError<TApiErrorResponse>) => {
    toast.add({
      title: 'Update failed',
      description: err?.response?.data?.message ?? 'Something went wrong.',
      color: 'error',
    })
  },
  onSettled: () =>
    queryCache.invalidateQueries({
      key: [isSuperAdmin.value ? 'super-admin' : 'admin', 'user', props.userId],
    }),
})

const onSubmit = (payload: FormSubmitEvent<TUpdateUserSchema>) => {
  mutate(payload.data)
}

const isLoading = computed(() => asyncStatus.value === 'loading')
const hasErrors = computed(() => !updateUserSchema.safeParse(state.value).success)
const errorMessage = computed(() => (error.value ? getApiErrorMessages(error.value) : null))
</script>

<template>
  <UModal v-model:open="open" title="Edit User">
    <template #body>
      <UForm
        :schema="updateUserSchema"
        :state="state"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <UFormField label="Contact Number" name="contactNumber">
          <UInput
            v-model="state.contactNumber"
            placeholder="e.g. 09123456789"
            class="w-full"
            :ui="{ base: 'text-sm' }"
          />
        </UFormField>
        <UFormField label="Role" name="role">
          <USelect
            v-model="state.role"
            :items="ROLE_INPUT_OPTIONS"
            value-key="value"
            class="w-full"
            :ui="{ base: 'text-sm' }"
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
