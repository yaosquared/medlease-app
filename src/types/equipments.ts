export type TEquipment = {
  imageUrl: string
  name: string
  brand: string
  model: string
  serialNumber: string
  description: string
  monthlyRate: number
  condition: number
  status: number
}

export interface TEquipmentPayload {
  imageUrl?: string
  name?: string
  brand?: string
  model?: string
  serialNumber?: string
  description?: string
  monthlyRate?: number
  condition?: number
  status?: number
}
