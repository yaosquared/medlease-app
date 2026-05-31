import axios from 'axios'

import type { TLoginSchema, TRegisterSchema } from '@/types/auth'

export const login = async (payload: TLoginSchema) => {
  const res = await axios.post(`/api/auth/login`, payload)
  return res.data
}

export const register = async (payload: TRegisterSchema) => {
  const res = await axios.post(`/api/auth/register`, payload)
  return res.data
}
