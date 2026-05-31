export type TPayment = {
  id: string
  paymentMethod: string
  amount: number
  penaltyAmount: number
  status: number
  dueDate: string
  paidAt: string | null
  transactionReference: string | null
  remarks: string | null
  createdAt: string
  updatedAt: string | null
  leaseContractId: string
  equipmentId?: string | null
  lessorOrganizationId?: string | null
  lesseeOrganizationId?: string | null
}
