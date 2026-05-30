<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useColorMode } from '@vueuse/core'
import type { BreadcrumbItem, DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import avatar from '@/assets/avatar.png'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { clearTokens } = authStore

const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)
const { clearProfile } = profileStore

const colorMode = useColorMode()
const open = ref(true)

onMounted(async () => {
  if (user.value) {
    await profileStore.fetchProfile()
  }
})

const navItems = computed<NavigationMenuItem[]>(() => {
  const common: NavigationMenuItem[] = [
    { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/dashboard' },
  ]

  const byRole: Record<string, NavigationMenuItem[]> = {
    SuperAdmin: [
      { label: 'Organizations', icon: 'i-lucide-building-2', to: '/organizations' },
      { label: 'Users', icon: 'i-lucide-users', to: '/users' },
    ],
    OrgAdmin: [
      { label: 'Organization', icon: 'i-lucide-building-2', to: '/organizations/me' },
      { label: 'Users', icon: 'i-lucide-users', to: '/users' },
      { label: 'Equipments', icon: 'i-lucide-monitor', to: '/equipments' },
      { label: 'Contracts', icon: 'i-lucide-file-text', to: '/contracts' },
      { label: 'Payments', icon: 'i-lucide-credit-card', to: '/payments' },
    ],
    Staff: [
      { label: 'Contracts', icon: 'i-lucide-file-text', to: '/contracts' },
      { label: 'Payments', icon: 'i-lucide-credit-card', to: '/payments' },
    ],
    Viewer: [{ label: 'Contracts', icon: 'i-lucide-file-text', to: '/contracts' }],
  }

  const role = user.value?.role ?? ''
  const roleItems = byRole[role] ?? []

  return [...common, ...roleItems]
})

const userDetail = computed(() => ({
  name: profile.value?.fullName || '',
  avatar: {
    src: avatar,
    alt: 'User profile image',
  },
}))

const userItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      onSelect() {
        router.push('/profile')
      },
    },
  ],
  [
    {
      label: 'Appearance',
      icon: 'i-lucide-sun-moon',
      children: [
        {
          label: 'Light',
          icon: 'i-lucide-sun',
          type: 'checkbox',
          checked: colorMode.value === 'light',
          onUpdateChecked(checked: boolean) {
            if (checked) colorMode.value = 'light'
          },
          onSelect(e: Event) {
            e.preventDefault()
          },
        },
        {
          label: 'Dark',
          icon: 'i-lucide-moon',
          type: 'checkbox',
          checked: colorMode.value === 'dark',
          onUpdateChecked(checked: boolean) {
            if (checked) colorMode.value = 'dark'
          },
          onSelect(e: Event) {
            e.preventDefault()
          },
        },
      ],
    },
  ],
  [
    {
      label: 'Log out',
      icon: 'i-lucide-log-out',
      onSelect() {
        clearTokens()
        clearProfile()
        router.push('/login')
      },
    },
  ],
])

const breadcrumbs = computed<BreadcrumbItem[]>(() =>
  route.matched
    .filter((r) => r.meta?.title)
    .map((r, index, arr) => {
      const isLast = index === arr.length - 1
      if (isLast) return { label: r.meta.title as string }

      const resolved = r.name
        ? router.resolve({ name: r.name as string, params: route.params })
        : null

      // NOTE: when in /contracts/{contractId}/history route and {contractId} is clicked, reroute to /contracts
      const to = resolved?.path ?? r.path.replace(/\/:[\w]+/g, '')

      return {
        label: r.meta.title as string,
        to,
      }
    }),
)
</script>

<template>
  <div class="flex flex-1">
    <USidebar
      v-model:open="open"
      collapsible="icon"
      rail
      :ui="{
        container: 'h-full',
        inner: 'bg-elevated/25 divide-y divide-default',
      }"
    >
      <template #header>
        <div>
          <div class="flex items-center gap-2 overflow-hidden">
            <div
              class="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold shrink-0"
            >
              M
            </div>
            <Transition name="fade" mode="out-in">
              <span v-if="open" key="full" class="font-semibold text-lg truncate">MedLease</span>
            </Transition>
          </div>
        </div>
      </template>
      <template #default="{ state }">
        <UNavigationMenu
          :key="state"
          :items="navItems"
          orientation="vertical"
          :ui="{ link: 'px-1.5 py-3 overflow-hidden' }"
        />
      </template>
      <template #footer>
        <UDropdownMenu
          :items="userItems"
          :content="{ align: 'center', collisionPadding: 12 }"
          :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-48' }"
        >
          <UButton
            v-bind="userDetail"
            :label="userDetail?.name"
            trailing-icon="i-lucide-chevrons-up-down"
            color="neutral"
            variant="ghost"
            square
            class="w-full data-[state=open]:bg-elevated overflow-hidden"
            :ui="{
              trailingIcon: 'text-dimmed ms-auto',
            }"
          />
        </UDropdownMenu>
      </template>
    </USidebar>
    <div class="h-screen flex-1 flex flex-col">
      <div class="h-(--ui-header-height) shrink-0 flex items-center px-4 border-b border-default">
        <UButton
          icon="i-lucide-panel-left"
          class="cursor-pointer"
          color="neutral"
          variant="ghost"
          aria-label="Toggle sidebar"
          @click="open = !open"
        />
        <UBreadcrumb :items="breadcrumbs" class="pl-2" />
      </div>
      <div class="flex-1 flex flex-col p-4">
        <slot />
      </div>
    </div>
  </div>
</template>
