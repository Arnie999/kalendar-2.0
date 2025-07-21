#!/usr/bin/env node
/*
  convert-shifts.js
  ------------------
  Usage:
    pnpm convert-shifts <path-to-xlsx>

  Example:
    pnpm convert-shifts "sample-data/směny červenec .xlsx"

  The script reads the provided Excel workbook and creates a JSON file next to it.
  For the sample July 2025 sheet it will output:
    sample-data/shifts-july-2025.json

  Output format:
    [
      { "name": "Radka", "station": "kuchyň", "date": "2025-07-03" },
      ...
    ]
*/

import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

/**
 * Determine the default year & month to use when the matrix sheet only
 * contains day numbers (1..31). We fall back to July 2025 because that is
 * what the existing sample JSON represents. You can override this via the
 * YEAR or MONTH environment variables (1-based month).
 */
function getDefaultYearMonth() {
  const year = parseInt(process.env.YEAR ?? '2025', 10);
  const month = parseInt(process.env.MONTH ?? '7', 10); // July (1-based)
  return { year, month };
}

/**
 * Convert an Excel workbook (matrix or column format) to JSON array.
 *
 * Supported formats:
 * 1. Matrix – first row has blank/"name" then 1..31, each subsequent row is an
 *    employee with presence marker or hours. The worksheet name is used as
 *    the `station` (lower-cased).
 * 2. Column – first row are headers. We look for columns containing
 *    name/employee, station and date.
 */
function workbookToShifts(workbook, defaults) {
  const result = [];
  workbook.SheetNames.forEach((sheetName) => {
    const ws = workbook.Sheets[sheetName];
    if (!ws) return;

    const rows = XLSX.utils.sheet_to_json(ws, {
      header: 1,
      blankrows: false,
    });
    if (rows.length === 0) return;

    const headerRow = rows[0].map((c) => String(c ?? '').trim());
    // Heuristic: if cells 2-4 are 1,2,3 => matrix format
    const looksLikeMatrix = headerRow.length > 3 && headerRow.slice(1, 4).every((val, idx) => {
      const n = parseInt(String(val).replace(/\D/g, ''), 10);
      return !Number.isNaN(n) && n === idx + 1;
    });

    if (looksLikeMatrix) {
      const days = headerRow.slice(1).map((d) => parseInt(String(d).replace(/\D/g, ''), 10));
      const station = sheetName.toLowerCase();
      const { year, month } = defaults;

      rows.slice(1).forEach((row) => {
        const name = String(row[0] ?? '').trim();
        if (!name) return;
        days.forEach((day, idx) => {
          const cell = row[idx + 1];
          if (cell === undefined || cell === null || cell === '' || cell === 0) return;

          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          result.push({ name, station, date: dateStr });
        });
      });
    } else {
      // Column format
      const colMap = {};
      headerRow.forEach((h, i) => {
        const key = h.toLowerCase();
        if (['name', 'employee', 'zaměstnanec', 'zamestnanec'].some((k) => key.includes(k))) colMap.name = i;
        if (['station', 'stanice', 'role', 'pracoviště', 'pracoviste'].some((k) => key.includes(k))) colMap.station = i;
        if (['date', 'datum', 'day', 'den'].some((k) => key.includes(k))) colMap.date = i;
      });
      rows.slice(1).forEach((row) => {
        const name = String(row[colMap.name] ?? '').trim();
        const station = String(row[colMap.station] ?? '').trim();
        const rawDate = row[colMap.date];

        let dateStr = '';
        if (typeof rawDate === 'number') {
          const d = XLSX.SSF.parse_date_code(rawDate);
          dateStr = `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`;
        } else if (rawDate) {
          const parsed = new Date(String(rawDate));
          if (!Number.isNaN(parsed.getTime())) {
            dateStr = parsed.toISOString().split('T')[0];
          }
        }
        if (name && dateStr) {
          result.push({ name, station, date: dateStr });
        }
      });
    }
  });
  return result;
}

function main() {
  const [, , inputPathArg] = process.argv;
  const inputPath = inputPathArg || path.join('sample-data', 'směny červenec .xlsx');

  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const workbook = XLSX.readFile(inputPath);
  const defaults = getDefaultYearMonth();
  const shifts = workbookToShifts(workbook, defaults);

  if (shifts.length === 0) {
    console.error('No shift rows detected – nothing to write.');
    process.exit(1);
  }

  // Determine output file name (hard-coded for the sample)
  const outputPath = path.join(path.dirname(inputPath), 'shifts-july-2025.json');
  fs.writeFileSync(outputPath, JSON.stringify(shifts, null, 2), 'utf8');

  console.log(`✓ Wrote ${shifts.length} shifts to ${outputPath}`);
}

main(); 