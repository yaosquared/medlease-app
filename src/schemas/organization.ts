import { z } from 'zod'

export const updateOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Must be a valid email'),
  address: z.string().min(1, 'Address is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
})

export type TUpdateOrganizationSchema = z.infer<typeof updateOrganizationSchema>
