import { api } from './axios';
import type { User, UserDTO } from '../types';

export const userService = {
  getCurrentUser: async (): Promise<UserDTO> => {
    const res = await api.get<UserDTO>('/api/users/me');
    return res.data;
  },

  updateProfile: async (data: User): Promise<UserDTO> => {
    const res = await api.put<UserDTO>('/api/users/me', data);
    return res.data;
  },
};
