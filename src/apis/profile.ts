import api from '@/utils/axios'
import type { TChangePasswordSchema, TEditProfileSchema } from '@/schemas/profile'

export const getProfile = async () => {
  const res = await api.get(`/api/profile`)
  return res.data
}

export const updateProfile = async (payload: TEditProfileSchema) => {
  const formData = new FormData()

  if (payload.image) {
    formData.append('image', payload.image)
  }

  formData.append('fullName', payload.fullName ?? '')
  formData.append('username', payload.username.toString())
  formData.append('contactNumber', payload.contactNumber.toString())

  const res = await api.put(`/api/profile`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const changePassword = async (payload: TChangePasswordSchema) => {
  const res = await api.patch(`/api/profile/change-password`, payload)
  return res.data
}
