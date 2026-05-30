<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  messages: string[] | null
}>()

const title = computed(() =>
  props.messages && props.messages.length > 1 ? 'Errors occurred' : 'An error occurred',
)
</script>

<template>
  <UAlert
    v-if="messages"
    color="error"
    variant="subtle"
    icon="i-lucide-circle-alert"
    :title="title"
  >
    <template #description>
      <ul class="list-disc list-inside">
        <li v-for="msg in messages" :key="msg">{{ msg }}</li>
      </ul>
    </template>
  </UAlert>
</template>
