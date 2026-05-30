<script setup lang="ts">
import type { TButtonColor } from '@/types/ui'

const model = defineModel<boolean>('open')

defineProps<{
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmColor?: TButtonColor
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
}>()
</script>

<template>
  <UModal v-model:open="model" :title="title">
    <template #body>
      <p class="text-sm text-muted">
        {{ message }}
      </p>
    </template>
    <template #footer>
      <div class="w-full flex justify-end gap-2">
        <UButton color="neutral" variant="ghost" class="cursor-pointer" @click="model = false">
          {{ cancelText ?? 'Cancel' }}
        </UButton>
        <UButton
          :color="confirmColor ?? 'primary'"
          :loading="loading"
          class="cursor-pointer"
          @click="emit('confirm')"
        >
          {{ confirmText ?? 'Confirm' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
