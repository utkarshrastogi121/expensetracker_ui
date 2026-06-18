import { useCallback, useEffect, useState } from 'react';
import { Plus, Tags, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

import { categoryService } from '../api/categoryService';
import type { Category } from '../types';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { PageSpinner } from '../components/ui/Spinner';
import { Modal } from '../components/ui/Modal';
import { CategoryFormModal, type CategoryFormValues } from '../components/CategoryFormModal';
import { getErrorMessage } from '../utils/format';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await categoryService.getAll();
      setCategories(res);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to load categories'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleCreate = async (values: CategoryFormValues) => {
    try {
      await categoryService.create({ name: values.name });
      toast.success('Category added');
      setIsFormOpen(false);
      loadCategories();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to add category'));
    }
  };

  const openDetail = async (id: number | undefined) => {
    if (!id) return;
    setViewingId(id);
    setIsDetailLoading(true);
    try {
      const cat = await categoryService.getById(id);
      setViewingCategory(cat);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to load category'));
      setViewingId(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setViewingId(null);
    setViewingCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Categories</h1>
          <p className="text-sm text-ink-300 mt-0.5">Organize your expenses into categories</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus size={16} /> Add category
        </Button>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-surface-200">
          <EmptyState
            title="No categories yet"
            description="Add a category to start organizing your expenses and budgets."
            action={<Button onClick={() => setIsFormOpen(true)}><Plus size={16} /> Add category</Button>}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => openDetail(cat.id)}
              className="group bg-white rounded-xl border border-surface-200 p-5 text-left hover:border-brand-300 hover:shadow-sm transition-all duration-150"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Tags size={17} />
                </div>
                <Eye size={15} className="text-ink-100 group-hover:text-brand-500 transition-colors" />
              </div>
              <p className="text-sm font-medium text-ink-900 mt-3">{cat.name}</p>
              <p className="text-xs text-ink-300 mt-0.5">ID #{cat.id}</p>
            </button>
          ))}
        </div>
      )}

      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Category detail — exercises GET /api/categories/{id} */}
      <Modal isOpen={!!viewingId} onClose={closeDetail} title="Category details" maxWidth="sm">
        {isDetailLoading ? (
          <PageSpinner />
        ) : viewingCategory ? (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-ink-300 uppercase tracking-wide">Name</p>
              <p className="text-sm text-ink-900 mt-0.5">{viewingCategory.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-ink-300 uppercase tracking-wide">Category ID</p>
              <p className="text-sm text-ink-900 mt-0.5 font-mono">{viewingCategory.id}</p>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={closeDetail}>Close</Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}