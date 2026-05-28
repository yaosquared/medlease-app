export type TApiErrorResponse = {
  success: boolean
  message: string
  errors?: {
    field: string
    messages: string[]
  }[]
}