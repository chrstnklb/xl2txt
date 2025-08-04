// Next.js API route for error handling
import { NextResponse } from 'next/server';
import { ErrorList } from '../../lib/error';

export async function GET() {
  // Example: return all errors
  return NextResponse.json({ errors: ErrorList.getInstance().getAll() });
}
