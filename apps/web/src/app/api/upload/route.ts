import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

interface Shift {
  date: string;
  employee: string;
  hours: number;
  tips: number;
  bonus: number;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const wb = XLSX.read(buffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(ws, { header: 1 });

    const [headerRow, ...rows] = json as (string | number)[][];

    // Detect matrix format (days as headers)
    const isMatrix = typeof headerRow[1] !== 'undefined' && String(headerRow[1]).trim() === '1';
    const shifts: Shift[] = [];

    if (isMatrix) {
      const days = headerRow.slice(1).map((d) => parseInt(String(d)));
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      rows.forEach((row) => {
        const employee = String(row[0] || '').trim();
        if (!employee) return;
        days.forEach((day, idx) => {
          const cell = row[idx + 1];
          if (cell === '' || cell === undefined) return;
          let hours = 8;
          const num = parseFloat(String(cell));
          if (!isNaN(num)) hours = num;
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          shifts.push({ date: dateStr, employee, hours, tips: 0, bonus: 0 });
        });
      });
    } else {
      // Expect column format with headers
      const colMap: Record<string, number> = {};
      headerRow.forEach((h, i) => {
        const key = String(h).toLowerCase();
        colMap[key] = i;
      });
      rows.forEach((row) => {
        const date = String(row[colMap['date']] || '');
        const employee = String(row[colMap['employee']] || '');
        const hours = parseFloat(String(row[colMap['hours']] || '0')) || 0;
        const tips = parseFloat(String(row[colMap['tips']] || '0')) || 0;
        const bonus = parseFloat(String(row[colMap['bonus']] || '0')) || 0;
        if (!date || !employee) return;
        shifts.push({ date, employee, hours, tips, bonus });
      });
    }

    return NextResponse.json({ shifts });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Parse error' }, { status: 500 });
  }
} 