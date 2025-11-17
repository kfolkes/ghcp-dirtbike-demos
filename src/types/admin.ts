/**
 * Admin Dashboard Types
 * Defines the structure for admin metrics, products, and orders
 */

export interface Product {
  id: string;
  name: string;
  unitsSold: number;
  revenue: number;
  category: string;
}

export interface OrderMetrics {
  date: string;
  count: number;
  revenue: number;
}

export interface CategoryMetrics {
  name: string;
  value: number;
  percentage: number;
}

export interface AdminMetrics {
  totalRevenue: number;
  ordersCount: number;
  topProducts: Product[];
  avgOrderValue: number;
  inventoryStatus: number;
  categoryDistribution: CategoryMetrics[];
  orderTrends: OrderMetrics[];
  lastUpdated: string;
}

export interface AdminMetricsState {
  data: AdminMetrics | null;
  loading: boolean;
  error: string | null;
  lastFetch: number;
}

export type UserRole = 'admin' | 'user' | 'guest';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
