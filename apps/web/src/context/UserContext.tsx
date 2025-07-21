'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { User, UserRole, RolePermissions } from '@/types/roles';
import { ROLE_PERMISSIONS } from '@/types/roles';

interface UserContextType {
  currentUser: User | null;
  switchRole: (role: UserRole, userName?: string) => void;
  permissions: RolePermissions;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: Record<UserRole, User> = {
  boss: { id: 'boss-1', name: 'Vedoucí Novák', role: 'boss' },
  zamestnanec: { id: 'emp-1', name: 'Jan Dvořák', role: 'zamestnanec' },
  bar: { id: 'bar-1', name: 'Marie Barová', role: 'bar', department: 'Bar' },
  zmrzlina: { id: 'ice-1', name: 'Petr Zmrzlář', role: 'zmrzlina', department: 'Zmrzlina' },
  kuchyn: { id: 'cook-1', name: 'Anna Kuchařová', role: 'kuchyn', department: 'Kuchyň' },
  mycka: { id: 'wash-1', name: 'Pavel Myčka', role: 'mycka', department: 'Myčka' },
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS.boss); // Start as boss for demo

  const switchRole = (role: UserRole, userName?: string) => {
    const user = MOCK_USERS[role];
    if (userName) {
      user.name = userName;
    }
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const permissions = currentUser ? ROLE_PERMISSIONS[currentUser.role] : ROLE_PERMISSIONS.zamestnanec;

  return (
    <UserContext.Provider value={{ currentUser, switchRole, permissions, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 