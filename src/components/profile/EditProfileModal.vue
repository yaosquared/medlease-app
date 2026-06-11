<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useMutation } from '@pinia/colada'
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
const { fetchProfile } = useProfileStore()
const { profile } = storeToRefs(useProfileStore())

const hovered = ref(false)

const state = reactive<TEditProfileSchema & { imageUrl: string }>({
  image: undefined,
  imageUrl: '',
  fullName: '',
  username: '',
  contactNumber: '',
})

const previewUrl = computed(() => {
  if (state.image) return URL.createObjectURL(state.image as File)
  return state.imageUrl || null
})

watch(open, (val) => {
  if (val && profile.value) {
    state.image = undefined
    state.imageUrl =
      profile.value.imageUrl ??
      'https://res.cloudinary.com/dybrrnkfo/image/upload/v1781182376/avatar_nfzgcd.png'
    state.fullName = profile.value.fullName
    state.username = profile.value.username
    state.contactNumber = profile.value.contactNumber
  }
})

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) state.image = file
}

const { mutate, asyncStatus, error } = useMutation({
  mutation: (payload: TEditProfileSchema) => updateProfile(payload),
  onSuccess: () => {
    open.value = false
    toast.add({ title: 'Profile updated successfully', color: 'success' })
    fetchProfile()
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
        <UFormField name="image">
          <div class="flex justify-center">
            <label
              class="relative w-24 h-24 rounded-full cursor-pointer block"
              @mouseenter="hovered = true"
              @mouseleave="hovered = false"
            >
              <img
                v-if="previewUrl"
                :src="previewUrl"
                alt="Profile image"
                class="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              <div
                v-else
                class="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-400"
              >
                <UIcon name="i-lucide-user" class="w-10 h-10" />
              </div>
              <div
                class="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center transition-opacity"
                :class="hovered ? 'opacity-100' : 'opacity-0'"
              >
                <UIcon name="i-lucide-camera" class="w-5 h-5 text-white" />
                <span class="text-white text-xs mt-1">Change</span>
              </div>
              <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
            </label>
          </div>
        </UFormField>
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
