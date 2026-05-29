export type TUser = {
  id: string
  fullName: string
  username: string
  email: string
  contactNumber: string
  role: number
  isActive: boolean
  organizationId: string | null
  organization: {
    id: string
    name: string
    type: number
  } | null
  createdAt: string
  updatedAt: string
}


export type TRoleOption = {
  label: string
  value: number
}