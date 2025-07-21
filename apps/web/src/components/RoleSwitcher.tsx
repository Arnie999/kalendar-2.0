'use client';

import { useUser } from '@/context/UserContext';
import { ROLE_LABELS, type UserRole } from '@/types/roles';

export function RoleSwitcher() {
  const { currentUser, switchRole } = useUser();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole;
    switchRole(role);
  };

  return (
    <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-4 md:items-center">
      {/* Role Selector */}
      <div className="relative">
        <label htmlFor="role-select" className="text-sm text-muted-foreground mb-1 block">Role</label>
        <select 
          id="role-select"
          value={currentUser?.role || 'zamestnanec'} 
          onChange={handleRoleChange}
          className="w-full min-w-[180px] bg-background border border-input rounded-md px-3 py-2 text-sm
                    focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring
                    transition-colors"
        >
          {Object.entries(ROLE_LABELS).map(([role, label]) => (
            <option key={role} value={role}>
              {label}
            </option>
          ))}
        </select>
      </div>
      
      {/* User Info */}
      {currentUser && (
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-muted rounded-md flex items-center justify-center">
            <span className="text-muted-foreground font-medium text-sm">
              {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">{currentUser.name}</p>
            {currentUser.department && (
              <p className="text-xs text-muted-foreground">{currentUser.department}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 