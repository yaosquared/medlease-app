<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen gap-4">
    <p class="text-6xl font-bold">404</p>
    <p class="text-xl text-gray-400">Page not found.</p>
    <UButton @click="router.push('/dashboard')" class="cursor-pointer">Go to Dashboard</UButton>
  </div>
</template>
