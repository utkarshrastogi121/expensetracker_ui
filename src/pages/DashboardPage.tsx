import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet, Receipt, CalendarDays, ArrowRight, Tags, BarChart3, UserCircle, Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { analyticsService, aiService } from '../api/analyticsService';
import { expenseService } from '../api/expenseService';
import type { AnalyticsSummaryDTO, ExpenseDTO } from '../types';
import { StatCard } from '../components/ui/StatCard';
import { PageSpinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { AiReportModal } from '../components/AireportModal';
import { formatCurrency, formatDate, getErrorMessage } from '../utils/format';

const quickLinks = [
  { to: '/expenses', icon: Receipt, label: 'Expenses', desc: 'View & manage transactions' },
  { to: '/budgets', icon: Wallet, label: 'Budgets', desc: 'Set monthly limits' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics', desc: 'Spending trends' },
  { to: '/profile', icon: UserCircle, label: 'Profile', desc: 'Account settings' },
];

export function DashboardPage() {
  const [summary, setSummary] = useState<AnalyticsSummaryDTO | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<ExpenseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [report, setReport] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [summaryRes, expensesRes] = await Promise.all([
          analyticsService.getSummary(),
          expenseService.getExpenses({ page: 0, size: 5, sort: ['date,desc'] }),
        ]);
        setSummary(summaryRes);
        setRecentExpenses(expensesRes.content);
      } catch (err) {
        toast.error(getErrorMessage(err, 'Failed to load dashboard'));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleGenerateReport = async () => {
    setIsReportModalOpen(true);
    setIsReportLoading(true);
    setReportError(null);
    try {
      const result = await aiService.generateReport();
      setReport(result);
    } catch (err) {
      setReportError(getErrorMessage(err, 'Failed to generate AI report'));
    } finally {
      setIsReportLoading(false);
    }
  };

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Dashboard</h1>
          <p className="text-sm text-ink-300 mt-0.5">A snapshot of your spending</p>
        </div>
        <Button onClick={handleGenerateReport}>
          <Sparkles size={16} /> Generate AI Summary
        </Button>
      </div>

      {/* Stat cards */}
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

      {/* Quick navigation cards */}
      <div>
        <h2 className="text-sm font-semibold text-ink-700 mb-3">Quick navigation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(({ to, icon: Icon, label, desc }) => (
            <Link
              key={to}
              to={to}
              className="group bg-white rounded-xl border border-surface-200 p-4 hover:border-brand-300 hover:shadow-sm transition-all duration-150"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mb-3 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Icon size={18} />
              </div>
              <p className="text-sm font-medium text-ink-900">{label}</p>
              <p className="text-xs text-ink-300 mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent expenses table */}
      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200">
          <h2 className="text-sm font-semibold text-ink-900">Recent expenses</h2>
          <Link
            to="/expenses"
            className="text-xs font-medium text-brand-600 hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {recentExpenses.length === 0 ? (
          <EmptyState
            title="No expenses yet"
            description="Add your first expense to see it appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 text-left">
                  <th className="px-5 py-3 font-medium text-ink-300 text-xs uppercase tracking-wide">Title</th>
                  <th className="px-5 py-3 font-medium text-ink-300 text-xs uppercase tracking-wide">
                    <span className="inline-flex items-center gap-1"><Tags size={12} /> Category</span>
                  </th>
                  <th className="px-5 py-3 font-medium text-ink-300 text-xs uppercase tracking-wide">Date</th>
                  <th className="px-5 py-3 font-medium text-ink-300 text-xs uppercase tracking-wide text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map((exp) => (
                  <tr key={exp.id} className="border-b border-surface-100 last:border-0 hover:bg-surface-50">
                    <td className="px-5 py-3 text-ink-900 font-medium">{exp.title}</td>
                    <td className="px-5 py-3 text-ink-500">{exp.categoryName}</td>
                    <td className="px-5 py-3 text-ink-500">{formatDate(exp.date)}</td>
                    <td className="px-5 py-3 text-ink-900 font-mono text-right">{formatCurrency(exp.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AiReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        report={report}
        isLoading={isReportLoading}
        error={reportError}
        onRetry={handleGenerateReport}
      />
    </div>
  );
}