import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export function useApi() {
  const queryClient = useQueryClient();

  const useGetProfile = () => {
    return useQuery({
      queryKey: ['profile'],
      queryFn: () => api.get('/auth/profile'),
      enabled: false, // Only run when explicitly called
    });
  };

  const useLogin = () => {
    return useMutation({
      mutationFn: (credentials: { email: string; password: string }) =>
        api.post('/auth/login', credentials),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      },
    });
  };

  const useLogout = () => {
    return useMutation({
      mutationFn: () => api.post('/auth/logout'),
      onSuccess: () => {
        queryClient.clear();
      },
    });
  };

  return {
    useGetProfile,
    useLogin,
    useLogout,
  };
}