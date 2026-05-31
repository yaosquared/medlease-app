<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'
import avatar from '@/assets/avatar.png'
import ChangePasswordModal from '@/components/profile/ChangePasswordModal.vue'

const { profile } = storeToRefs(useProfileStore())
const { isClinic, isVendor } = storeToRefs(useAuthStore())

const showEditProfileModal = ref(false)
const showChangePasswordModal = ref(false)

const ROLE_LABELS: { value: number; label: string }[] = [
  { value: 0, label: 'Super Admin' },
  { value: 1, label: 'Org Admin' },
  { value: 2, label: 'Staff' },
  { value: 3, label: 'Viewer' },
]
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <UAvatar :src="avatar" size="xl" />
          <div>
            <h2 class="text-lg font-semibold">{{ profile?.fullName }}</h2>
            <UBadge
              :label="ROLE_LABELS.find((r) => r.value === profile?.role)?.label ?? 'Unknown'"
              variant="subtle"
              color="primary"
            />
          </div>
        </div>
      </div>
    </template>
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p class="text-dimmed">Username</p>
        <p class="font-medium">{{ profile?.username }}</p>
      </div>
      <div>
        <p class="text-dimmed">Email</p>
        <p class="font-medium">{{ profile?.email }}</p>
      </div>
      <div>
        <p class="text-dimmed">Contact Number</p>
        <p class="font-medium">{{ profile?.contactNumber }}</p>
      </div>
      <div>
        <p class="text-dimmed">Member Since</p>
        <p class="font-medium">{{ profile?.createdAt }}</p>
      </div>
      <div>
        <p class="text-dimmed">Organization</p>
        <p class="font-medium">{{ profile?.organizationName }}</p>
      </div>
      <div v-if="isClinic || isVendor">
        <p class="text-dimmed">Organization Type</p>
        <p class="font-medium">{{ isClinic ? 'Clinic' : 'Vendor' }}</p>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          size="sm"
          color="neutral"
          variant="subtle"
          icon="i-lucide-lock"
          class="cursor-pointer"
          @click="showChangePasswordModal = true"
        >
          Change password
        </UButton>
        <UButton
          size="sm"
          color="neutral"
          icon="i-lucide-pencil"
          class="cursor-pointer"
          @click="showEditProfileModal = true"
        >
          Edit
        </UButton>
      </div>
    </template>
  </UCard>
  <EditProfileModal v-model:open="showEditProfileModal" />
  <ChangePasswordModal v-model:open="showChangePasswordModal" />
</template>
