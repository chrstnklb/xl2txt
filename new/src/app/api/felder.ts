// Next.js API route for field (Felder) logic
import { NextRequest, NextResponse } from 'next/server';
import { getFelder } from '../../lib/felder';

export async function GET(req: NextRequest) {
  // Example: return field definitions
  const felder = getFelder();
  return NextResponse.json({ felder });
}
