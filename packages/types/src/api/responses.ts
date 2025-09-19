export interface ApiResponse<T = any> {
  statusCode: number
  message: string
  data: T
  timestamp: string
}

export interface ErrorResponse {
  statusCode: number
  message: string
  error?: string
  timestamp: string
  path: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SuccessResponse {
  message: string
  success: boolean
}