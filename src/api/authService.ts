import { api } from './axios';
import type { AuthResponse, LoginRequest, SignupRequest } from '../types';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/api/auth/login', data);
    return res.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/api/auth/signup', data);
    return res.data;
  },
};
