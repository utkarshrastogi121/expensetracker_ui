import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { UserCircle } from 'lucide-react';

import { userService } from '../api/userService';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { PageSpinner } from '../components/ui/Spinner';
import { getErrorMessage } from '../utils/format';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Enter a valid email'),
  password: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const load = async () => {
      try {
        const current = await userService.getCurrentUser();
        reset({ name: current.name, email: current.email, password: '' });
        updateUser(current);
      } catch (err) {
        toast.error(getErrorMessage(err, 'Failed to load profile'));
      } finally {
        setIsLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        name: values.name,
        email: values.email,
        ...(values.password ? { password: values.password } : {}),
      };
      const updated = await userService.updateProfile(payload);
      updateUser(updated);
      toast.success('Profile updated');
      reset({ name: updated.name, email: updated.email, password: '' });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update profile'));
    }
  };

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Profile</h1>
        <p className="text-sm text-ink-300 mt-0.5">Manage your account information</p>
      </div>

      <div className="bg-white rounded-xl border border-surface-200 p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-surface-200">
          <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
            <UserCircle size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-ink-900">{user?.name}</p>
            <p className="text-xs text-ink-300">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full name" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input
            label="New password"
            type="password"
            placeholder="Leave blank to keep current password"
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={isSubmitting}>Save changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
