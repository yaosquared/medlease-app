<script setup lang="ts">
import { ref } from 'vue'
import { useMutation, useQueryCache } from '@pinia/colada'
import type { AxiosError } from 'axios'

import { approveOrganization, rejectOrganization } from '@/apis/organizations'
import type { TApiErrorResponse } from '@/types/api'

const props = defineProps<{ id: string }>()

const toast = useToast()
const queryCache = useQueryCache()

const showApproveModal = ref(false)
const showRejectModal = ref(false)

const { mutate: approve, isLoading: isApproving } = useMutation({
  mutation: () => approveOrganization(props.id),
  onSuccess: () => {
    showApproveModal.value = false
    toast.add({ title: 'Organization approved', color: 'success' })
  },
  onError: (err: AxiosError<TApiErrorResponse>) => {
    toast.add({
      title: 'Approval failed',
      description: err?.response?.data?.message ?? 'Something went wrong.',
      color: 'error',
    })
  },
  onSettled: () => queryCache.invalidateQueries({ key: ['organization'] }),
})

const { mutate: reject, isLoading: isRejecting } = useMutation({
  mutation: () => rejectOrganization(props.id),
  onSuccess: () => {
    showRejectModal.value = false
    toast.add({ title: 'Organization rejected', color: 'success' })
  },
  onError: (err: AxiosError<TApiErrorResponse>) => {
    toast.add({
      title: 'Rejection failed',
      description: err?.response?.data?.message ?? 'Something went wrong.',
      color: 'error',
    })
  },
  onSettled: () => queryCache.invalidateQueries({ key: ['organization'] }),
})
</script>

<template>
  <div class="flex justify-end gap-2">
    <UButton
      size="sm"
      color="success"
      :loading="isApproving"
      :disabled="isApproving || isRejecting"
      @click="showApproveModal = true"
      class="cursor-pointer"
    >
      Approve
    </UButton>
    <ConfirmationModal
      v-model:open="showApproveModal"
      title="Approve Organization"
      message="Are you sure you want to approve this organization? This will activate their OrgAdmin account."
      confirm-text="Approve"
      confirm-color="success"
      :loading="isApproving"
      @confirm="approve"
    />
    <UButton
      size="sm"
      color="error"
      :loading="isRejecting"
      :disabled="isApproving || isRejecting"
      @click="showRejectModal = true"
      class="cursor-pointer"
    >
      Reject
    </UButton>
    <ConfirmationModal
      v-model:open="showRejectModal"
      title="Reject Organization"
      message="Are you sure you want to reject this organization? This action cannot be undone."
      confirm-text="Reject"
      confirm-color="error"
      :loading="isRejecting"
      @confirm="reject"
    />
  </div>
</template>
