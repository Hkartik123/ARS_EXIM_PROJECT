import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Application } from '@/models/Application';
import { storageService } from '@/lib/storage/storage-service';
import { checkRateLimit } from '@/lib/security/rate-limiter';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

  const rateLimit = checkRateLimit(`apply-${ip}`, { windowMs: 60 * 60 * 1000, maxRequests: 5 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many submissions.' } },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();
    const jobId = formData.get('jobId') as string;
    const jobTitle = (formData.get('jobTitle') as string) || 'Industrial Position';
    const candidateName = formData.get('candidateName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const currentLocation = formData.get('currentLocation') as string;
    const yearsOfExperience = parseInt((formData.get('yearsOfExperience') as string) || '0', 10);
    const coverLetter = (formData.get('coverLetter') as string) || undefined;
    const file = formData.get('resume') as File;

    if (!candidateName || !email || !phone || !currentLocation || !file) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'All required fields and resume must be supplied.' } },
        { status: 400 }
      );
    }

    const validation = storageService.validateFile({
      size: file.size,
      type: file.type,
      name: file.name,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: { code: 'FILE_VALIDATION_ERROR', message: validation.error } },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploaded = await storageService.uploadBuffer(buffer, file.name, file.type, 'resumes');

    await connectToDatabase();
    const application = await Application.create({
      jobId: jobId || undefined,
      jobTitle,
      candidateName,
      email,
      phone,
      currentLocation,
      yearsOfExperience,
      resumeStorageKey: uploaded.storageKey,
      resumeOriginalName: uploaded.originalName,
      coverLetter,
      status: 'SUBMITTED',
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          applicationId: application._id,
          message: 'Application registered successfully.',
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Candidate application error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message || 'Application submission failed.' } },
      { status: 500 }
    );
  }
}
