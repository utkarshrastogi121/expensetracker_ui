import { useCallback, useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

import { expenseService } from '../api/expenseService';
import { categoryService } from '../api/categoryService';
import type { Category, ExpenseDTO } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { PageSpinner } from '../components/ui/Spinner';
import { Pagination } from '../components/ui/Pagination';
import { ExpenseFormModal, type ExpenseFormValues } from '../components/ExpenseFormModal';
import { formatCurrency, formatDate, getErrorMessage } from '../utils/format';

const PAGE_SIZE = 10;

type FilterMode = 'none' | 'category' | 'date';

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const [filterMode, setFilterMode] = useState<FilterMode>('none');
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseDTO | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<ExpenseDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const cats = await categoryService.getAll();
      setCategories(cats);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to load categories'));
    }
  }, []);

  const loadExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      let res;
      if (activeSearch) {
        res = await expenseService.searchExpenses(activeSearch, { page, size: PAGE_SIZE });
      } else if (filterMode === 'category' && categoryFilter) {
        res = await expenseService.getExpensesByCategory(categoryFilter, { page, size: PAGE_SIZE });
      } else if (filterMode === 'date' && startDate && endDate) {
        res = await expenseService.filterExpenses(startDate, endDate, { page, size: PAGE_SIZE });
      } else {
        res = await expenseService.getExpenses({ page, size: PAGE_SIZE, sort: ['date,desc'] });
      }
      setExpenses(res.content);
      setTotalPages(res.totalPages);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to load expenses'));
    } finally {
      setIsLoading(false);
    }
  }, [page, activeSearch, filterMode, categoryFilter, startDate, endDate]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterMode('none');
    setPage(0);
    setActiveSearch(searchQuery.trim());
  };

  const clearSearch = () => {
    setSearchQuery('');
    setActiveSearch('');
    setPage(0);
  };

  const applyCategoryFilter = (id: number) => {
    setActiveSearch('');
    setSearchQuery('');
    setFilterMode('category');
    setCategoryFilter(id);
    setPage(0);
  };

  const applyDateFilter = () => {
    if (!startDate || !endDate) {
      toast.error('Select both start and end dates');
      return;
    }
    setActiveSearch('');
    setSearchQuery('');
    setFilterMode('date');
    setPage(0);
  };

  const clearFilters = () => {
    setFilterMode('none');
    setCategoryFilter(null);
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

  const openCreateModal = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const openEditModal = (expense: ExpenseDTO) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (values: ExpenseFormValues) => {
    try {
      const payload = { title: values.title, amount: values.amount, date: values.date };
      if (editingExpense) {
        const res = await expenseService.updateExpense(editingExpense.id, values.categoryId, payload);
        toast.success('Expense updated');
        if (res.budgetExceeded) toast.error(res.alertMessage, { icon: '⚠️', duration: 5000 });
      } else {
        const res = await expenseService.createExpense(values.categoryId, payload);
        toast.success('Expense added');
        if (res.budgetExceeded) toast.error(res.alertMessage, { icon: '⚠️', duration: 5000 });
      }
      setIsFormOpen(false);
      loadExpenses();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to save expense'));
    }
  };

  const handleDelete = async () => {
    if (!deletingExpense) return;
    setIsDeleting(true);
    try {
      await expenseService.deleteExpense(deletingExpense.id);
      toast.success('Expense deleted');
      setDeletingExpense(null);
      loadExpenses();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to delete expense'));
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilter = !!activeSearch || filterMode !== 'none';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Expenses</h1>
          <p className="text-sm text-ink-300 mt-0.5">Manage and track your transactions</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={16} /> Add expense
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-surface-200 p-4 space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expenses by title..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-surface-300 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
          <Button type="submit" variant="secondary">Search</Button>
          {activeSearch && (
            <Button type="button" variant="ghost" onClick={clearSearch}>
              <X size={14} /> Clear
            </Button>
          )}
        </form>

        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-500">Filter by category</label>
            <select
              value={filterMode === 'category' ? categoryFilter ?? '' : ''}
              onChange={(e) => applyCategoryFilter(Number(e.target.value))}
              className="px-3 py-2 text-sm rounded-lg border border-surface-300 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all bg-white min-w-[160px]"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-500">From</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-500">To</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <Button variant="secondary" onClick={applyDateFilter}>Apply date range</Button>

          {hasActiveFilter && (
            <Button variant="ghost" onClick={clearFilters}>
              <X size={14} /> Reset filters
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
        {isLoading ? (
          <PageSpinner />
        ) : expenses.length === 0 ? (
          <EmptyState
            title="No expenses found"
            description={hasActiveFilter ? 'Try adjusting your search or filters.' : 'Add your first expense to get started.'}
            action={!hasActiveFilter && <Button onClick={openCreateModal}><Plus size={16} /> Add expense</Button>}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 text-left">
                    <th className="px-5 py-3 font-medium text-ink-300 text-xs uppercase tracking-wide">Title</th>
                    <th className="px-5 py-3 font-medium text-ink-300 text-xs uppercase tracking-wide">Category</th>
                    <th className="px-5 py-3 font-medium text-ink-300 text-xs uppercase tracking-wide">Date</th>
                    <th className="px-5 py-3 font-medium text-ink-300 text-xs uppercase tracking-wide text-right">Amount</th>
                    <th className="px-5 py-3 font-medium text-ink-300 text-xs uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="border-b border-surface-100 last:border-0 hover:bg-surface-50">
                      <td className="px-5 py-3 text-ink-900 font-medium">{exp.title}</td>
                      <td className="px-5 py-3 text-ink-500">{exp.categoryName}</td>
                      <td className="px-5 py-3 text-ink-500">{formatDate(exp.date)}</td>
                      <td className="px-5 py-3 text-ink-900 font-mono text-right">{formatCurrency(exp.amount)}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEditModal(exp)}
                            className="p-1.5 rounded-md text-ink-300 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeletingExpense(exp)}
                            className="p-1.5 rounded-md text-ink-300 hover:text-red-600 hover:bg-danger-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      <ExpenseFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        categories={categories}
        initialData={editingExpense}
      />

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deletingExpense}
        onClose={() => setDeletingExpense(null)}
        title="Delete expense"
        maxWidth="sm"
      >
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-danger-100 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} />
          </div>
          <p className="text-sm text-ink-500">
            Are you sure you want to delete <span className="font-medium text-ink-900">{deletingExpense?.title}</span>?
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <Button variant="secondary" onClick={() => setDeletingExpense(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
