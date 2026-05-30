import { z } from 'zod'

export const createUserSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Must be a valid email'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.number(),
})

export const updateUserSchema = z.object({
  contactNumber: z.string().min(1, 'Contact number is required'),
  role: z.number(),
})

export type TCreateUserSchema = z.infer<typeof createUserSchema>
export type TUpdateUserSchema = z.infer<typeof updateUserSchema>
