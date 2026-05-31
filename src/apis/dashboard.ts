import api from '@/utils/axios'

export const getDashboardStats = async () => {
  const res = await api.get(`/api/super-admin/dashboard`)
  return res.data
}

export const getAdminDashboardStats = async () => {
  const res = await api.get(`/api/admin/dashboard`)
  return res.data
}