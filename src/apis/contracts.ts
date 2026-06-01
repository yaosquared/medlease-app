import api from '@/utils/axios'
import type { TContractPayload } from '@/types/contract'

export const getContracts = async (params: {
  pageParam: number
  limit?: number
  statuses?: number[]
  excludePending?: boolean
}) => {
  const query = new URLSearchParams()
  query.append('page', String(params.pageParam))
  if (params.limit) query.append('limit', String(params.limit))
  params.statuses?.forEach((s) => query.append('statuses', String(s)))
  if (params.excludePending) query.append('excludePending', 'true')

  const res = await api.get(`/api/admin/contracts?${query.toString()}`)
  return res.data
}

export const createContract = async (payload: TContractPayload) => {
  const res = await api.post(`/api/admin/contracts`, payload)
  return res.data
}

export const getContractById = async (contractId: string) => {
  const res = await api.get(`/api/admin/contracts/${contractId}`)
  return res.data
}

export const getContractHistory = async (contractId: string) => {
  const res = await api.get(`/api/admin/contracts/${contractId}/history`)
  return res.data
}

export const approveContract = async (contractId: string) => {
  const res = await api.patch(`/api/admin/contracts/${contractId}/approve`)
  return res.data
}

export const cancelContract = async (contractId: string) => {
  const res = await api.patch(`/api/admin/contracts/${contractId}/cancel`)
  return res.data
}

export const completeContract = async (contractId: string) => {
  const res = await api.patch(`/api/admin/contracts/${contractId}/complete`)
  return res.data
}
