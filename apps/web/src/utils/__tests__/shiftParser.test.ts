import { describe, it, expect, vi } from 'vitest';
import { parseShiftSheet } from '../shiftParser';

// Mock Papa parse
vi.mock('papaparse', () => ({
  default: {
    parse: vi.fn((file, options) => {
      // Mock CSV data
      const mockCsvData = [
        { date: '2025-01-15', employee: 'Jan Novák', hours: '8', tips: '150', bonus: '200' },
        { date: '2025-01-16', employee: 'Marie Svobodová', hours: '6', tips: '120', bonus: '100' }
      ];
      
      setTimeout(() => {
        options.complete({ data: mockCsvData });
      }, 0);
    })
  }
}));

// Mock XLSX
vi.mock('xlsx', () => ({
  read: vi.fn(() => ({
    SheetNames: ['Sheet1'],
    Sheets: {
      Sheet1: {}
    }
  })),
  utils: {
    sheet_to_json: vi.fn(() => [
      ['Date', 'Employee', 'Hours', 'Tips', 'Bonus'],
      ['2025-01-15', 'Jan Novák', 8, 150, 200],
      ['2025-01-16', 'Marie Svobodová', 6, 120, 100]
    ])
  },
  SSF: {
    parse_date_code: vi.fn((dateNum) => ({
      y: 2025,
      m: 1,
      d: 15
    }))
  }
}));

describe('parseShiftSheet', () => {
  it('should parse CSV file successfully', async () => {
    const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' });
    
    const result = await parseShiftSheet(mockFile);
    
    expect(result.isValid).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.data[0]).toEqual({
      date: '2025-01-15',
      employee: 'Jan Novák',
      hours: 8,
      tips: 150,
      bonus: 200
    });
    expect(result.errors).toHaveLength(0);
  });

  it('should parse XLSX file successfully', async () => {
    const mockFile = new File(['test'], 'test.xlsx', { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const result = await parseShiftSheet(mockFile);
    
    expect(result.isValid).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject unsupported file formats', async () => {
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    const result = await parseShiftSheet(mockFile);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Unsupported file format. Please use .csv or .xlsx files.');
    expect(result.data).toHaveLength(0);
  });

  it('should validate required columns', async () => {
    // Mock invalid CSV data missing required columns
    const Papa = await import('papaparse');
    vi.mocked(Papa.default.parse).mockImplementationOnce((file, options) => {
      const invalidData = [
        { name: 'Jan Novák', tips: '150' } // missing date and hours
      ];
      setTimeout(() => {
        options.complete({ data: invalidData });
      }, 0);
    });

    const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' });
    
    const result = await parseShiftSheet(mockFile);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(error => error.includes('Missing required columns'))).toBe(true);
  });

  it('should handle empty files', async () => {
    const Papa = await import('papaparse');
    vi.mocked(Papa.default.parse).mockImplementationOnce((file, options) => {
      setTimeout(() => {
        options.complete({ data: [] });
      }, 0);
    });

    const mockFile = new File([''], 'empty.csv', { type: 'text/csv' });
    
    const result = await parseShiftSheet(mockFile);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('No data found in file');
  });

  it('should validate data types and ranges', async () => {
    const Papa = await import('papaparse');
    vi.mocked(Papa.default.parse).mockImplementationOnce((file, options) => {
      const invalidData = [
        { date: 'invalid-date', employee: 'Jan Novák', hours: '-5', tips: '150', bonus: '200' },
        { date: '2025-01-15', employee: '', hours: '8', tips: '150', bonus: '200' }
      ];
      setTimeout(() => {
        options.complete({ data: invalidData });
      }, 0);
    });

    const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' });
    
    const result = await parseShiftSheet(mockFile);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some(error => error.includes('Invalid date format'))).toBe(true);
    expect(result.errors.some(error => error.includes('Missing employee name'))).toBe(true);
    expect(result.errors.some(error => error.includes('Invalid hours value'))).toBe(true);
  });

  it('should track unknown employees', async () => {
    const Papa = await import('papaparse');
    vi.mocked(Papa.default.parse).mockImplementationOnce((file, options) => {
      const dataWithUnknownEmployees = [
        { date: '2025-01-15', employee: 'Unknown Employee 1', hours: '8', tips: '150', bonus: '200' },
        { date: '2025-01-16', employee: 'Unknown Employee 2', hours: '6', tips: '120', bonus: '100' }
      ];
      setTimeout(() => {
        options.complete({ data: dataWithUnknownEmployees });
      }, 0);
    });

    const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' });
    
    const result = await parseShiftSheet(mockFile);
    
    expect(result.unknownEmployees).toContain('Unknown Employee 1');
    expect(result.unknownEmployees).toContain('Unknown Employee 2');
    expect(result.unknownEmployees).toHaveLength(2);
  });
}); 