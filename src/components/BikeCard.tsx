import { memo } from 'react';
import type { Bike } from '../types';

interface BikeCardProps {
  bike: Bike;
  onAddToCart: (bike: Bike) => void;
}

export const BikeCard = memo<BikeCardProps>(({ bike, onAddToCart }) => {
  const filledStars = Math.floor(bike.rating);
  
  return (
    <article
      className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg flex flex-col"
    >
      {/* Image Section */}
      <div className="bg-gray-50 px-4 pt-6 pb-3 flex items-center justify-center h-32 group-hover:bg-gray-100 transition-all">
        <span 
          className="text-6xl group-hover:scale-110 transition-transform"
          role="img"
          aria-label="Dirt bike"
        >
          {bike.image}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2" role="group" aria-label={`Rating: ${bike.rating} out of 5 stars`}>
          <div className="flex gap-0.5" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-xs">
                {i < filledStars ? '⭐' : '☆'}
              </span>
            ))}
          </div>
          <span className="text-xs font-semibold text-gray-700">{bike.rating}</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {bike.name}
        </h3>
        <p className="text-gray-600 text-xs mb-3 flex-grow line-clamp-2">
          {bike.description}
        </p>

        {/* Specs */}
        <div className="flex flex-wrap gap-1.5 mb-3" role="list" aria-label="Bike specifications">
          {bike.specs.map((spec) => (
            <span
              key={spec}
              className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200"
              role="listitem"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Price and Button */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="text-xl font-bold text-gray-900" aria-label={`Price: $${bike.price.toLocaleString()}`}>
            ${bike.price.toLocaleString()}
          </span>
          <button
            onClick={() => onAddToCart(bike)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 text-sm rounded-md transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Add ${bike.name} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
});

BikeCard.displayName = 'BikeCard';
