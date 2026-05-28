import { ref } from 'vue'
import { defineStore } from 'pinia'

import { getProfile } from '@/apis/profile'
import type { IProfileResponse } from '@/types/profile'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<IProfileResponse | null>(null)

  const fetchProfile = async () => {
    const response = await getProfile()
    profile.value = response.data
  }

  const clearProfile = () => {
    profile.value = null
  }

  return { profile, fetchProfile, clearProfile }
})
