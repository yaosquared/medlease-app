import api from '@/utils/axios'
import type { TAddPenaltySchema, TCreatePaymentSchema } from '@/schemas/payment'

export const getPayments = async ({
  pageParam = 1,
  limit = 10,
  status,
  search,
}: {
  pageParam: number
  limit?: number
  status?: number
  search?: string
}) => {
  const res = await api.get(`/api/admin/payments`, {
    params: { page: pageParam, limit, status, search },
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

export const addPenalty = async (paymentId: string, payload: TAddPenaltySchema) => {
  const res = await api.patch(`/api/admin/payments/${paymentId}/add-penalty`, payload)
  return res.data
}
