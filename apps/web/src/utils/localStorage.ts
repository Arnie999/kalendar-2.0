import type { WorkEntry } from '@/types/payroll';

const STORAGE_KEY = 'edward-kalendar-work-entries';

export interface MonthlyData {
  month: number;
  year: number;
  entries: WorkEntry[];
  lastModified: string;
}

export interface StoredData {
  [monthYearKey: string]: MonthlyData; // e.g., "2025-07", "2025-08"
}

function getMonthYearKey(month: number, year: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function saveWorkEntries(entries: WorkEntry[], month: number, year: number): void {
  try {
    const existingData = loadAllData();
    const monthKey = getMonthYearKey(month, year);
    
    existingData[monthKey] = {
      month,
      year,
      entries,
      lastModified: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
    console.log(`✓ Saved ${entries.length} entries for ${month}/${year}`);
  } catch (error) {
    console.error('Failed to save work entries:', error);
  }
}

export function loadWorkEntries(month: number, year: number): WorkEntry[] {
  try {
    const allData = loadAllData();
    const monthKey = getMonthYearKey(month, year);
    return allData[monthKey]?.entries || [];
  } catch (error) {
    console.error('Failed to load work entries:', error);
    return [];
  }
}

export function loadAllData(): StoredData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load stored data:', error);
    return {};
  }
}

export function getAvailableMonths(): Array<{ month: number; year: number; entryCount: number; lastModified: string }> {
  try {
    const allData = loadAllData();
    return Object.values(allData)
      .map(data => ({
        month: data.month,
        year: data.year,
        entryCount: data.entries.length,
        lastModified: data.lastModified
      }))
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year; // Newest year first
        return b.month - a.month; // Newest month first within year
      });
  } catch (error) {
    console.error('Failed to get available months:', error);
    return [];
  }
}

export function clearMonthData(month: number, year: number): void {
  try {
    const allData = loadAllData();
    const monthKey = getMonthYearKey(month, year);
    delete allData[monthKey];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    console.log(`✓ Cleared data for ${month}/${year}`);
  } catch (error) {
    console.error('Failed to clear month data:', error);
  }
} 