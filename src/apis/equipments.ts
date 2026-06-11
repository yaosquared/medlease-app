import api from '@/utils/axios'
import type { TEquipmentPayload } from '@/types/equipments'
import type { TCreateEquipmentSchema, TUpdateEquipmentSchema } from '@/schemas/equipment'

export const getEquipments = async ({
  pageParam = 1,
  limit = 10,
  status,
  search,
}: {
  pageParam: number
  limit?: number
  status?: number
  search?: string
}) => {
  const res = await api.get(`/api/admin/equipments`, {
    params: { page: pageParam, limit, status, search },
  })
  return res.data
}

export const createEquipment = (payload: TCreateEquipmentSchema) => {
  const formData = new FormData()

  if (payload.image) {
    formData.append('image', payload.image)
  }

  formData.append('name', payload.name)
  formData.append('brand', payload.brand)
  formData.append('model', payload.model)
  formData.append('serialNumber', payload.serialNumber)
  formData.append('description', payload.description ?? '')
  formData.append('monthlyRate', payload.monthlyRate.toString())
  formData.append('condition', payload.condition.toString())

  return api.post('/api/admin/equipments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const getEquipmentById = async (equipmentId: string) => {
  const res = await api.get(`/api/admin/equipments/${equipmentId}`)
  return res.data
}

export const updateEquipment = async (equipmentId: string, payload: TUpdateEquipmentSchema) => {
  const formData = new FormData()

  if (payload.image) {
    formData.append('image', payload.image)
  }

  formData.append('description', payload.description ?? '')
  formData.append('monthlyRate', payload.monthlyRate.toString())
  formData.append('condition', payload.condition.toString())
  formData.append('status', payload.status.toString())

  const res = await api.put(`/api/admin/equipments/${equipmentId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const deleteEquipment = async (equipmentId: string) => {
  const res = await api.delete(`/api/admin/equipments/${equipmentId}`)
  return res.data
}
