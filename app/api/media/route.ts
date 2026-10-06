import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Media } from '@/models/Media';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const media = await Media.find({ isDeleted: false, isActive: true })
      .sort({ isFeatured: -1, displayOrder: 1, createdAt: -1 })
      .select('title category url altText caption isFeatured displayOrder')
      .lean();
    return NextResponse.json({ success: true, data: { media } });
  } catch (error) {
    console.error('Failed to load public gallery media:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Could not load gallery images.' } },
      { status: 500 }
    );
  }
}
