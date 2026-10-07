import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Project } from '@/models/Project';
import { toPublicProjectRecord } from '@/lib/projects/normalize';

export async function GET() {
  try {
    await connectToDatabase();
    const projects = await Project.find({
      isDeleted: false,
      $or: [{ published: true }, { publishStatus: 'PUBLISHED' }],
    })
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean();

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
