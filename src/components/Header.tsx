import { memo } from 'react';

interface HeaderProps {
  cartItemCount: number;
  onAdminClick?: () => void;
}

export const Header = memo<HeaderProps>(({ cartItemCount, onAdminClick }) => {
  return (
    <header className='sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <span className='text-4xl' role='img' aria-label='Racing flag'>
              🏁
            </span>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                DIRT BIKE SHOP
              </h1>
              <p className='text-xs text-gray-600 font-medium'>
                EXTREME OFF-ROAD THRILLS
              </p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className='px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
                aria-label='Go to admin dashboard'
              >
                🔧 Admin
              </button>
            )}
            <div
              className='text-gray-700 font-semibold text-lg flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg'
              role='status'
              aria-live='polite'
              aria-label={`Cart items: ${cartItemCount}`}
            >
              <span role='img' aria-label='Shopping cart'>
                🛒
              </span>
              {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
