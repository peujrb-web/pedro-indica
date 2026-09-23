import { NextResponse } from 'next/server';
import { getPublicContent } from '@/lib/server-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const content = getPublicContent();
  return NextResponse.json(content, {
    headers: {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
    },
  });
}
