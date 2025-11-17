import { memo } from 'react';
import type { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  averageRating: number;
  onRemoveItem: (bikeId: number) => void;
  onCheckout: () => void;
}

export const Cart = memo<CartProps>(({
  items,
  totalItems,
  totalPrice,
  averageRating,
  onRemoveItem,
  onCheckout,
}) => {
  return (
    <aside
      className="sticky top-24 bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
      aria-label="Shopping cart"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span role="img" aria-label="Shopping cart">
          🛒
        </span>
        Cart
      </h2>

      {/* Cart Items */}
      <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 italic">Your cart is empty</p>
            <p className="text-xs text-gray-400 mt-2">Add bikes to get started!</p>
          </div>
        ) : (
          items.map((item) => (
            <article
              key={item.bike.id}
              className="bg-gray-50 p-3 rounded-lg flex justify-between items-start gap-2 border border-gray-200 hover:border-gray-300 transition-all group"
            >
              <div className="flex-grow min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {item.bike.name}
                </p>
                <p className="text-gray-900 font-bold text-lg">
                  ${item.bike.price.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <button
                onClick={() => onRemoveItem(item.bike.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded text-xs transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label={`Remove ${item.bike.name} from cart`}
              >
                ✕
              </button>
            </article>
          ))
        )}
      </div>

      {items.length > 0 && (
        <>
          {/* Cart Summary */}
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Items:</span>
              <span className="font-semibold text-gray-900">{totalItems}</span>
            </div>
            {averageRating > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Avg Rating:</span>
                <span className="font-semibold text-gray-900">
                  {averageRating.toFixed(1)}{' '}
                  <span role="img" aria-label="star">
                    ⭐
                  </span>
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-gray-900">
                ${totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={onCheckout}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Proceed to checkout"
          >
            CHECKOUT NOW{' '}
            <span role="img" aria-label="racing flag">
              🏁
            </span>
          </button>
        </>
      )}

      {/* Promo Section */}
      <div className="mt-6 bg-green-50 rounded-lg p-3 border border-green-200">
        <p className="text-xs text-green-800 font-semibold">
          <span role="img" aria-label="lightbulb">
            💡
          </span>{' '}
          FREE SHIPPING
        </p>
        <p className="text-xs text-green-700 mt-1">on orders over $5000</p>
      </div>
    </aside>
  );
});

Cart.displayName = 'Cart';
