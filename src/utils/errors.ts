import type { AxiosError } from 'axios'
import type { TApiErrorResponse } from '@/types/api'

export const getApiErrorMessages = (error: unknown): string[] => {
  const err = error as AxiosError<TApiErrorResponse>
  const data = err?.response?.data
  if (!data) return ['Something went wrong.']

  if (data.errors?.length) {
    return data.errors.flatMap((e) => e.messages)
  }

  return [data.message ?? 'Something went wrong.']
}
