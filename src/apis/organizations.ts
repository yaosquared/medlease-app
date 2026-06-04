import api from '@/utils/axios'
import type { TUpdateOwnOrganizationRequest } from '@/types/organization'

export const getOrganizations = async ({
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
  const res = await api.get(`/api/super-admin/organizations`, {
    params: { page: pageParam, limit, status, search },
  })
  return res.data
}

export const getOrganizationById = async (orgId: string) => {
  const res = await api.get(`/api/super-admin/organizations/${orgId}`)
  return res.data
}

export const approveOrganization = async (orgId: string) => {
  const res = await api.patch(`/api/super-admin/organizations/${orgId}/approve`)
  return res.data
}

export const rejectOrganization = async (orgId: string) => {
  const res = await api.patch(`/api/super-admin/organizations/${orgId}/reject`)
  return res.data
}

export const getOwnOrganization = async () => {
  const res = await api.get(`/api/admin/organizations/me`)
  return res.data
}

export const updateOwnOrganization = async (payload: TUpdateOwnOrganizationRequest) => {
  const res = await api.put(`/api/admin/organizations/me`, payload)
  return res.data
}
