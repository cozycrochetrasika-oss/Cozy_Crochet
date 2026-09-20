import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { verifyAdminRequest } from '@/lib/auth/admin-session';

const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'video/mp4',
]);

const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.mp4']);

const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const MAX_VIDEO_SIZE_BYTES = 60 * 1024 * 1024; // 60MB

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'general';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 });
    }

    // 1. MIME Validation
    const mimeType = file.type.toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        { success: false, error: `Unsupported file type: ${mimeType}. Allowed: PNG, JPEG, WEBP, MP4.` },
        { status: 400 }
      );
    }

    // 2. Extension Validation
    const rawExt = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(rawExt)) {
      return NextResponse.json(
        { success: false, error: `Invalid file extension: ${rawExt}. Allowed: .png, .jpg, .jpeg, .webp, .mp4.` },
        { status: 400 }
      );
    }

    // 3. Size Limits
    const isVideo = mimeType.startsWith('video/') || rawExt === '.mp4';
    const maxSize = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
    if (file.size > maxSize) {
      const limitMb = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        { success: false, error: `File size exceeds ${limitMb}MB limit.` },
        { status: 400 }
      );
    }

    // 4. Safe Filename Generation
    const cleanBase = path.basename(file.name, rawExt).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 32);
    const uniqueId = crypto.randomUUID().slice(0, 8);
    const safeFilename = `${cleanBase}_${uniqueId}${rawExt}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const targetPath = path.join(uploadsDir, safeFilename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(targetPath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;

    return NextResponse.json({
      success: true,
      publicUrl,
      filename: safeFilename,
      mediaType: isVideo ? 'video' : 'image',
      sizeBytes: file.size,
    });
  } catch (error) {
    console.error('Error handling media upload:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload media file.' }, { status: 500 });
  }
}
