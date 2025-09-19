import { api } from './api'
import type { User, LoginRequest, RegisterRequest } from '@repo/types'

export class AuthService {
  static async login(credentials: LoginRequest) {
    const response = await api.post('/auth/login', credentials)
    if (response.token) {
      localStorage.setItem('token', response.token)
    }
    return response
  }

  static async register(userData: RegisterRequest) {
    const response = await api.post('/auth/register', userData)
    if (response.token) {
      localStorage.setItem('token', response.token)
    }
    return response
  }

  static async logout() {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
  }

  static async getProfile(): Promise<User> {
    return api.get('/auth/profile')
  }

  static async refreshToken() {
    const response = await api.post('/auth/refresh')
    if (response.token) {
      localStorage.setItem('token', response.token)
    }
    return response
  }

  static getToken(): string | null {
    return localStorage.getItem('token')
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }
}