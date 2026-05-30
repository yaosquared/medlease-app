<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth'
import SuperAdminDashboard from '@/components/dashboard/SuperAdminDashboard.vue'
import OrgAdminDashboard from '@/components/dashboard/OrgAdminDashboard.vue'

const { isSuperAdmin } = storeToRefs(useAuthStore())
</script>

<template>
  <SuperAdminDashboard v-if="isSuperAdmin" />
  <OrgAdminDashboard v-else />
</template>
