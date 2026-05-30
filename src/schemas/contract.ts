import { z } from 'zod'

export const createContractSchema = z.object({
  equipmentId: z.string().uuid('Invalid equipment ID'),
  startDate: z.coerce.date({ error: 'Start date is required' }),
  endDate: z.coerce.date({ error: 'End date is required' }),
  notes: z.string().optional(),
})

export type TCreateContractSchema = z.infer<typeof createContractSchema>
