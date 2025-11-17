import { memo, useId } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = memo<SearchBarProps>(({ value, onChange }) => {
  const searchId = useId();

  return (
    <div className="mb-8">
      <label htmlFor={searchId} className="sr-only">
        Search bikes by name or description
      </label>
      <input
        id={searchId}
        type="search"
        placeholder="Search bikes by name or description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        aria-label="Search bikes"
      />
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
