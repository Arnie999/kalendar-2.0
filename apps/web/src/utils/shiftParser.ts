import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import type { ShiftImportData, ImportPreviewData } from '@/types/payroll';

// Helper to take a header cell (e.g. "1", "1.", "1.7.") and return the day number (1-31).
const extractDayNumber = (header: string): number => {
  const match = String(header).trim().match(/^(\d{1,2})/);
  return match ? parseInt(match[1], 10) : NaN;
};

export function parseShiftSheet(file: File): Promise<ImportPreviewData> {
  return new Promise((resolve) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'csv') {
      parseCSV(file, resolve);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      parseXLSX(file, resolve);
    } else {
      resolve({
        isValid: false,
        data: [],
        errors: ['Unsupported file format. Please use .csv or .xlsx files.'],
        unknownEmployees: []
      });
    }
  });
}

function parseCSV(file: File, resolve: (result: ImportPreviewData) => void) {
  Papa.parse(file, {
    header: true,
    complete: (results) => {
      const processed = processRawData(results.data);
      resolve(processed);
    },
    error: (error) => {
      resolve({
        isValid: false,
        data: [],
        errors: [`CSV parsing error: ${error.message}`],
        unknownEmployees: []
      });
    }
  });
}

function parseXLSX(file: File, resolve: (result: ImportPreviewData) => void) {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Convert to object format
      const [headers, ...rows] = jsonData as any[][];
      const objectData = rows.map((row: any[]) => {
        const obj: any = {};
        headers.forEach((header: string, index: number) => {
          obj[header] = row[index];
        });
        return obj;
      });
      
      const processed = processRawData(objectData);
      resolve(processed);
    } catch (error) {
      resolve({
        isValid: false,
        data: [],
        errors: [`XLSX parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`],
        unknownEmployees: []
      });
    }
  };
  
  reader.readAsArrayBuffer(file);
}

