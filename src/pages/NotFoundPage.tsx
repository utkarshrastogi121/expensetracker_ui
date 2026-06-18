import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 px-4 text-center">
      <p className="text-6xl font-semibold text-brand-600 font-mono">404</p>
      <h1 className="text-xl font-semibold text-ink-900 mt-3">Page not found</h1>
      <p className="text-sm text-ink-300 mt-1 max-w-xs">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/dashboard" className="mt-6">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}
