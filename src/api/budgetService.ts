import { api } from './axios';
import type { Budget, BudgetDTO } from '../types';

export const budgetService = {
  getBudgets: async (): Promise<BudgetDTO[]> => {
    const res = await api.get<BudgetDTO[]>('/api/budget');
    return res.data;
  },

  createBudget: async (categoryId: number, budget: Budget): Promise<BudgetDTO> => {
    const res = await api.post<BudgetDTO>('/api/budget', budget, {
      params: { categoryId },
    });
    return res.data;
  },
};
