/**
 * ProtectedRoute Component
 * Guards routes by verifying user authentication and role
 */

import React from 'react';
import type { UserRole } from '../types/admin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute wraps components that require authentication
 * @param isAuthenticated - Whether user is authenticated
 * @param userRole - Current user's role
 * @param requiredRole - Role required to access route (defaults to 'admin')
 * @param children - Content to render if authorized
 * @param fallback - Content to show if not authorized
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAuthenticated,
  userRole,
  requiredRole = 'admin',
  fallback,
}) => {
  // Not authenticated
  if (!isAuthenticated) {
    console.warn(`User not authenticated. Access to admin route denied.`);
    return fallback ? <>{fallback}</> : <UnauthorizedFallback />;
  }

  // Authenticated but insufficient role
  if (userRole !== requiredRole) {
    console.warn(`User role '${userRole}' does not match required role '${requiredRole}'.`);
    return fallback ? <>{fallback}</> : <UnauthorizedFallback />;
  }

  // Authorized - render children
  return <>{children}</>;
};

/**
 * Default fallback component when access is denied
 */
const UnauthorizedFallback: React.FC = () => (
  <div
    role="status"
    aria-label="Access denied"
    className="flex items-center justify-center min-h-screen bg-gray-50"
  >
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-600">You do not have permission to view this page.</p>
      <a
        href="/"
        className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Return to Home
      </a>
    </div>
  </div>
);

export default ProtectedRoute;
