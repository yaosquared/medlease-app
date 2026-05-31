export type TOrganization = {
  id: string
  name: string
  type: number
  status: number
  address: string
  contactNumber: string
  totalUsers: number
  totalEquipment: number
  email?: string
}

export type TUpdateOwnOrganizationRequest = {
  name: string
  address: string
  contactNumber: string
  email: string
}
