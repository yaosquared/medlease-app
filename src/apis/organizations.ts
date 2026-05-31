import type { TUpdateOwnOrganizationRequest } from '@/types/organization'
import api from '@/utils/axios'

export const getOrganizations = async ({
  pageParam = 1,
  limit = 10,
  status,
}: {
  pageParam: number
  limit?: number
  status?: number
}) => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/api/super-admin/organizations`, {
    params: { page: pageParam, limit, status },
  })
  return res.data
}

export const getOrganizationById = async (orgId: string) => {
  const res = await api.get(
    `${import.meta.env.VITE_API_URL}/api/super-admin/organizations/${orgId}`,
  )
  return res.data
}

export const approveOrganization = async (orgId: string) => {
  const res = await api.patch(
    `${import.meta.env.VITE_API_URL}/api/super-admin/organizations/${orgId}/approve`,
  )
  return res.data
}

export const rejectOrganization = async (orgId: string) => {
  const res = await api.patch(
    `${import.meta.env.VITE_API_URL}/api/super-admin/organizations/${orgId}/reject`,
  )
  return res.data
}

export const getOwnOrganization = async () => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/api/admin/organizations/me`)
  return res.data
}

export const updateOwnOrganization = async (payload: TUpdateOwnOrganizationRequest) => {
  const res = await api.put(`${import.meta.env.VITE_API_URL}/api/admin/organizations/me`, payload)
  return res.data
}
