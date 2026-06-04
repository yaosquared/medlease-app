<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
}>()

const DEBOUNCE_MS = 500
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const query = computed({
  get: () => props.modelValue ?? '',
  set: (val: string) => {
    emit('update:modelValue', val)
    scheduleDebounced(val)
  },
})

const scheduleDebounced = (val: string) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => emit('search', val), DEBOUNCE_MS)
}

const handleSearch = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  emit('search', query.value)
}

const handleClear = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  emit('update:modelValue', '')
  emit('search', '')
}

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <UInput
    v-model="query"
    class="w-full"
    :placeholder="placeholder ?? 'Search…'"
    icon="i-heroicons-magnifying-glass"
    size="md"
    v-bind="$attrs"
    @keydown.enter="handleSearch"
    @keydown.esc="handleClear"
  >
    <template v-if="query" #trailing>
      <UButton
        variant="link"
        icon="i-heroicons-x-mark-20-solid"
        size="xs"
        :padded="false"
        @click="handleClear"
        class="cursor-pointer"
      />
    </template>
  </UInput>
</template>
