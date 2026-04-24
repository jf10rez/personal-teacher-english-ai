import api from './api';
import { AuthResponse } from '../types';

export const authService = {
  register: async (data: { name: string; email: string; password: string; level?: string; goal?: string; dailyMinutes?: number }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  refresh: async (): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};
