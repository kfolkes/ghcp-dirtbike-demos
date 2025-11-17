import { memo } from 'react';

interface CategoryFilterProps {
  value: 'all' | 'motocross' | 'enduro' | 'youth';
  onChange: (value: 'all' | 'motocross' | 'enduro' | 'youth') => void;
}

const CATEGORIES = [
  { value: 'all' as const, label: 'All Bikes', icon: '🏍️' },
  { value: 'motocross' as const, label: 'Motocross', icon: '🏁' },
  { value: 'enduro' as const, label: 'Enduro', icon: '🌲' },
  { value: 'youth' as const, label: 'Youth', icon: '👦' },
];

export const CategoryFilter = memo<CategoryFilterProps>(({ value, onChange }) => {
  return (
    <div className="mb-8" role="group" aria-label="Filter bikes by category">
      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map((category) => (
          <button
            key={category.value}
            onClick={() => onChange(category.value)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              value === category.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            aria-pressed={value === category.value}
          >
            <span role="img" aria-hidden="true">
              {category.icon}
            </span>{' '}
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
});

CategoryFilter.displayName = 'CategoryFilter';
