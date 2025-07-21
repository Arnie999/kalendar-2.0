export type UserRole = 'boss' | 'zamestnanec' | 'bar' | 'zmrzlina' | 'kuchyn' | 'mycka';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department?: string;
}

export interface RolePermissions {
  canViewAll: boolean;
  canEditAll: boolean;
  canViewOwnData: boolean;
  canEditHours: boolean;
  canEditTips: boolean;
  canEditBonus: boolean;
  canEditSalary: boolean;
  canImportData: boolean;
  canExportData: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  boss: {
    canViewAll: true,
    canEditAll: true,
    canViewOwnData: true,
    canEditHours: true,
    canEditTips: true,
    canEditBonus: true,
    canEditSalary: true,
    canImportData: true,
    canExportData: true,
  },
  zamestnanec: {
    canViewAll: false,
    canEditAll: false,
    canViewOwnData: true,
    canEditHours: true,
    canEditTips: true,
    canEditBonus: true,
    canEditSalary: true,
    canImportData: false,
    canExportData: false,
  },
  bar: {
    canViewAll: false,
    canEditAll: false,
    canViewOwnData: true,
    canEditHours: true,
    canEditTips: true,
    canEditBonus: true,
    canEditSalary: false,
    canImportData: false,
    canExportData: false,
  },
  zmrzlina: {
    canViewAll: false,
    canEditAll: false,
    canViewOwnData: true,
    canEditHours: true,
    canEditTips: false,
    canEditBonus: true,
    canEditSalary: false,
    canImportData: false,
    canExportData: false,
  },
  kuchyn: {
    canViewAll: false,
    canEditAll: false,
    canViewOwnData: true,
    canEditHours: true,
    canEditTips: false,
    canEditBonus: true,
    canEditSalary: false,
    canImportData: false,
    canExportData: false,
  },
  mycka: {
    canViewAll: false,
    canEditAll: false,
    canViewOwnData: true,
    canEditHours: true,
    canEditTips: false,
    canEditBonus: true,
    canEditSalary: false,
    canImportData: false,
    canExportData: false,
  },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  boss: 'Boss',
  zamestnanec: 'Zaměstnanec',
  bar: 'Bar',
  zmrzlina: 'Zmrzlina',
  kuchyn: 'Kuchyň',
  mycka: 'Myčka',
}; 