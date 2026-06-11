import { z } from 'zod'

export const createEquipmentSchema = z.object({
  image: z.instanceof(File, { message: 'Image is required' }),
  name: z.string().min(1, 'Name is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  serialNumber: z.string().min(1, 'Serial number is required'),
  description: z.string().optional(),
  monthlyRate: z.number({ error: 'Must be a number' }).min(0.01, 'Rate must be greater than 0'),
  condition: z.number(),
})

export const updateEquipmentSchema = z.object({
  image: z.instanceof(File).optional(),
  imageUrl: z.string().url('Must be a valid URL'),
  description: z.string().optional(),
  monthlyRate: z.number({ error: 'Must be a number' }).min(0.01, 'Rate must be greater than 0'),
  condition: z.number(),
  status: z.number(),
})

export type TCreateEquipmentSchema = z.infer<typeof createEquipmentSchema>
export type TCreateEquipmentForm = Omit<TCreateEquipmentSchema, 'image'> & {
  image: File | undefined
}
export type TUpdateEquipmentSchema = z.infer<typeof updateEquipmentSchema>
