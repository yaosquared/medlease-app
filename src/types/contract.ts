export type TContract = {
  id: string
  contractNumber: string
  startDate: string
  endDate: string
  monthlyPayment: number
  status: number
  notes?: string
  signedAt?: string
  createdAt: string
  updatedAt?: string
  equipmentId: string
  lessorOrganizationId: string
  lesseeOrganizationId: string
  approvedByUserId?: string
  hasPendingPayment: boolean
}

export type TContractPayload = {
  equipmentId: string
  startDate: Date
  endDate: Date
  notes?: string
}

export type TContractSelectOption = {
  label: string
  value: string
}
