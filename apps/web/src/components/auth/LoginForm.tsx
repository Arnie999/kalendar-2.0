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
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-8">Přihlášení</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">Chyba: {error}</p>
        </div>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            placeholder="vas@email.cz"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Heslo
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50"
        >
          {loading ? 'Přihlašuji...' : 'Přihlásit se'}
        </button>
      </form>

      <div className="my-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">nebo</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          className="w-full btn-secondary flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <span className="text-lg">🔍</span>
          Přihlásit se přes Google
        </button>
        
        <button 
          onClick={handleAppleLogin} 
          disabled={loading}
          className="w-full btn-secondary flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <span className="text-lg">🍎</span>
          Přihlásit se přes Apple ID
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Nemáte účet?{' '}
          <button 
            onClick={onSwitchToRegister}
            className="text-primary hover:underline font-medium"
          >
            Registrovat se
          </button>
        </p>
      </div>
    </div>
  );
} 