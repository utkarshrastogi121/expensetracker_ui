import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import type { Category, ExpenseDTO } from '../types';
import { Modal } from './ui/Modal';
import { FormField } from './ui/FormField';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  date: z.string().min(1, 'Date is required'),
  categoryId: z.coerce.number().min(1, 'Select a category'),
});

export type ExpenseFormValues = z.infer<typeof schema>;

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ExpenseFormValues) => Promise<void>;
  categories: Category[];
  initialData?: ExpenseDTO | null;
}

export function ExpenseFormModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialData,
}: ExpenseFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      categoryId: categories[0]?.id ?? 0,
    },
  });

  // Reset form whenever the modal opens with new initial data
  useEffect(() => {
    if (isOpen) {
      reset({
        title: initialData?.title ?? '',
        amount: initialData?.amount ?? 0,
        date: initialData?.date ?? new Date().toISOString().slice(0, 10),
        categoryId: initialData?.categoryId ?? categories[0]?.id ?? 0,
      });
    }
  }, [isOpen, initialData, categories, reset]);

  const handleFormSubmit = async (values: ExpenseFormValues) => {
    await onSubmit(values);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit expense' : 'Add expense'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField label="Title" error={errors.title?.message} required>
          <Input placeholder="e.g. Grocery shopping" {...register('title')} />
        </FormField>

        <FormField label="Amount" error={errors.amount?.message} required>
          <Input type="number" step="0.01" placeholder="0.00" {...register('amount')} />
        </FormField>

        <FormField label="Date" error={errors.date?.message} required>
          <Input type="date" {...register('date')} />
        </FormField>

        <FormField label="Category" error={errors.categoryId?.message} required>
          <select
            {...register('categoryId')}
            className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 outline-none bg-white text-ink-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
          >
            {categories.length === 0 && <option value="">No categories available</option>}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </FormField>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialData ? 'Save changes' : 'Add expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
