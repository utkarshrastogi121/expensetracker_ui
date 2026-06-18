import { api } from './axios';
import type { Category } from '../types';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get<Category[]>('/api/categories');
    return res.data;
  },

  getById: async (id: number): Promise<Category> => {
    const res = await api.get<Category>(`/api/categories/${id}`);
    return res.data;
  },

  create: async (category: Category): Promise<Category> => {
    const res = await api.post<Category>('/api/categories', category);
    return res.data;
  },
};
