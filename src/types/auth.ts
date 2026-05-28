import type { z } from 'zod'

import type { loginSchema, registerSchema } from '@/schemas/auth'
import type { tabMap } from '@/constants/auth'

export type TLoginSchema = z.output<typeof loginSchema>
export type TRegisterSchema = z.output<typeof registerSchema>
export type TTabSlug = (typeof tabMap)[number]

export interface IJwtPayload {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string
  orgId: string
  orgType: string
  exp: number
}
