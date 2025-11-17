import { memo } from 'react';
import { BikeCard } from './BikeCard';
import type { Bike } from '../types';

interface BikeGridProps {
  bikes: ReadonlyArray<Bike>;
  onAddToCart: (bike: Bike) => void;
}

export const BikeGrid = memo<BikeGridProps>(({ bikes, onAddToCart }) => {
  if (bikes.length === 0) {
    return (
      <div className="text-center py-12" role="status">
        <p className="text-gray-400 text-lg">
          No bikes found. Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
      role="list"
      aria-label="Available dirt bikes"
    >
      {bikes.map((bike) => (
        <div key={bike.id} role="listitem">
          <BikeCard bike={bike} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  );
});

BikeGrid.displayName = 'BikeGrid';
