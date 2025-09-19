export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterParams {
  search?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: T | null
  status: Status
  error: string | null
}