export interface IProfileResponse {
  id: string
  fullName: string
  username: string
  email: string
  contactNumber: string
  role: number
  organizationId: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}
