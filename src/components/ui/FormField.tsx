import React from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FormField({ label, error, children, required }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink-700">
        {label}
        {required && <span className="text-danger-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
}
