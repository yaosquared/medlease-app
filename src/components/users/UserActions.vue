<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMutation, useQueryCache } from '@pinia/colada'
import type { AxiosError } from 'axios'

import { deactivateUser, deactivateOwnOrgUser } from '@/apis/users'
import { useAuthStore } from '@/stores/auth'
import type { TApiErrorResponse } from '@/types/api'
import type { TUpdateUserSchema } from '@/schemas/user'
import EditUserModal from './EditUserModal.vue'

const props = defineProps<{
  id: string
  contactNumber?: string
  role?: number
}>()

const { isOrgAdmin, user } = storeToRefs(useAuthStore())
const toast = useToast()
const queryCache = useQueryCache()

const showEditModal = ref(false)
const showDeactivateModal = ref(false)

const editForm = ref<TUpdateUserSchema>({
  contactNumber: props.contactNumber ?? '',
  role: props.role ?? 2,
})

const isDeactivating = computed(() => deactivateStatus.value === 'loading')

const { mutate: deactivate, asyncStatus: deactivateStatus } = useMutation({
  mutation: () => (isOrgAdmin.value ? deactivateOwnOrgUser(props.id) : deactivateUser(props.id)),
  onSuccess: () => {
    showDeactivateModal.value = false
    toast.add({ title: 'User deactivated successfully', color: 'success' })
  },
  onError: (err: AxiosError<TApiErrorResponse>) => {
    toast.add({
      title: 'Deactivation failed',
      description: err?.response?.data?.message ?? 'Something went wrong.',
      color: 'error',
    })
  },
  onSettled: () =>
    queryCache.invalidateQueries({
      key: [isOrgAdmin.value ? 'admin' : 'super-admin', 'user', props.id],
    }),
})
</script>

<template>
  <div class="flex justify-end gap-2">
    <UButton
      v-if="isOrgAdmin"
      size="sm"
      color="neutral"
      icon="i-lucide-pencil"
      class="cursor-pointer"
      @click="showEditModal = true"
    >
      Edit
    </UButton>
    <UButton
      v-if="user?.id !== id"
      size="sm"
      color="error"
      icon="i-lucide-ban"
      :loading="isDeactivating"
      :disabled="isDeactivating"
      class="cursor-pointer"
      @click="showDeactivateModal = true"
    >
      Deactivate
    </UButton>
  </div>
  <EditUserModal
    v-if="isOrgAdmin"
    v-model:open="showEditModal"
    v-model:form="editForm"
    :user-id="id"
  />
  <ConfirmationModal
    v-model:open="showDeactivateModal"
    title="Deactivate User"
    message="Are you sure you want to deactivate this user? This action cannot be undone."
    confirm-text="Deactivate"
    confirm-color="error"
    :loading="isDeactivating"
    @confirm="deactivate()"
  />
</template>
