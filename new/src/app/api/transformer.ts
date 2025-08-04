// Next.js API route for transformer logic
import { NextRequest, NextResponse } from 'next/server';
import { transformData } from '../../lib/transformer';

export async function POST(req: NextRequest) {
  // Example: transform data (implementation needed in lib/transformer)
  const data = await req.json();
  const result = await transformData(data);
  return NextResponse.json(result);
}
