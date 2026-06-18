type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'brand';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface-100 text-ink-500',
  success: 'bg-success-100 text-green-700',
  warning: 'bg-warning-100 text-yellow-700',
  danger: 'bg-danger-100 text-red-700',
  brand: 'bg-brand-100 text-brand-700',
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
