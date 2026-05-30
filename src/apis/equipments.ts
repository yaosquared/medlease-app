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
  const res = await api.get(`${import.meta.env.VITE_API_URL}/api/admin/equipments`, {
    params: { page: pageParam, limit, status },
  })
  return res.data
}

export const createEquipment = async (payload: TEquipmentPayload) => {
  const res = await api.post(`${import.meta.env.VITE_API_URL}/api/admin/equipments`, payload)
  return res.data
}

export const getEquipmentById = async (equipmentId: string) => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/api/admin/equipments/${equipmentId}`)
  return res.data
}

export const updateEquipment = async (equipmentId: string, payload: TEquipmentPayload) => {
  const res = await api.put(
    `${import.meta.env.VITE_API_URL}/api/admin/equipments/${equipmentId}`,
    payload,
  )
  return res.data
}

// TODO: DEL delete/api/admin/equipments/{equipId}

// TODO: PATCH patch/api/admin/equipments/{equipId}/status
