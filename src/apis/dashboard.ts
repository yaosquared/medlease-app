import api from '@/utils/axios'

export const getDashboardStats = async () => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/api/super-admin/dashboard`)
  return res.data
}

export const getAdminDashboardStats = async () => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/api/admin/dashboard`)
  return res.data
}