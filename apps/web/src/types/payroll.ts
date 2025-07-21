export interface Employee {
  id: string;
  name: string;
  email?: string;
}

export interface WorkEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  employeeId: string;
  employeeName: string;
  hours: number;
  tips: number; // in CZK
  bonus: number; // in CZK
}

export interface PayrollSummary {
  id: string; // YYYY-MM format
  month: string;
  totalHours: number;
  totalTips: number;
  totalBonus: number;
  employeeSummaries: EmployeeSummary[];
}

export interface EmployeeSummary {
  employeeId: string;
  employeeName: string;
  totalHours: number;
  totalTips: number;
  totalBonus: number;
  totalCost: number;
}

export interface ShiftImportData {
  date: string;
  employee: string;
  hours: number;
  tips: number;
  bonus: number;
}

export interface ImportPreviewData {
  isValid: boolean;
  data: ShiftImportData[];
  errors: string[];
  unknownEmployees: string[];
} 