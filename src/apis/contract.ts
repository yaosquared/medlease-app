import api from '@/utils/axios'

export const getContracts = async ({
  pageParam = 1,
  limit = 10,
}: {
  pageParam: number
  limit?: number
}) => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/api/admin/contracts`, {
    params: { page: pageParam, limit },
  })
  return res.data
}
