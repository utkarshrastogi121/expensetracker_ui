import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import type { Category } from '../types';
import { Modal } from './ui/Modal';
import { FormField } from './ui/FormField';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { MONTH_NAMES } from '../utils/format';

const currentYear = new Date().getFullYear();

const schema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000, 'Year must be 2000 or later'),
  categoryId: z.coerce.number().min(1, 'Select a category'),
});

export type BudgetFormValues = z.infer<typeof schema>;

interface BudgetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: BudgetFormValues) => Promise<void>;
  categories: Category[];
}

export function BudgetFormModal({ isOpen, onClose, onSubmit, categories }: BudgetFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      month: new Date().getMonth() + 1,
      year: currentYear,
      categoryId: categories[0]?.id ?? 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        amount: 0,
        month: new Date().getMonth() + 1,
        year: currentYear,
        categoryId: categories[0]?.id ?? 0,
      });
    }
  }, [isOpen, categories, reset]);

  const handleFormSubmit = async (values: BudgetFormValues) => {
    await onSubmit(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create budget">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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

        <FormField label="Amount" error={errors.amount?.message} required>
          <Input type="number" step="0.01" placeholder="0.00" {...register('amount')} />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Month" error={errors.month?.message} required>
            <select
              {...register('month')}
              className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 outline-none bg-white text-ink-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
            >
              {MONTH_NAMES.map((m, idx) => (
                <option key={m} value={idx + 1}>{m}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Year" error={errors.year?.message} required>
            <Input type="number" {...register('year')} />
          </FormField>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>Create budget</Button>
        </div>
      </form>
    </Modal>
  );
}
