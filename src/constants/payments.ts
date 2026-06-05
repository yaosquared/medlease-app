export const PAYMENTS_PER_PAGE = 12

export const PAYMENT_STATUS_OPTIONS = [
  { label: 'All', value: null },
  { label: 'Pending', value: 0 },
  // { label: 'Processing', value: 1 },
  { label: 'Paid', value: 2 },
  // { label: 'Overdue', value: 3 },
]

export const PAYMENT_METHOD_OPTIONS = [
  { label: 'Cash', value: 'Cash' },
  { label: 'Bank Transfer', value: 'Bank Transfer' },
  { label: 'Check', value: 'Check' },
]

export const PENALTY_REASON_OPTIONS = [
  { value: 0, label: 'Late Payment', rate: 5 },
  { value: 1, label: 'Returned Check', rate: 10 },
  { value: 2, label: 'Early Termination', rate: 50 },
  { value: 3, label: 'Equipment Damage', rate: 30 },
  { value: 4, label: 'Unauthorized Equipment Use', rate: 20 },
  { value: 5, label: 'Missing Accessory', rate: 8 },
  { value: 6, label: 'Improper Maintenance', rate: 15 },
  { value: 7, label: 'Equipment Loss', rate: 80 },
  { value: 8, label: 'Overdue Return', rate: 7 },
  { value: 9, label: 'Calibration Damage', rate: 25 },
]
