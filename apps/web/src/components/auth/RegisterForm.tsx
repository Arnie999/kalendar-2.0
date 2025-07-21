'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PREDEFINED_EMPLOYEES, type PredefinedEmployee, type UserRole } from '@/types/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [availableEmployees, setAvailableEmployees] = useState<PredefinedEmployee[]>([]);
  const [validationError, setValidationError] = useState<string>('');
  
  const { registerWithEmail, loading, error } = useAuth();

  // Load available employees on component mount
  useEffect(() => {
    loadAvailableEmployees();
  }, []);

  const loadAvailableEmployees = async () => {
    try {
      const available = [];
      for (const employee of PREDEFINED_EMPLOYEES) {
        const employeeDoc = await getDoc(doc(db, 'predefined-employees', employee.id));
        const data = employeeDoc.data();
        if (!data || data.isAvailable !== false) {
          available.push(employee);
        }
      }
      setAvailableEmployees(available);
    } catch (error) {
      console.error('Error loading available employees:', error);
      // Fallback to all employees if Firestore fails
      setAvailableEmployees(PREDEFINED_EMPLOYEES);
    }
  };

  const validateForm = (): boolean => {
    if (password !== confirmPassword) {
      setValidationError('Hesla se neshodují');
      return false;
    }
    
    if (password.length < 6) {
      setValidationError('Heslo musí mít alespoň 6 znaků');
      return false;
    }
    
    if (role === 'employee' && !selectedEmployee) {
      setValidationError('Vyberte svou pozici ze seznamu');
      return false;
    }
    
    setValidationError('');
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const selectedEmployeeData = role === 'employee' 
      ? availableEmployees.find(emp => emp.id === selectedEmployee)
      : undefined;

    const result = await registerWithEmail(
      { email, password, role, employeeSelection: selectedEmployee },
      selectedEmployeeData
    );

    if (result.success) {
      // Registration successful, user will be automatically logged in
    }
  };

  return (
    <div>
      <h2>Registrace</h2>
      
      {(error || validationError) && (
        <div>
          <p>Chyba: {error || validationError}</p>
        </div>
      )}

      <form onSubmit={handleRegister}>
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
              minLength={6}
            />
          </label>
        </div>

        <div>
          <label>
            Potvrzení hesla:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </label>
        </div>

        <div>
          <label>Role:</label>
          <div>
            <label>
              <input
                type="radio"
                value="boss"
                checked={role === 'boss'}
                onChange={(e) => setRole(e.target.value as UserRole)}
                disabled={loading}
              />
              Vedoucí (Boss)
            </label>
            <label>
              <input
                type="radio"
                value="employee"
                checked={role === 'employee'}
                onChange={(e) => setRole(e.target.value as UserRole)}
                disabled={loading}
              />
              Zaměstnanec
            </label>
          </div>
        </div>

        {role === 'employee' && (
          <div>
            <label>
              Vyberte svou pozici:
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">-- Vyberte zaměstnance --</option>
                {availableEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} {employee.station && `- ${employee.station}`}
                  </option>
                ))}
              </select>
            </label>
            
            {availableEmployees.length === 0 && (
              <p>Žádní volní zaměstnanci nejsou k dispozici.</p>
            )}
          </div>
        )}

        <button type="submit" disabled={loading || (role === 'employee' && !selectedEmployee)}>
          {loading ? 'Registruji...' : 'Registrovat se'}
        </button>
      </form>

      <div>
        <p>
          Již máte účet?{' '}
          <button onClick={onSwitchToLogin}>
            Přihlásit se
          </button>
        </p>
      </div>
    </div>
  );
} 