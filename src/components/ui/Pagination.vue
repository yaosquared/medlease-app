<script setup lang="ts">
defineProps<{
  total: number
  itemsPerPage: number
}>()

const page = defineModel<number>('page')
</script>

<template>
  <div class="flex justify-center">
    <UPagination
      v-model:page="page"
      :total="total"
      :items-per-page="itemsPerPage"
      :sibling-count="1"
      show-edges
    />
  </div>
</template>
