export type UserRole = 'boss' | 'employee';

export type EmployeeStation = 
  | 'kuchyň' 
  | 'bar' 
  | 'plac' 
  | 'zmrzlina'
  | '';

export interface PredefinedEmployee {
  id: string;
  name: string;
  station: EmployeeStation;
  isAvailable: boolean; // false if already registered
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  employeeData?: {
    predefinedId: string;
    name: string;
    station: EmployeeStation;
  };
}

export interface RegistrationData {
  email: string;
  password: string;
  role: UserRole;
  employeeSelection?: string; // predefined employee ID for employees
}

export const PREDEFINED_EMPLOYEES: PredefinedEmployee[] = [
  { id: 'radka-kuchyn', name: 'Radka', station: 'kuchyň', isAvailable: true },
  { id: 'hanka-bar', name: 'Hanka', station: 'bar', isAvailable: true },
  { id: 'stepan-bar', name: 'Štěpán', station: 'bar', isAvailable: true },
  { id: 'tereza-plac', name: 'Tereza', station: '', isAvailable: true },
  { id: 'dominika-plac', name: 'Dominika', station: '', isAvailable: true },
  { id: 'aneta-plac', name: 'Aneta', station: 'plac', isAvailable: true },
  { id: 'oksana-plac', name: 'Oksana', station: 'plac', isAvailable: true },
  { id: 'adelka-zmrzlina', name: 'Adélka', station: 'zmrzlina', isAvailable: true },
  { id: 'natalie-zmrzlina', name: 'Natálie', station: 'zmrzlina', isAvailable: true },
  { id: 'kaja-zmrzlina', name: 'Kája', station: 'zmrzlina', isAvailable: true },
  { id: 'tomas-bar', name: 'Tomáš', station: 'bar', isAvailable: true },
  { id: 'kamila-plac', name: 'Kamila', station: 'plac', isAvailable: true },
]; 