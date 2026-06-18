import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { Wallet, Receipt, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';

import { analyticsService } from '../api/analyticsService';
import type { AnalyticsSummaryDTO, CategoryExpenseDTO, MonthlyExpenseDTO } from '../types';
import { StatCard } from '../components/ui/StatCard';
import { PageSpinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency, getErrorMessage } from '../utils/format';

const PIE_COLORS = ['#4f52e7', '#22c55e', '#f59e0b', '#ef4444', '#6470f3', '#8b96b0', '#a5b8fd', '#3636a5'];

export function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummaryDTO | null>(null);
  const [monthly, setMonthly] = useState<MonthlyExpenseDTO[]>([]);
  const [byCategory, setByCategory] = useState<CategoryExpenseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [summaryRes, monthlyRes, categoryRes] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getMonthlyExpenses(),
          analyticsService.getCategoryExpenses(),
        ]);
        setSummary(summaryRes);
        setMonthly(monthlyRes);
        setByCategory(categoryRes);
      } catch (err) {
        toast.error(getErrorMessage(err, 'Failed to load analytics'));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Analytics</h1>
        <p className="text-sm text-ink-300 mt-0.5">Understand your spending patterns</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Expense"
          value={formatCurrency(summary?.totalExpense ?? 0)}
          icon={<Wallet size={20} />}
          color="brand"
        />
        <StatCard
          label="This Month"
          value={formatCurrency(summary?.currentMonthExpense ?? 0)}
          icon={<CalendarDays size={20} />}
          color="warning"
        />
        <StatCard
          label="Total Transactions"
          value={summary?.totalTransactions ?? 0}
          icon={<Receipt size={20} />}
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category pie chart */}
        <div className="bg-white rounded-xl border border-surface-200 p-5">
          <h2 className="text-sm font-semibold text-ink-900 mb-4">Spending by category</h2>
          {byCategory.length === 0 ? (
            <EmptyState title="No category data" description="Add expenses to see the breakdown." />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ category, percent }) => `${category} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {byCategory.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Monthly bar chart */}
        <div className="bg-white rounded-xl border border-surface-200 p-5">
          <h2 className="text-sm font-semibold text-ink-900 mb-4">Monthly expenses</h2>
          {monthly.length === 0 ? (
            <EmptyState title="No monthly data" description="Add expenses to see trends over time." />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#5a6482' }} />
                <YAxis tick={{ fontSize: 12, fill: '#5a6482' }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="amount" fill="#4f52e7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
