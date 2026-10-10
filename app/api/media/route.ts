import { prisma } from '@/lib/db/prisma';
import { withLegacyId } from '@/lib/db/legacy-id';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const media = await prisma.media.findMany({
    where: { isDeleted: false, isActive: true },
    orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      category: true,
      url: true,
      altText: true,
      caption: true,
      isFeatured: true,
      displayOrder: true,
    },
  });
    return NextResponse.json({ success: true, data: { media: media.map(withLegacyId) } });
  } catch (error) {
    console.error('Failed to load public gallery media:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Could not load gallery images.' } },
      { status: 500 }
    );
  }
}
