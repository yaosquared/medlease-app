<script setup lang="ts">
import type { TRoleOption } from '@/types/users'

defineProps<{
  loading: boolean
  roleOptions: TRoleOption[]
}>()

const emit = defineEmits<{
  (e: 'save', value: { contactNumber: string; role: number }): void
}>()

const open = defineModel<boolean>('open')

const form = defineModel<{
  contactNumber: string
  role: number
}>('form', {
  default: () => ({
    contactNumber: '',
    role: 2,
  }),
})

function save() {
  emit('save', {
    contactNumber: form.value.contactNumber,
    role: form.value.role,
  })
}
</script>

<template>
  <UModal v-model:open="open" title="Edit User">
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="User Contact Number">
          <UInput v-model="form.contactNumber" class="w-full" />
        </UFormField>

        <UFormField label="Role">
          <USelect v-model="form.role" :items="roleOptions" value-key="value" class="w-full" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="w-full flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          :disabled="loading"
          @click="open = false"
          class="cursor-pointer"
        >
          Cancel
        </UButton>
        <UButton color="primary" :loading="loading" @click="save" class="cursor-pointer">
          Save changes
        </UButton>
      </div>
    </template>
  </UModal>
</template>
