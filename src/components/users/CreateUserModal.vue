<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useMutation, useQueryCache } from '@pinia/colada'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AxiosError } from 'axios'

import { createOwnOrgUser } from '@/apis/users'
import { ROLE_INPUT_OPTIONS } from '@/constants/users'
import { createUserSchema } from '@/schemas/user'
import type { TCreateUserSchema } from '@/schemas/user'
import type { TApiErrorResponse } from '@/types/api'
import { getApiErrorMessages } from '@/utils/errors'

const open = defineModel<boolean>('open')

const toast = useToast()
const queryCache = useQueryCache()

const initialState = {
  fullName: '',
  username: '',
  email: '',
  contactNumber: '',
  password: '',
  role: 2,
}
const state = reactive({ ...initialState })
const showPassword = ref(false)

const {
  mutate: create,
  asyncStatus,
  error,
} = useMutation({
  mutation: (payload: TCreateUserSchema) => createOwnOrgUser(payload),
  onSuccess: () => {
    open.value = false
    Object.assign(state, initialState)
    toast.add({ title: 'User created successfully', color: 'success' })
  },
  onError: (err: AxiosError<TApiErrorResponse>) => {
    toast.add({
      title: 'Failed to create user',
      description: err?.response?.data?.message ?? 'Something went wrong.',
      color: 'error',
    })
  },
  onSettled: () => queryCache.invalidateQueries({ key: ['users'] }),
})

const onSubmit = (payload: FormSubmitEvent<TCreateUserSchema>) => {
  create(payload.data)
}

const isLoading = computed(() => asyncStatus.value === 'loading')
const hasErrors = computed(() => !createUserSchema.safeParse(state).success)
const errorMessage = computed(() => (error.value ? getApiErrorMessages(error.value) : null))
</script>

<template>
  <UModal v-model:open="open" title="Add User">
    <template #body>
      <UForm
        :schema="createUserSchema"
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
        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="e.g. juan@email.com"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Contact Number" name="contactNumber">
          <UInput v-model="state.contactNumber" placeholder="e.g. 09123456789" class="w-full" />
        </UFormField>
        <UFormField label="Password" name="password">
          <UInput
            v-model="state.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Min. 8 characters"
            class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>
        <UFormField label="Role" name="role">
          <USelect
            v-model="state.role"
            :items="ROLE_INPUT_OPTIONS"
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
            Create
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
