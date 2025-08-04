// Next.js API route for statistics
import { NextResponse } from 'next/server';
import { getStatistics } from '../../lib/statistics';

export async function GET() {
  // Example: return statistics (implementation needed in lib/statistics)
  const stats = await getStatistics();
  return NextResponse.json({ stats });
}
