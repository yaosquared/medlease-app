import { z } from 'zod'

export const createPaymentSchema = z.object({
  leaseContractId: z.string().min(1, 'Please select a contract'),
  paymentMethod: z.string().min(1, 'Please select a payment method'),
  remarks: z.string().optional(),
})

export type TCreatePaymentSchema = z.infer<typeof createPaymentSchema>
