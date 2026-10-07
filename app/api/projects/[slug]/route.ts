import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Project } from '@/models/Project';
import { toPublicProjectRecord } from '@/lib/projects/normalize';

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    await connectToDatabase();
    const project = await Project.findOne({
      slug: params.slug,
      isDeleted: false,
      $or: [{ published: true }, { publishStatus: 'PUBLISHED' }],
    }).lean();

    if (!project) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { project: toPublicProjectRecord(project) } });
  } catch (error: any) {
    console.error(`Failed to load public project ${params.slug}:`, error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Unable to load this project at the moment. Please try again later.' } },
      { status: 500 }
    );
  }
}
