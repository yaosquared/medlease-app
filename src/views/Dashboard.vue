<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth'
import SuperAdminDashboard from '@/components/dashboard/SuperAdminDashboard.vue'
import OrgAdminDashboard from '@/components/dashboard/OrgAdminDashboard.vue'

const { user } = storeToRefs(useAuthStore())
const isOrgAdmin = computed(() => user.value?.role === 'OrgAdmin')
</script>

<template>
  <OrgAdminDashboard v-if="isOrgAdmin" />
  <SuperAdminDashboard v-else />
</template>
