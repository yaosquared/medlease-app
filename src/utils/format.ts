export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)

export const formatDate = (date: string | null) =>
  date ? new Date(date).toLocaleDateString('en-PH', { dateStyle: 'medium' }) : '—'

export const formatRate = (rate: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(rate)
