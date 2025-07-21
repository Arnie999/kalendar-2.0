import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Shift data coming from the client (before Firestore conversion)
const ShiftSchema = z.object({
  empName: z.string().min(1),
  date: z.string().min(1),
  hours: z.number(),
  tips: z.number(),
  bonus: z.number()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = z.array(ShiftSchema).parse(body);

    // TODO: Connect to Firestore and batch insert.
    // Keeping implementation minimal for now – we only validate payload.
    console.log(`Received ${data.length} shift records for import.`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
} 