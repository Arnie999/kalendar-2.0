'use client';

import { useUser } from '@/context/UserContext';
import type { ReactNode } from 'react';
import type { RolePermissions, UserRole } from '@/types/roles';

interface PermissionGateProps {
  children: ReactNode;
  permission?: keyof RolePermissions;
  role?: UserRole;
  fallback?: ReactNode;
}

export function PermissionGate({ 
  children, 
  permission, 
  role, 
  fallback = null 
}: PermissionGateProps) {
  const { currentUser, permissions } = useUser();

  // Check role-based access
  if (role && currentUser?.role !== role) {
    return <>{fallback}</>;
  }

  // Check permission-based access
  if (permission && !permissions[permission]) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
} 