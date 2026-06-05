import { z } from 'zod'

export const createPaymentSchema = z.object({
  leaseContractId: z.string().min(1, 'Please select a contract'),
  paymentMethod: z.string().min(1, 'Please select a payment method'),
  remarks: z.string().optional(),
})

export const addPenaltySchema = z.object({
  penaltyReasons: z.array(z.number()).min(1, 'Select at least one penalty reason'),
  remarks: z.string().optional(),
})

export type TCreatePaymentSchema = z.infer<typeof createPaymentSchema>
export type TAddPenaltySchema = z.infer<typeof addPenaltySchema>
