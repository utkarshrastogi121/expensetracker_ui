export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }[size];
  return (
    <div className={`${sizeClass} border-2 border-brand-500 border-t-transparent rounded-full animate-spin`} />
  );
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-75">
      <Spinner size="lg" />
    </div>
  );
}
