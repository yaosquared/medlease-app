import api from '@/utils/axios'

export const getProfile = async () => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/api/profile`)
  return res.data
}
