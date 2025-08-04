// Next.js API route for Excel file handling
import { NextRequest, NextResponse } from 'next/server';
import { handleExcelUpload } from '../../lib/excel';

export async function POST(req: NextRequest) {
  // Example: handle Excel upload (implementation needed in lib/excel)
  const formData = await req.formData();
  const result = await handleExcelUpload(formData);
  return NextResponse.json(result);
}
