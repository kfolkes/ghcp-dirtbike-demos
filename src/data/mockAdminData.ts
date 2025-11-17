/**
 * Mock Admin Data
 * Realistic test data for dashboard development
 */

import type { AdminMetrics, Product, OrderMetrics, CategoryMetrics } from '../types/admin';

const topProducts: Product[] = [
  { id: '1', name: 'Yamaha YZ450F', unitsSold: 45, revenue: 382455, category: 'Motocross' },
  { id: '2', name: 'Kawasaki KX250', unitsSold: 32, revenue: 201568, category: 'Motocross' },
  { id: '3', name: 'Honda CRF250R', unitsSold: 28, revenue: 162372, category: 'Motocross' },
  { id: '4', name: 'KTM 85 SX', unitsSold: 52, revenue: 181948, category: 'Youth' },
  { id: '5', name: 'Beta RR 430', unitsSold: 18, revenue: 131382, category: 'Enduro' },
];

const categoryDistribution: CategoryMetrics[] = [
  { name: 'Motocross', value: 167, percentage: 55 },
  { name: 'Enduro', value: 67, percentage: 22 },
  { name: 'Youth', value: 66, percentage: 23 },
];

const orderTrends: OrderMetrics[] = [
  { date: 'Mon', count: 12, revenue: 84528 },
  { date: 'Tue', count: 19, revenue: 134352 },
  { date: 'Wed', count: 15, revenue: 105840 },
  { date: 'Thu', count: 25, revenue: 176400 },
  { date: 'Fri', count: 22, revenue: 155112 },
  { date: 'Sat', count: 29, revenue: 204876 },
  { date: 'Sun', count: 16, revenue: 112896 },
];

export const mockAdminData: AdminMetrics = {
  totalRevenue: 1060004,
  ordersCount: 138,
  topProducts,
  avgOrderValue: 7681.48,
  inventoryStatus: 287,
  categoryDistribution,
  orderTrends,
  lastUpdated: new Date().toISOString(),
};

/**
 * Simulates fetching admin metrics from an API
 * @param delayMs - Delay in milliseconds to simulate network latency
 * @returns Promise resolving to AdminMetrics
 */
export const fetchAdminMetrics = (delayMs: number = 500): Promise<AdminMetrics> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...mockAdminData,
        lastUpdated: new Date().toISOString(),
      });
    }, delayMs);
  });
};

/**
 * Formats currency values
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formats numbers with commas
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};
