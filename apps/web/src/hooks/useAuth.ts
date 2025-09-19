import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AuthService } from '../lib/auth'
import type { LoginRequest, RegisterRequest } from '@repo/types'

export function useAuth() {
  const queryClient = useQueryClient()

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: AuthService.getProfile,
    enabled: AuthService.isAuthenticated(),
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => AuthService.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => AuthService.register(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null)
      queryClient.clear()
    },
  })

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  }
}