export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface LoginResponse {
  token: string
  user: User
  expiresIn: number
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  avatar?: string
  role: UserRole
  isActive: boolean
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}