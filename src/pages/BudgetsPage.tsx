import { useCallback, useEffect, useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

import { budgetService } from '../api/budgetService';
import { categoryService } from '../api/categoryService';
import type { BudgetDTO, Category } from '../types';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { PageSpinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { BudgetFormModal, type BudgetFormValues } from '../components/BudgetFormModal';
import { formatCurrency, monthName, getErrorMessage } from '../utils/format';

export function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetDTO[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [budgetsRes, categoriesRes] = await Promise.all([
        budgetService.getBudgets(),
        categoryService.getAll(),
      ]);
      setBudgets(budgetsRes);
      setCategories(categoriesRes);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to load budgets'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (values: BudgetFormValues) => {
    try {
      await budgetService.createBudget(values.categoryId, {
        amount: values.amount,
        month: values.month,
        year: values.year,
      });
      toast.success('Budget created');
      setIsFormOpen(false);
      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to create budget'));
    }
  };

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Budgets</h1>
          <p className="text-sm text-ink-300 mt-0.5">Set monthly spending limits by category</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus size={16} /> Create budget
        </Button>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : budgets.length === 0 ? (
        <div className="bg-white rounded-xl border border-surface-200">
          <EmptyState
            title="No budgets set"
            description="Create a budget to get alerts when you're close to your spending limit."
            action={<Button onClick={() => setIsFormOpen(true)}><Plus size={16} /> Create budget</Button>}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => {
            const isCurrent = budget.month === currentMonth && budget.year === currentYear;
            return (
              <div key={budget.id} className="bg-white rounded-xl border border-surface-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Wallet size={17} />
                  </div>
                  {isCurrent && <Badge variant="brand">Current</Badge>}
                </div>
                <p className="text-sm font-medium text-ink-900">{budget.categoryName}</p>
                <p className="text-xs text-ink-300 mt-0.5">
                  {monthName(budget.month)} {budget.year}
                </p>
                <p className="text-xl font-semibold text-ink-900 mt-3 font-mono">
                  {formatCurrency(budget.amount)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <BudgetFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
        categories={categories}
      />
    </div>
  );
}
