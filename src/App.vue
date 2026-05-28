<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AuthLayout from './components/layouts/AuthLayout.vue'
import AppLayout from './components/layouts/AppLayout.vue'

const route = useRoute()

const layout = computed(() => (route.meta.layout === 'auth' ? AuthLayout : AppLayout))
</script>

<template>
  <UApp>
    <component :is="layout">
      <RouterView />
    </component>
  </UApp>
</template>
