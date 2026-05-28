<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import RegisterForm from '@/components/auth/RegisterForm.vue'
import { tabMap, tabNav } from '@/constants/auth'
import type { TTabSlug } from '@/types/auth'

const route = useRoute()
const router = useRouter()

const selectedTab = ref<TTabSlug>(
  tabMap.includes(route.path.slice(1) as TTabSlug) ? (route.path.slice(1) as TTabSlug) : 'login',
)

watch(
  () => route.path,
  (path) => {
    const slug = path.slice(1) as TTabSlug
    if (tabMap.includes(slug)) selectedTab.value = slug
  },
  { immediate: true },
)

watch(selectedTab, (slug) => {
  if (route.path.slice(1) !== slug) router.push(`/${slug}`)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="min-w-sm lg:min-w-md max-w-md">
      <UTabs :items="tabNav" v-model="selectedTab">
        <template #content>
          <div class="mt-6">
            <LoginForm v-if="selectedTab === 'login'" />
            <RegisterForm v-else-if="selectedTab === 'register'" />
          </div>
        </template>
      </UTabs>
    </UPageCard>
  </div>
</template>