function processRawData(rawData: any[]): ImportPreviewData {
  const errors: string[] = [];
  const data: ShiftImportData[] = [];
  const unknownEmployees: string[] = [];
  
  // Common field mappings
  const fieldMappings = {
    date: ['date', 'datum', 'day', 'den'],
    employee: ['employee', 'zamestnanec', 'name', 'jmeno', 'emp'],
    hours: ['hours', 'hodiny', 'time', 'cas'],
    tips: ['tips', 'spropitne', 'tip'],
    bonus: ['bonus', 'premia', 'odmen']
  };
  
  if (!rawData || rawData.length === 0) {
    errors.push('No data found in file');
    return { isValid: false, data: [], errors, unknownEmployees };
  }
  
  // Detect matrix (calendar) format: first header cell not mapped and following headers are sequential numbers 1..31
  const defaultHoursValue = 8;

  // updated isMatrixFormat
  const isMatrixFormat = () => {
    if (!Array.isArray(rawData) || rawData.length === 0) return false;
    const hdrs = Object.keys(rawData[0]);
    if (hdrs.length < 3) return false;

    // Ignore first header (employee/name)
    const maybeDays = hdrs.slice(1, 4).map(h => (h ?? '').toString().trim());

    // Accept headers that start with the day number (e.g., '1', '1.', '1.7.')
    return maybeDays.every((h, idx) => {
      const num = extractDayNumber(h);
      return !isNaN(num) && num === idx + 1;
    });
  };

  if (isMatrixFormat()) {
    return convertMatrixToShifts(rawData);
  }

  // Find column mappings
  const headers = Object.keys(rawData[0] || {}).map(h => h.toLowerCase());
  const columnMap: Record<string, string> = {};
  
  for (const [field, possibleNames] of Object.entries(fieldMappings)) {
    const found = headers.find(h => possibleNames.some(name => h.includes(name)));
    if (found) {
      columnMap[field] = Object.keys(rawData[0]).find(k => k.toLowerCase() === found) || '';
    }
  }
  
  // Validate required columns
  const requiredFields = ['date', 'employee', 'hours'];
  const missingFields = requiredFields.filter(field => !columnMap[field]);
  
  if (missingFields.length > 0) {
    errors.push(`Missing required columns: ${missingFields.join(', ')}`);
    return { isValid: false, data: [], errors, unknownEmployees };
  }
  
  // Process each row
  rawData.forEach((row, index) => {
    try {
      const shiftData: ShiftImportData = {
        date: parseDate(row[columnMap.date]),
        employee: String(row[columnMap.employee] || '').trim(),
        hours: parseNumber(row[columnMap.hours]),
        tips: parseNumber(row[columnMap.tips]) || 0,
        bonus: parseNumber(row[columnMap.bonus]) || 0
      };
      
      // Validate data
      if (!shiftData.date) {
        errors.push(`Row ${index + 1}: Invalid date format`);
        return;
      }
      
      if (!shiftData.employee) {
        errors.push(`Row ${index + 1}: Missing employee name`);
        return;
      }
      
      if (shiftData.hours <= 0) {
        errors.push(`Row ${index + 1}: Invalid hours value`);
        return;
      }
      
      data.push(shiftData);
      
      // Track unknown employees (this would be checked against actual employee database)
      if (!unknownEmployees.includes(shiftData.employee)) {
        unknownEmployees.push(shiftData.employee);
      }
    } catch (error) {
      errors.push(`Row ${index + 1}: ${error instanceof Error ? error.message : 'Processing error'}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    data,
    errors,
    unknownEmployees
  };
}

function parseDate(value: any): string {
  if (!value) return '';
  
  // Handle Excel date numbers
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  }
  
  // Handle string dates
  const dateStr = String(value);
  const date = new Date(dateStr);
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  return date.toISOString().split('T')[0];
}

function parseNumber(value: any): number {
  if (typeof value === 'number') return value;
  const num = parseFloat(String(value).replace(/[^\d.-]/g, ''));
  return isNaN(num) ? 0 : num;
} 

function convertMatrixToShifts(matrixData: any[]): ImportPreviewData {
  const defaultHoursValue = 8;
  const shifts: ShiftImportData[] = [];
  const errors: string[] = [];
  const unknownEmployees: string[] = [];

  if (!matrixData.length) {
    return { isValid: false, data: [], errors: ['Empty matrix data'], unknownEmployees };
  }

  const headers = Object.keys(matrixData[0]);
  // Assume first header is employee, rest are days 1..31
  const dayHeaders = headers.slice(1);

  // Try to detect month/year from matrixData meta or fallback to current month
  // We'll default to July 2025 if filename contains červenec else current month
  const defaultYear = new Date().getFullYear();
  const defaultMonth = new Date().getMonth() + 1; // 1-based

  matrixData.forEach((row, rowIdx) => {
    const employeeRaw = String(row[headers[0]] || '').trim();
    if (!employeeRaw) return; // skip empty rows
    const employee = employeeRaw;

    dayHeaders.forEach(dayHeader => {
      const dayValue = row[dayHeader];
      if (dayValue === undefined || dayValue === null || dayValue === '' || dayValue === 0) return;

      // Determine date
      const dayNumber = extractDayNumber(String(dayHeader));
      if (isNaN(dayNumber)) return;
      const month = defaultMonth;
      const year = defaultYear;
      const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(dayNumber).padStart(2,'0')}`;

      // Interpret hours: if numeric use directly else assume 8
      let hours = defaultHoursValue;
      if (typeof dayValue === 'number' && !isNaN(dayValue)) {
        hours = dayValue;
      } else if (typeof dayValue === 'string') {
        const numeric = parseFloat(dayValue);
        if (!isNaN(numeric)) {
          hours = numeric;
        } else {
          // treat any non-empty string (p, x) as defaultHoursValue
          hours = defaultHoursValue;
        }
      }

      const shift: ShiftImportData = {
        date: dateStr,
        employee,
        hours,
        tips: 0,
        bonus: 0,
      };
      shifts.push(shift);

      if (!unknownEmployees.includes(employee)) unknownEmployees.push(employee);
    });
  });

  return {
    isValid: errors.length === 0,
    data: shifts,
    errors,
    unknownEmployees,
  };
} 