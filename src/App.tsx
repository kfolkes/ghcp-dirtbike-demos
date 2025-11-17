import { useCallback, useState } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { PriceFilter } from './components/PriceFilter';
import { BikeGrid } from './components/BikeGrid';
import { Cart } from './components/Cart';
import { Footer } from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import { useCart } from './hooks/useCart';
import { useSearch } from './hooks/useSearch';
import { BIKES } from './data/bikes';
import type { UserRole } from './types/admin';

// Mock authentication - in production, this would come from auth service
const MOCK_AUTH = {
  isAuthenticated: true,
  userRole: 'admin' as UserRole,
};

function App() {
  const [currentPage, setCurrentPage] = useState<'shop' | 'admin'>('shop');

  const {
    cartItems,
    addToCart,
    removeFromCart,
    totalItems,
    totalPrice,
    averageRating,
  } = useCart();

  const {
    searchTerm,
    categoryFilter,
    minPrice,
    maxPrice,
    filteredBikes,
    handleSearch,
    handleCategoryFilter,
    handlePriceFilter,
  } = useSearch(BIKES);

  const handleCheckout = useCallback(() => {
    // TODO: Implement checkout logic
    alert(`Proceeding to checkout with ${totalItems} items totaling $${totalPrice.toLocaleString()}`);
  }, [totalItems, totalPrice]);

  // Admin Dashboard Route
  if (currentPage === 'admin') {
    return (
      <ProtectedRoute
        isAuthenticated={MOCK_AUTH.isAuthenticated}
        userRole={MOCK_AUTH.userRole}
        requiredRole="admin"
        fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
              <button
                onClick={() => setCurrentPage('shop')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Shop
              </button>
            </div>
          </div>
        }
      >
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <button
                onClick={() => setCurrentPage('shop')}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
                aria-label="Back to shop"
              >
                ← Back to Shop
              </button>
            </div>
          </div>
          <AdminDashboard />
        </div>
      </ProtectedRoute>
    );
  }

  // Shop Page (default)
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemCount={totalItems}
        onAdminClick={() => setCurrentPage('admin')}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchBar value={searchTerm} onChange={handleSearch} />
        
        <CategoryFilter value={categoryFilter} onChange={handleCategoryFilter} />

        <PriceFilter minPrice={minPrice} maxPrice={maxPrice} onPriceChange={handlePriceFilter} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Featured Bikes
              </h2>
              <p className="text-gray-600 mt-2">
                {filteredBikes.length} {filteredBikes.length === 1 ? 'bike' : 'bikes'} available
              </p>
            </div>

            <BikeGrid bikes={filteredBikes} onAddToCart={addToCart} />
          </div>

          {/* Shopping Cart Sidebar */}
          <div className="lg:col-span-1">
            <Cart
              items={cartItems}
              totalItems={totalItems}
              totalPrice={totalPrice}
              averageRating={averageRating}
              onRemoveItem={removeFromCart}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
