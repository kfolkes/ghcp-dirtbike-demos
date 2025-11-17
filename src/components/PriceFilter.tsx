import { memo, useId } from 'react';

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (minPrice: number, maxPrice: number) => void;
}

const MIN_PRICE = 3499;
const MAX_PRICE = 8499;

export const PriceFilter = memo<PriceFilterProps>(
  ({ minPrice, maxPrice, onPriceChange }) => {
    const minInputId = useId();
    const maxInputId = useId();

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = parseInt(e.target.value, 10) || MIN_PRICE;
      // Ensure min doesn't exceed max
      const validMin = Math.min(newMin, maxPrice);
      onPriceChange(validMin, maxPrice);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = parseInt(e.target.value, 10) || MAX_PRICE;
      // Ensure max doesn't go below min
      const validMax = Math.max(newMax, minPrice);
      onPriceChange(minPrice, validMax);
    };

    const handleReset = () => {
      onPriceChange(MIN_PRICE, MAX_PRICE);
    };

    return (
      <div className="mb-8" role="group" aria-label="Filter bikes by price range">
        <div className="mb-4">
          <p className="font-semibold text-gray-900 mb-3">Price Range</p>
          <p className="text-sm text-gray-600 mb-4">
            ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Min Price Input */}
            <div>
              <label htmlFor={minInputId} className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Price
              </label>
              <input
                id={minInputId}
                type="number"
                min={MIN_PRICE}
                max={maxPrice}
                value={minPrice}
                onChange={handleMinChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                aria-label="Minimum price filter"
              />
            </div>

            {/* Max Price Input */}
            <div>
              <label htmlFor={maxInputId} className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Price
              </label>
              <input
                id={maxInputId}
                type="number"
                min={minPrice}
                max={MAX_PRICE}
                value={maxPrice}
                onChange={handleMaxChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                aria-label="Maximum price filter"
              />
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Reset price filter"
          >
            Reset Price Filter
          </button>
        </div>
      </div>
    );
  }
);

PriceFilter.displayName = 'PriceFilter';
