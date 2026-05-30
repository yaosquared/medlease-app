import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

import type { IJwtPayload } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))

  const user = computed(() => {
    if (!accessToken.value) return null
    try {
      const decoded = jwtDecode<IJwtPayload>(accessToken.value)
      return {
        id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        orgId: decoded.orgId,
        orgType: decoded.orgType,
      }
    } catch {
      return null
    }
  })

  const isAuthenticated = computed(() => {
    if (!accessToken.value) return false
    try {
      const { exp } = jwtDecode<IJwtPayload>(accessToken.value)
      return Date.now() < exp * 1000
    } catch {
      return false
    }
  })

  const isSuperAdmin = computed(() => user.value?.role === 'SuperAdmin')
  const isOrgAdmin = computed(() => user.value?.role === 'OrgAdmin')
  const isStaff = computed(() => user.value?.role === 'Staff')
  const isViewer = computed(() => user.value?.role === 'Viewer')

  const isClinic = computed(() => user.value?.orgType === 'Clinic')
  const isVendor = computed(() => user.value?.orgType === 'Vendor')

  const setTokens = (access: string, refresh: string) => {
    accessToken.value = access
    refreshToken.value = refresh
    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)
  }

  const clearTokens = () => {
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    isSuperAdmin,
    isOrgAdmin,
    isStaff,
    isViewer,
    isClinic,
    isVendor,
    setTokens,
    clearTokens,
  }
})
