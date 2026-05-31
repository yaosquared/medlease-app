export const EQUIPMENTS_PER_PAGE = 12

export const STATUS_OPTIONS = [
  { label: 'All', value: null },
  { label: 'Available', value: 0 },
  { label: 'Under Review', value: 1 },
  { label: 'Leased', value: 2 },
  { label: 'Under Maintenance', value: 3 },
  { label: 'Retired', value: 4 },
]

export const CONDITION_MAP = [
  { label: 'New', color: 'info' },
  { label: 'Good', color: 'success' },
  { label: 'Fair', color: 'warning' },
  { label: 'Poor', color: 'error' },
] as const

export const STATUS_MAP = [
  { label: 'Available', color: 'success' },
  { label: 'Under Review', color: 'warning' },
  { label: 'Leased', color: 'info' },
  { label: 'Under Maintenance', color: 'warning' },
  { label: 'Retired', color: 'error' },
] as const

export const CONDITION_INPUT_OPTIONS = [
  { label: 'New', value: 0 },
  { label: 'Good', value: 1 },
  { label: 'Fair', value: 2 },
  { label: 'Poor', value: 3 },
]

export const STATUS_INPUT_OPTIONS = [
  { label: 'Available', value: 0 },
  { label: 'Leased', value: 2 },
  { label: 'Under Maintenance', value: 3 },
  { label: 'Retired', value: 4 },
]
