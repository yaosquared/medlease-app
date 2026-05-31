export type TProfileResponse = {
  id: string
  fullName: string
  username: string
  email: string
  contactNumber: string
  role: number
  organizationId: string | null
  organizationName: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}
