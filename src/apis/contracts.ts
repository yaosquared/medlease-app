import api from '@/utils/axios'
import type { TContractPayload } from '@/types/contract'

export const getContracts = async ({
  pageParam = 1,
  limit = 10,
  status,
}: {
  pageParam: number
  limit?: number
  status?: number
}) => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/api/admin/contracts`, {
    params: { page: pageParam, limit, status },
  })
  return res.data
}

export const createContract = async (payload: TContractPayload) => {
  const res = await api.post(`${import.meta.env.VITE_API_URL}/api/admin/contracts`, payload)
  return res.data
}

export const getContractById = async (contractId: string) => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/api/admin/contracts/${contractId}`)
  return res.data
}

export const getContractHistory = async (contractId: string) => {
  const res = await api.get(
    `${import.meta.env.VITE_API_URL}/api/admin/contracts/${contractId}/history`,
  )
  return res.data
}

export const approveContract = async (contractId: string) => {
  const res = await api.patch(
    `${import.meta.env.VITE_API_URL}/api/admin/contracts/${contractId}/approve`,
  )
  return res.data
}

export const cancelContract = async (contractId: string) => {
  const res = await api.patch(
    `${import.meta.env.VITE_API_URL}/api/admin/contracts/${contractId}/cancel`,
  )
  return res.data
}

export const completeContract = async (contractId: string) => {
  const res = await api.patch(
    `${import.meta.env.VITE_API_URL}/api/admin/contracts/${contractId}/complete`,
  )
  return res.data
}
