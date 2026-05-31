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
  const res = await api.get(`/api/admin/payments`, {
    params: { page: pageParam, limit, status },
  })
  return res.data
}

export const createPayment = async (payload: TCreatePaymentSchema) => {
  const res = await api.post(`/api/admin/payments`, payload)
  return res.data
}

export const getPaymentById = async (paymentId: string) => {
  const res = await api.get(`/api/admin/payments/${paymentId}`)
  return res.data
}

export const confirmPayment = async (paymentId: string) => {
  const res = await api.patch(`/api/admin/payments/${paymentId}/confirm`)
  return res.data
}

export const getPenaltyPreview = async (contractId: string) => {
  const res = await api.get(`/api/admin/payments/penalty-preview`, {
    params: { contractId },
  })
  return res.data
}
