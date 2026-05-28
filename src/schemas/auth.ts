import * as z from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

const phMobileRegex = /^(\+63|0)9\d{9}$/

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2)
      .max(100)
      .regex(/^[a-zA-Z\s.\-]+$/, 'Full name contains invalid characters'),
    username: z
      .string()
      .min(3)
      .max(50)
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, underscore'),
    email: z.string().email('Invalid email').max(100),
    contactNumber: z
      .string()
      .min(10)
      .max(20)
      .regex(phMobileRegex, 'Invalid Philippine mobile number'),
    password: z
      .string()
      .min(8)
      .max(100)
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).+$/,
        'Password must contain at least one letter and one number',
      ),
    confirmPassword: z.string(),
    orgName: z.string().min(1, 'Organization name is required').max(150),
    orgType: z.number({ error: 'Organization type is required' }).nullable(),
    address: z.string().max(250).optional(),
    orgEmail: z.string().email('Invalid organization email').max(100),
    orgContactNumber: z
      .string()
      .max(20)
      .regex(phMobileRegex, 'Invalid organization contact number')
      .optional()
      .or(z.literal('')),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
