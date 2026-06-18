import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2 text-sm rounded-lg border outline-none
            transition-all duration-150
            bg-white text-ink-900 placeholder-ink-300
            ${error
              ? 'border-danger-500 focus:ring-2 focus:ring-danger-500 focus:ring-offset-0'
              : 'border-surface-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
            }
            disabled:bg-surface-100 disabled:text-ink-300 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {hint && !error && <p className="text-xs text-ink-300">{hint}</p>}
        {error && <p className="text-xs text-danger-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
