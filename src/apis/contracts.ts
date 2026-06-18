import api from '@/utils/axios'
import type { TContractPayload } from '@/types/contract'

export const getContracts = async (params: {
  pageParam: number
  limit?: number
  statuses?: number[]
  excludePending?: boolean
  search?: string
  isSuperAdmin?: boolean
}) => {
  const query = new URLSearchParams()
  query.append('page', String(params.pageParam))
  if (params.limit) query.append('limit', String(params.limit))
  params.statuses?.forEach((s) => query.append('statuses', String(s)))
  if (params.excludePending) query.append('excludePending', 'true')
  if (params.search) query.append('search', params.search)

  const baseUrl = params.isSuperAdmin ? `/api/super-admin/contracts` : `/api/admin/contracts`

  const res = await api.get(`${baseUrl}?${query.toString()}`)
  return res.data
}

export const createContract = async (payload: TContractPayload) => {
  const res = await api.post(`/api/admin/contracts`, payload)
  return res.data
}

export const getContractById = async (contractId: string, isSuperAdmin?: boolean) => {
  const baseUrl = isSuperAdmin ? `/api/super-admin/contracts` : `/api/admin/contracts`

  const res = await api.get(`${baseUrl}/${contractId}`)
  return res.data
}

export const getContractHistory = async (contractId: string, isSuperAdmin?: boolean) => {
  const baseUrl = isSuperAdmin ? `/api/super-admin/contracts` : `/api/admin/contracts`

  const res = await api.get(`${baseUrl}/${contractId}/history`)
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
