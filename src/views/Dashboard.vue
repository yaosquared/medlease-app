<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth'
import SuperAdminDashboard from '@/components/dashboard/SuperAdminDashboard.vue'
import OrgAdminDashboard from '@/components/dashboard/OrgAdminDashboard.vue'
import StaffDashboard from '@/components/dashboard/StaffDashboard.vue'
import ViewerDashboard from '@/components/dashboard/ViewerDashboard.vue'

const { isSuperAdmin, isOrgAdmin, isStaff, isViewer } = storeToRefs(useAuthStore())
</script>

<template>
  <SuperAdminDashboard v-if="isSuperAdmin" />
  <OrgAdminDashboard v-else-if="isOrgAdmin" />
  <StaffDashboard v-else-if="isStaff" />
  <ViewerDashboard v-else-if="isViewer" />
</template>
