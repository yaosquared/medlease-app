<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@pinia/colada'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AxiosError } from 'axios'

import { registerSchema } from '@/schemas/auth'
import type { TRegisterSchema } from '@/types/auth'
import type { TApiErrorResponse } from '@/types/api'
import { register } from '@/apis/auth'

const toast = useToast()
const router = useRouter()

const orgType = ref([
  { label: 'Clinic', value: 0 },
  { label: 'Vendor', value: 1 },
])
const showPasswords = ref(false)

const state = reactive({
  fullName: '',
  username: '',
  email: '',
  contactNumber: '',
  password: '',
  confirmPassword: '',
  orgName: '',
  orgType: undefined as number | undefined,
  address: '',
  orgEmail: '',
  orgContactNumber: '',
})

const { mutate, isLoading, error } = useMutation({
  mutation: (data: TRegisterSchema) => register(data),
  onSuccess(data) {
    toast.add({ title: 'Logged in!', description: data.message, color: 'success' })
    router.push('/login')
  },
  onError(err: AxiosError<TApiErrorResponse>) {
    toast.add({
      title: 'Registration failed',
      description: err?.response?.data?.message ?? 'Something went wrong. Please try again.',
      color: 'error',
    })
  },
})

const onSubmit = (payload: FormSubmitEvent<TRegisterSchema>) => {
  mutate(payload.data)
}

const errorMessage = computed(() => {
  if (!error.value) return null
  const err = error.value as AxiosError<TApiErrorResponse>
  const data = err?.response?.data
  if (!data) return ['Something went wrong.']

  if (data.errors?.length) {
    return data.errors.flatMap((e) => e.messages)
  }

  return [data.message ?? 'Something went wrong.']
})
</script>

<template>
  <UForm :schema="registerSchema" :state="state" @submit="onSubmit">
    <div class="flex flex-col items-center gap-2 mb-6">
      <UIcon name="i-lucide-user-plus" class="size-8" />
      <div class="text-center">
        <p class="font-semibold text-lg">Create an account</p>
        <p class="text-sm text-muted">Register your organization to get started.</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="col-span-2 flex flex-col gap-4">
        <UFormField label="Full Name" name="fullName">
          <UInput v-model="state.fullName" placeholder="e.g. Juan dela Cruz" class="w-full" />
        </UFormField>
        <UFormField label="Username" name="username">
          <UInput v-model="state.username" placeholder="e.g. juan_dc" class="w-full" />
        </UFormField>
      </div>

      <UFormField label="Email" name="email">
        <UInput v-model="state.email" type="email" placeholder="juan@example.com" class="w-full" />
      </UFormField>
      <UFormField label="Contact Number" name="contactNumber">
        <UInput v-model="state.contactNumber" placeholder="09XXXXXXXXX" class="w-full" />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput
          v-model="state.password"
          :type="showPasswords ? 'text' : 'password'"
          placeholder="Min 8 chars"
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
      <UFormField label="Confirm Password" name="confirmPassword">
        <UInput
          v-model="state.confirmPassword"
          :type="showPasswords ? 'text' : 'password'"
          placeholder="Re-enter password"
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

      <UFormField label="Organization Name" name="orgName">
        <UInput v-model="state.orgName" placeholder="e.g. St. Luke's" class="w-full" />
      </UFormField>
      <UFormField label="Organization Type" name="orgType">
        <USelect
          v-model="state.orgType"
          :items="orgType"
          placeholder="Select type"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Organization Email" name="orgEmail">
        <UInput
          v-model="state.orgEmail"
          type="email"
          placeholder="org@example.com"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Organization Contact" name="orgContactNumber">
        <UInput v-model="state.orgContactNumber" placeholder="09XXXXXXXXX" class="w-full" />
      </UFormField>

      <UFormField label="Organization Address" name="address" class="col-span-2">
        <UInput v-model="state.address" placeholder="Street, City, Province" class="w-full" />
      </UFormField>
    </div>

    <div class="mt-6">
      <UButton type="submit" block>{{
        isLoading ? 'Creating account...' : 'Create Account'
      }}</UButton>
    </div>

    <ul v-if="errorMessage" class="text-sm text-center text-red-500 list-inside pt-4">
      <li v-for="(msg, i) in errorMessage" :key="i">{{ msg }}</li>
    </ul>
  </UForm>
</template>
