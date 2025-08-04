// Next.js API route for field (Felder) logic
import { NextResponse } from 'next/server';
import { getFelder } from '@/lib/felder';

export async function GET() {
  // Provide the required argument, e.g., 'Sheet1'
  const felder = getFelder('Sheet1');
  return NextResponse.json({ felder });
}
