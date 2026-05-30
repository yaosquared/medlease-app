import api from '@/utils/axios'

export const getPayments = async ({
  pageParam = 1,
  limit = 10,
}: {
  pageParam: number
  limit?: number
}) => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/api/admin/payments`, {
    params: { page: pageParam, limit },
  })
  return res.data
}

// TODO: POST post/api/admin/payments

// TODO: GET get/api/admin/payments/{paymentId}

// TODO: PATCH patch/api/admin/payments/{paymentId}/confirm
