import { prisma } from '@/lib/db/prisma';
import { NextResponse } from 'next/server';
import { toPublicProjectRecord } from '@/lib/projects/normalize';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
    where: {
      isDeleted: false,
      OR: [{ published: true }, { publishStatus: 'PUBLISHED' }],
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  });

    return NextResponse.json({
      success: true,
      data: {
        projects: projects.map(toPublicProjectRecord),
      },
    });
  } catch (error: any) {
    console.error('Failed to load public projects API:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Unable to load projects at the moment. Please try again later.' } },
      { status: 500 }
    );
  }
}
