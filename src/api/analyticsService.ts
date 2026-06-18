import { api } from './axios';
import type { AnalyticsSummaryDTO, CategoryExpenseDTO, MonthlyExpenseDTO } from '../types';

export const analyticsService = {
  getSummary: async (): Promise<AnalyticsSummaryDTO> => {
    const res = await api.get<AnalyticsSummaryDTO>('/api/analytics/summary');
    return res.data;
  },

  getMonthlyExpenses: async (): Promise<MonthlyExpenseDTO[]> => {
    const res = await api.get<MonthlyExpenseDTO[]>('/api/analytics/monthly');
    return res.data;
  },

  getCategoryExpenses: async (): Promise<CategoryExpenseDTO[]> => {
    const res = await api.get<CategoryExpenseDTO[]>('/api/analytics/category');
    return res.data;
  },
};

export const aiService = {
  generateReport: async (): Promise<string> => {
    const res = await api.get<{ report: string }>('/api/ai/generate-report');
    return res.data.report;
  },
};