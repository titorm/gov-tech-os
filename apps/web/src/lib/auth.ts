import { api } from './api';
import type { User, LoginRequest, RegisterRequest } from '@repo/types';
import type { AxiosResponse } from 'axios';

export class AuthService {
  static async login(credentials: LoginRequest) {
    const response: AxiosResponse = await api.post('/auth/login', credentials);
    const token = response?.data?.token;
    if (token) {
      localStorage.setItem('token', token);
    }
    return response;
  }

  static async register(userData: RegisterRequest) {
    const response: AxiosResponse = await api.post('/auth/register', userData);
    const token = response?.data?.token;
    if (token) {
      localStorage.setItem('token', token);
    }
    return response;
  }

  static async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  }

  static async getProfile(): Promise<User> {
    const response: AxiosResponse<User> = await api.get('/auth/profile');
    return response.data;
  }

  static async refreshToken() {
    const response: AxiosResponse = await api.post('/auth/refresh');
    const token = response?.data?.token;
    if (token) {
      localStorage.setItem('token', token);
    }
    return response;
  }

  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
