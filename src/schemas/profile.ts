import { z } from 'zod'

export const editProfileSchema = z.object({
  image: z.instanceof(File).optional(),
  fullName: z.string().min(1, 'Full name is required'),
  username: z.string().min(1, 'Username is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type TEditProfileSchema = z.infer<typeof editProfileSchema>
export type TChangePasswordSchema = z.infer<typeof changePasswordSchema>
