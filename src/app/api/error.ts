// Next.js API route for error handling
import { NextRequest, NextResponse } from 'next/server';
import { ErrorList } from '../../lib/error';

export async function GET(req: NextRequest) {
  // Example: return all errors
  return NextResponse.json({ errors: ErrorList.getInstance().getAll() });
}
