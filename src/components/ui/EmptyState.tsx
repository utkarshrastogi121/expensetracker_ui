import { InboxIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center mb-4">
        <InboxIcon size={24} className="text-ink-300" />
      </div>
      <p className="text-sm font-medium text-ink-700">{title}</p>
      {description && <p className="text-sm text-ink-300 mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
