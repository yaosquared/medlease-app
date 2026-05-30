import { z } from 'zod'

export const createEquipmentSchema = z.object({
  imageUrl: z.string().url('Must be a valid URL'),
  name: z.string().min(1, 'Name is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  serialNumber: z.string().min(1, 'Serial number is required'),
  description: z.string().optional(),
  monthlyRate: z.number({ error: 'Must be a number' }).min(0.01, 'Rate must be greater than 0'),
  condition: z.number(),
  status: z.number(),
})

export const updateEquipmentSchema = z.object({
  imageUrl: z.string().url('Must be a valid URL'),
  description: z.string().optional(),
  monthlyRate: z.number({ error: 'Must be a number' }).min(0.01, 'Rate must be greater than 0'),
  condition: z.number(),
  status: z.number(),
})

export type TCreateEquipmentSchema = z.infer<typeof createEquipmentSchema>
export type TUpdateEquipmentSchema = z.infer<typeof updateEquipmentSchema>
