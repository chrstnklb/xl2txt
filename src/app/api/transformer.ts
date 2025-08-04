// Next.js API route for transformer logic
import { NextRequest, NextResponse } from 'next/server';
import { transformData } from '../../lib/transformer';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await transformData(data); // Pass data to the transformer
  return NextResponse.json(result);
}
