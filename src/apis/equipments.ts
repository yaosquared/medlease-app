import api from '@/utils/axios'
import type { TEquipmentPayload } from '@/types/equipments'

export const getEquipments = async ({
  pageParam = 1,
  limit = 10,
  status,
}: {
  pageParam: number
  limit?: number
  status?: number
}) => {
  const res = await api.get(`/api/admin/equipments`, {
    params: { page: pageParam, limit, status },
  })
  return res.data
}

export const createEquipment = async (payload: TEquipmentPayload) => {
  const res = await api.post(`/api/admin/equipments`, payload)
  return res.data
}

export const getEquipmentById = async (equipmentId: string) => {
  const res = await api.get(`/api/admin/equipments/${equipmentId}`)
  return res.data
}

export const updateEquipment = async (equipmentId: string, payload: TEquipmentPayload) => {
  const res = await api.put(
    `/api/admin/equipments/${equipmentId}`,
    payload,
  )
  return res.data
}

export const deleteEquipment = async (equipmentId: string) => {
  const res = await api.delete(
    `/api/admin/equipments/${equipmentId}`,
  )
  return res.data
}
