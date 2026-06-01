import api from '@/utils/axios'
import type { TChangePasswordSchema, TEditProfileSchema } from '@/schemas/profile'

export const getProfile = async () => {
  const res = await api.get(`/api/profile`)
  return res.data
}

export const updateProfile = async (payload: TEditProfileSchema) => {
  const res = await api.put(`/api/profile`, payload)
  return res.data
}

export const changePassword = async (payload: TChangePasswordSchema) => {
  const res = await api.patch(`/api/profile/change-password`, payload)
  return res.data
}
