import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Modal } from './ui/Modal';
import { FormField } from './ui/FormField';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
});

export type CategoryFormValues = z.infer<typeof schema>;

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
}

export function CategoryFormModal({ isOpen, onClose, onSubmit }: CategoryFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (isOpen) reset({ name: '' });
  }, [isOpen, reset]);

  const handleFormSubmit = async (values: CategoryFormValues) => {
    await onSubmit(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add category" maxWidth="sm">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField label="Category name" error={errors.name?.message} required>
          <Input placeholder="e.g. Groceries" {...register('name')} />
        </FormField>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>Add category</Button>
        </div>
      </form>
    </Modal>
  );
}