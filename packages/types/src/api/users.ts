export interface CreateUserRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
  role?: string
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  avatar?: string
}

export interface UserProfile {
  id: string
  email: string
  firstName?: string
  lastName?: string
  avatar?: string
  role: string
  isActive: boolean
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface UsersListResponse {
  users: UserProfile[]
  total: number
  page: number
  limit: number
}