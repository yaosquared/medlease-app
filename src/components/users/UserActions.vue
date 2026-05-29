<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMutation, useQueryCache } from '@pinia/colada'
import type { AxiosError } from 'axios'

import { deactivateUser, deactivateOwnOrgUser, updateOwnOrgUser } from '@/apis/users'
import { useAuthStore } from '@/stores/auth'
import { ROLE_INPUT_OPTIONS } from '@/constants/users.ts'
import type { TApiErrorResponse } from '@/types/api'
import EditUserModal from './EditUserModal.vue'

const props = defineProps<{
  id: string
  contactNumber?: string
  role?: number
}>()

const { user } = storeToRefs(useAuthStore())
const toast = useToast()
const queryCache = useQueryCache()

const showEditModal = ref(false)
const showDeactivateModal = ref(false)

const editForm = ref({
  contactNumber: props.contactNumber ?? '',
  role: props.role ?? 2,
})

const isOrgAdmin = computed(() => user.value?.role === 'OrgAdmin')
const isDeactivating = computed(() => deactivateStatus.value === 'loading')
const isUpdating = computed(() => updateStatus.value === 'loading')

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

const { mutate: update, asyncStatus: updateStatus } = useMutation({
  mutation: (payload: typeof editForm.value) => updateOwnOrgUser(props.id, payload),
  onSuccess: () => {
    showEditModal.value = false
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
      key: [isOrgAdmin.value ? 'admin' : 'super-admin', 'user', props.id],
    }),
})

const handleUpdate = (payload: typeof editForm.value) => {
  update(payload)
}
</script>

<template>
  <div class="flex justify-end gap-2">
    <UButton
      v-if="isOrgAdmin"
      size="sm"
      color="neutral"
      variant="outline"
      icon="i-lucide-pencil"
      class="cursor-pointer"
      @click="showEditModal = true"
    >
      Edit
    </UButton>
    <UButton
      size="sm"
      color="error"
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
    :loading="isUpdating"
    :role-options="ROLE_INPUT_OPTIONS"
    @save="handleUpdate"
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
