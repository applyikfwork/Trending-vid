'use client';

import { useAuth } from '@/hooks/use-auth';
import { isAdmin } from '@/lib/admin';
import { AdminDashboard } from './admin-dashboard';
import { ErrorBoundary } from '../error-boundary';

export function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AdminDashboard />
    </ErrorBoundary>
  );
}