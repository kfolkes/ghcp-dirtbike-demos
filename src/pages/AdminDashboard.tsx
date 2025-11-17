/**
 * AdminDashboard Page
 * Comprehensive admin dashboard with metrics and visualizations
 */

import React from 'react';
import { useAdminMetrics } from '../hooks/useAdminMetrics';
import { MetricCard, LineChart, BarChart, PieChart, AreaChart } from '../components/Dashboard';
import { formatCurrency, formatNumber } from '../data/mockAdminData';

// Icons as simple SVG components
const DollarIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path d="M8.16 2.75a.75.75 0 00-.75.75v.26c-1.28.37-2.47.99-3.43 1.85a.75.75 0 101.06 1.06c.78-.75 1.77-1.32 2.82-1.66v2.63c0 .414.336.75.75.75h.5c1.59 0 2.95.86 3.75 1.83.67.78 1.09 1.83 1.09 2.92 0 1.09-.42 2.14-1.09 2.92-.8.97-2.16 1.83-3.75 1.83h-.5c-.414 0-.75.336-.75.75v1.09a.75.75 0 101.5 0v-.26c1.28-.37 2.47-.99 3.43-1.85a.75.75 0 10-1.06-1.06c-.78.75-1.77 1.32-2.82 1.66v-2.63c0-.414.336-.75.75-.75h.5c1.59 0 2.95-.86 3.75-1.83.67-.78 1.09-1.83 1.09-2.92 0-1.09-.42-2.14-1.09-2.92-.8-.97-2.16-1.83-3.75-1.83h-.5c-.414 0-.75-.336-.75-.75v-1.09a.75.75 0 00-.75-.75z" />
  </svg>
);

const ShoppingCartIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z" />
    <path d="M16 16a2 2 0 11-4 0 2 2 0 014 0z" />
    <path d="M6 16a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
);

const PackageIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const CalculatorIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 11-2 0 1 1 0 012 0zm-3 1a1 1 0 100-2 1 1 0 000 2zm3-4a1 1 0 11-2 0 1 1 0 012 0zm-6 4a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
  </svg>
);

/**
 * AdminDashboard component
 * Displays key metrics, charts, and analytics
 */
const AdminDashboard: React.FC = () => {
  const { data, loading, error, refetch } = useAdminMetrics();

  if (error) {
    return (
      <div role="alert" className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => refetch()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div role="status" aria-live="polite" className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              aria-label="Refresh dashboard data"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Grid */}
        <section aria-label="Key Metrics">
          <h2 className="sr-only">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {/* Total Revenue */}
            <MetricCard
              label="Total Revenue"
              value={formatCurrency(data.totalRevenue)}
              icon={<DollarIcon />}
              ariaLabel={`Total Revenue: ${formatCurrency(data.totalRevenue)}`}
              description="All-time revenue"
            />

            {/* Orders Count */}
            <MetricCard
              label="Total Orders"
              value={formatNumber(data.ordersCount)}
              icon={<ShoppingCartIcon />}
              ariaLabel={`Total Orders: ${data.ordersCount}`}
              description="Number of orders"
            />

            {/* Average Order Value */}
            <MetricCard
              label="Average Order"
              value={formatCurrency(data.avgOrderValue)}
              icon={<CalculatorIcon />}
              ariaLabel={`Average Order Value: ${formatCurrency(data.avgOrderValue)}`}
              description="Per transaction"
            />

            {/* Top Products */}
            <MetricCard
              label="Top Products"
              value={data.topProducts.length}
              icon={<TrendingUpIcon />}
              ariaLabel={`Top Products: ${data.topProducts.length}`}
              description="Tracked products"
            />

            {/* Inventory Status */}
            <MetricCard
              label="Inventory"
              value={formatNumber(data.inventoryStatus)}
              icon={<PackageIcon />}
              ariaLabel={`Inventory Status: ${data.inventoryStatus} units`}
              description="Total units"
            />
          </div>
        </section>

        {/* Charts Grid */}
        <section aria-label="Analytics Charts">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Trend */}
            <LineChart
              data={data.orderTrends}
              title="Revenue Trend"
              ariaLabel="Weekly revenue trend visualization"
            />

            {/* Orders Over Time */}
            <AreaChart
              data={data.orderTrends}
              title="Order Frequency"
              ariaLabel="Weekly order frequency visualization"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <BarChart
              data={data.topProducts}
              title="Top Products by Revenue"
              ariaLabel="Top 5 products by revenue visualization"
            />

            {/* Category Distribution */}
            <PieChart
              data={data.categoryDistribution}
              title="Sales by Category"
              ariaLabel="Sales distribution by bike category"
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;
