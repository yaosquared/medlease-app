<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { TOrganization } from '@/types/organization'

const props = defineProps<{
  open: boolean
  loading: boolean
  organization: TOrganization | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', payload: typeof form): void
}>()

const form = reactive({
  name: '',
  email: '',
  address: '',
  contactNumber: '',
})

watch(
  () => [props.open, props.organization],
  () => {
    if (props.open && props.organization) {
      form.name = props.organization.name ?? ''
      form.email = props.organization.email ?? ''
      form.address = props.organization.address ?? ''
      form.contactNumber = props.organization.contactNumber ?? ''
    }
  },
)

const close = () => emit('update:open', false)

const onSave = () => {
  emit('save', { ...form })
}
</script>

<template>
  <UModal :open="open" @update:open="emit('update:open', $event)" title="Edit Organization">
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Name">
          <UInput v-model="form.name" class="w-full" />
        </UFormField>
        <UFormField label="Email">
          <UInput v-model="form.email" type="email" class="w-full" />
        </UFormField>
        <UFormField label="Address">
          <UInput v-model="form.address" class="w-full" />
        </UFormField>
        <UFormField label="Contact Number">
          <UInput v-model="form.contactNumber" class="w-full" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="ghost" :disabled="loading" @click="close">
          Cancel
        </UButton>
        <UButton color="primary" :loading="loading" @click="onSave"> Save changes </UButton>
      </div>
    </template>
  </UModal>
</template>
