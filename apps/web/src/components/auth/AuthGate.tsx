'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div>
        <div>
          <h1>Edward-Kalendář</h1>
          <p>Načítám...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <div>
          <h1>Edward-Kalendář</h1>
          <p>Systém pro správu směn a mzdy</p>
        </div>
        
        <div>
          {showRegister ? (
            <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
          ) : (
            <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 