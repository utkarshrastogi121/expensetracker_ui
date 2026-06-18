import { api } from './axios';
import type { BudgetResponseDTO, Expense, PageExpenseDTO, Pageable } from '../types';

export const expenseService = {
  getExpenses: async (pageable: Pageable): Promise<PageExpenseDTO> => {
    const res = await api.get<PageExpenseDTO>('/api/expenses', {
      params: {
        page: pageable.page,
        size: pageable.size,
        sort: pageable.sort,
      },
      
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              // Append each array item using the same key name: "sort=date,desc"
              value.forEach((val) => searchParams.append(key, val));
            } else {
              searchParams.append(key, String(value));
            }
          }
        });
        return searchParams.toString();
      },
    });
    return res.data;
  },

  createExpense: async (categoryId: number, expense: Expense): Promise<BudgetResponseDTO> => {
    const res = await api.post<BudgetResponseDTO>('/api/expenses', expense, {
      params: { categoryId },
    });
    return res.data;
  },

  updateExpense: async (id: number, categoryId: number, expense: Expense): Promise<BudgetResponseDTO> => {
    const res = await api.put<BudgetResponseDTO>(`/api/expenses/${id}`, expense, {
      params: { categoryId },
    });
    return res.data;
  },

  deleteExpense: async (id: number): Promise<void> => {
    await api.delete(`/api/expenses/${id}`);
  },

  searchExpenses: async (q: string, pageable: Pageable): Promise<PageExpenseDTO> => {
    const res = await api.get<PageExpenseDTO>('/api/expenses/search', {
      params: { q, page: pageable.page, size: pageable.size },
    });
    return res.data;
  },

  filterExpenses: async (startDate: string, endDate: string, pageable: Pageable): Promise<PageExpenseDTO> => {
    const res = await api.get<PageExpenseDTO>('/api/expenses/filter', {
      params: { startDate, endDate, page: pageable.page, size: pageable.size },
    });
    return res.data;
  },

  getExpensesByCategory: async (categoryId: number, pageable: Pageable): Promise<PageExpenseDTO> => {
    const res = await api.get<PageExpenseDTO>(`/api/expenses/category/${categoryId}`, {
      params: { page: pageable.page, size: pageable.size },
    });
    return res.data;
  },
};