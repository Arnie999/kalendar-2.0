'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithEmail, signInWithGoogle, signInWithApple, loading, error } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signInWithEmail(email, password);
    if (result.success) {
      // Redirect will happen automatically via useAuth
    }
  };

  const handleGoogleLogin = async () => {
    const result = await signInWithGoogle();
    if (result.success && result.isNewUser) {
      // Redirect to role selection for new users
      onSwitchToRegister();
    }
  };

  const handleAppleLogin = async () => {
    const result = await signInWithApple();
    if (result.success && result.isNewUser) {
      // Redirect to role selection for new users
      onSwitchToRegister();
    }
  };

  return (
    <div>
      <h2>Přihlášení</h2>
      
      {error && (
        <div>
          <p>Chyba: {error}</p>
        </div>
      )}

      <form onSubmit={handleEmailLogin}>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </label>
        </div>

        <div>
          <label>
            Heslo:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Přihlašuji...' : 'Přihlásit se'}
        </button>
      </form>

      <div>
        <p>nebo</p>
        
        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
        >
          🔍 Přihlásit se přes Google
        </button>
        
        <button 
          onClick={handleAppleLogin} 
          disabled={loading}
        >
          🍎 Přihlásit se přes Apple ID
        </button>
      </div>

      <div>
        <p>
          Nemáte účet?{' '}
          <button onClick={onSwitchToRegister}>
            Registrovat se
          </button>
        </p>
      </div>
    </div>
  );
} 