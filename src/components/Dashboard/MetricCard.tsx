/**
 * MetricCard Component
 * Displays a single dashboard metric with icon and value
 */

import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  description?: string;
  ariaLabel?: string;
}

/**
 * MetricCard displays a key metric with value and optional trend
 */
const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  trend,
  description,
  ariaLabel,
}) => {
  return (
    <article
      className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
      aria-label={ariaLabel || label}
      role="region"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
          <p
            className="text-3xl font-bold text-gray-900 mb-1"
            aria-label={`${label}: ${value}`}
          >
            {value}
          </p>
          {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg text-blue-600">
          {icon}
        </div>
      </div>

      {trend && (
        <div
          className={`mt-4 flex items-center text-sm font-medium ${
            trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
          }`}
          aria-label={`${trend.direction === 'up' ? 'Increased' : 'Decreased'} by ${Math.abs(trend.value)}%`}
        >
          <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
          <span className="ml-1">{Math.abs(trend.value)}% from last period</span>
        </div>
      )}
    </article>
  );
};

export default MetricCard;
