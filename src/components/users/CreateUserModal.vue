<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMutation, useQueryCache } from '@pinia/colada'
import type { AxiosError } from 'axios'

import { createOwnOrgUser } from '@/apis/users'
import { ROLE_INPUT_OPTIONS } from '@/constants/users'
import type { TApiErrorResponse } from '@/types/api'

const open = defineModel<boolean>('open')

const toast = useToast()
const queryCache = useQueryCache()

const form = ref({
  fullName: '',
  username: '',
  email: '',
  contactNumber: '',
  password: '',
  role: 2,
})

const { mutate: create, asyncStatus } = useMutation({
  mutation: () => createOwnOrgUser(form.value),
  onSuccess: () => {
    open.value = false
    toast.add({ title: 'User created successfully', color: 'success' })
    queryCache.invalidateQueries({ key: ['users'] })
  },
  onError: (err: AxiosError<TApiErrorResponse>) => {
    toast.add({
      title: 'Failed to create user',
      description: err?.response?.data?.message ?? 'Something went wrong.',
      color: 'error',
    })
  },
})

const isLoading = computed(() => asyncStatus.value === 'loading')
</script>

<template>
  <UModal v-model:open="open" title="Add User">
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Full Name">
          <UInput v-model="form.fullName" placeholder="Juan dela Cruz" class="w-full" />
        </UFormField>
        <UFormField label="Username">
          <UInput v-model="form.username" placeholder="juandc" class="w-full" />
        </UFormField>
        <UFormField label="Email">
          <UInput v-model="form.email" type="email" placeholder="juan@email.com" class="w-full" />
        </UFormField>
        <UFormField label="Contact Number">
          <UInput v-model="form.contactNumber" placeholder="+63 912 345 6789" class="w-full" />
        </UFormField>
        <UFormField label="Password">
          <UInput v-model="form.password" type="password" class="w-full" />
        </UFormField>
        <UFormField label="Role">
          <USelect
            v-model="form.role"
            :items="ROLE_INPUT_OPTIONS"
            value-key="value"
            class="w-full"
          />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="w-full flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          :disabled="isLoading"
          class="cursor-pointer"
          @click="open = false"
        >
          Cancel
        </UButton>
        <UButton color="primary" :loading="isLoading" class="cursor-pointer" @click="create()">
          Create
        </UButton>
      </div>
    </template>
  </UModal>
</template>
