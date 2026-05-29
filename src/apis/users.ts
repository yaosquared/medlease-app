import api from '@/utils/axios'

export const getUsers = async ({
  pageParam = 1,
  limit = 10,
  role,
}: {
  pageParam: number
  limit?: number
  role?: number
}) => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/api/super-admin/users`, {
    params: { page: pageParam, limit, role },
  })
  return res.data
}

export const getOwnUsers = async ({
  pageParam = 1,
  limit = 10,
  role,
}: {
  pageParam: number
  limit?: number
  role?: number
}) => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
    params: { page: pageParam, limit, role },
  })
  return res.data
}

export const getUserById = async (userId: string) => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/api/super-admin/users/${userId}`)
  return res.data
}

export const getOwnOrgUserById = async (userId: string) => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`)
  return res.data
}

export const deactivateUser = async (orgId: string) => {
  const res = await api.patch(
    `${import.meta.env.VITE_API_URL}/api/super-admin/users/${orgId}/deactivate`,
  )
  return res.data
}

export const createOwnOrgUser = async (payload: {
  fullName: string
  username: string
  email: string
  contactNumber: string
  password: string
  role: number
}) => {
  const res = await api.post(`${import.meta.env.VITE_API_URL}/api/admin/users`, payload)
  return res.data
}

export const updateOwnOrgUser = async (
  userId: string,
  payload: { contactNumber: string; role: number },
) => {
  const res = await api.put(
    `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`,
    payload,
  )
  return res.data
}

export const deactivateOwnOrgUser = async (userId: string) => {
  const res = await api.patch(
    `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/deactivate`,
  )
  return res.data
}