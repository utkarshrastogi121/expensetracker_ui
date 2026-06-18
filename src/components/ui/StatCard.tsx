import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; up?: boolean };
  color?: 'brand' | 'success' | 'warning' | 'danger';
}

const colorMap = {
  brand: 'bg-brand-50 text-brand-600',
  success: 'bg-success-100 text-green-600',
  warning: 'bg-warning-100 text-yellow-600',
  danger: 'bg-danger-100 text-red-600',
};

export function StatCard({ label, value, icon, trend, color = 'brand' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-surface-200 p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-ink-300 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-semibold text-ink-900 mt-0.5 font-mono">{value}</p>
        {trend && (
          <p className={`text-xs mt-1 ${trend.up ? 'text-green-600' : 'text-red-600'}`}>
            {trend.up ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
    </div>
  );
}
