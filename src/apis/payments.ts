import api from '@/utils/axios'

import type { TCreatePaymentSchema } from '@/schemas/payment'

export const getPayments = async ({
  pageParam = 1,
  limit = 10,
  status,
}: {
  pageParam: number
  limit?: number
  status?: number
}) => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/api/admin/payments`, {
    params: { page: pageParam, limit, status },
  })
  return res.data
}

// TODO: POST post/api/admin/payments
export const createPayment = async (payload: TCreatePaymentSchema) => {
  const res = await api.post(`${import.meta.env.VITE_API_URL}/api/admin/payments`, payload)
  return res.data
}

// TODO: GET get/api/admin/payments/{paymentId}
export const getPaymentById = async (paymentId: string) => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/api/admin/payments/${paymentId}`)
  return res.data
}

// TODO: PATCH patch/api/admin/payments/{paymentId}/confirm
export const confirmPayment = async (paymentId: string) => {
  const res = await api.patch(
    `${import.meta.env.VITE_API_URL}/api/admin/payments/${paymentId}/confirm`,
  )
  return res.data
}

export const getPenaltyPreview = async (contractId: string) => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/api/admin/payments/penalty-preview`, {
    params: { contractId },
  })
  return res.data
}
