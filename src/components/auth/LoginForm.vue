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
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    required: true,
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

const errorMessage = computed(() => {
  if (!error.value) return null
  return (
    (error.value as AxiosError<TApiErrorResponse>)?.response?.data?.message ??
    'Something went wrong.'
  )
})
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
    <template #footer>
      <p v-if="errorMessage" class="text-sm text-center text-red-500">
        {{ errorMessage }}
      </p>
    </template>
  </UAuthForm>
</template>
