<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@pinia/colada'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AxiosError } from 'axios'

import { login } from '@/apis/auth'
import { useAuthStore } from '@/stores/auth'
import { loginSchema } from '@/schemas/auth'
import type { TLoginSchema } from '@/types/auth'
import type { TApiErrorResponse } from '@/types/api'
import { getApiErrorMessages } from '@/utils/errors'

const { setTokens } = useAuthStore()
const toast = useToast()
const router = useRouter()

const fields = [
  {
    name: 'username',
    type: 'text',
    label: 'Username',
    placeholder: 'Enter your username',
    required: true,
    ui: { error: 'text-xs' },
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    required: true,
    ui: { error: 'text-xs' },
  },
]

const { mutate, isLoading, error } = useMutation({
  mutation: (data: TLoginSchema) => login(data),
  async onSuccess(data) {
    setTokens(data.data.accessToken, data.data.refreshToken)
    toast.add({ title: 'Logged in!', color: 'success' })
    router.push('/dashboard')
  },
  onError(err: AxiosError<TApiErrorResponse>) {
    toast.add({
      title: 'Login failed',
      description: err?.response?.data?.message ?? 'Something went wrong.',
      color: 'error',
    })
  },
})

const onSubmit = (payload: FormSubmitEvent<TLoginSchema>) => {
  mutate(payload.data)
}

const errorMessage = computed(() => (error.value ? getApiErrorMessages(error.value) : null))
</script>

<template>
  <UAuthForm
    :schema="loginSchema"
    :fields="fields"
    title="Login"
    description="Enter your credentials to access your account."
    icon="i-lucide-user"
    :submit="{ label: isLoading ? 'Signing in...' : 'Sign In' }"
    @submit="onSubmit"
  >
    <template #validation>
      <ApiErrorAlert :messages="errorMessage" />
    </template>
  </UAuthForm>
</template>
