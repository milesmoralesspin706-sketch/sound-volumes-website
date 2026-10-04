import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAuthenticatedAdmin } from '@/lib/auth-server';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

// GET: List all available images (uploads + library images)
export async function GET() {
  const auth = await getAuthenticatedAdmin();
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const libraryImages: string[] = [];
  const uploadedImages: string[] = [];

  try {
    if (fs.existsSync(IMAGES_DIR)) {
      const files = fs.readdirSync(IMAGES_DIR);
      files.forEach((file) => {
        if (/\.(jpg|jpeg|png|webp|svg|gif)$/i.test(file)) {
          libraryImages.push(`/images/${file}`);
        }
      });
    }
  } catch (err) {
    console.error('Error reading images directory:', err);
  }

  try {
    if (fs.existsSync(UPLOADS_DIR)) {
      const files = fs.readdirSync(UPLOADS_DIR);
      files.forEach((file) => {
        if (/\.(jpg|jpeg|png|webp|svg|gif)$/i.test(file)) {
          uploadedImages.push(`/uploads/${file}`);
        }
      });
    }
  } catch (err) {
    console.error('Error reading uploads directory:', err);
  }

  return NextResponse.json({
    libraryImages,
    uploadedImages
  });
}

// POST: Upload a new image
export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedAdmin();
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized: Session required to upload images.' },
      { status: 401 }
    );
  }

  try {
    // Ensure uploads directory exists
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const contentType = req.headers.get('content-type') || '';

    // Case 1: multipart/form-data
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No file provided in form data.' }, { status: 400 });
      }

      // Check mime type
      const mime = file.type || '';
      if (!mime.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Invalid file type. Only image files (JPG, PNG, WEBP, SVG, GIF) are allowed.' },
          { status: 400 }
        );
      }

      // Max file size: 10MB
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size exceeds 10MB limit.' }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const rawExt = path.extname(file.name) || '.jpg';
      const cleanExt = rawExt.toLowerCase().replace(/[^a-z0-9.]/g, '');
      const baseName = path.basename(file.name, rawExt).toLowerCase().replace(/[^a-z0-9_-]/g, '_').slice(0, 30);
      const fileName = `${baseName || 'image'}_${Date.now()}${cleanExt}`;
      const destPath = path.join(UPLOADS_DIR, fileName);

      fs.writeFileSync(destPath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${fileName}`,
        fileName
      });
    }

    // Case 2: JSON payload with base64 dataUrl
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { dataUrl, filename } = body;

      if (!dataUrl || typeof dataUrl !== 'string') {
        return NextResponse.json({ error: 'Invalid or missing dataUrl.' }, { status: 400 });
      }

      const matches = dataUrl.match(/^data:(image\/([a-zA-Z0-9+.-]+));base64,(.+)$/);
      if (!matches) {
        return NextResponse.json({ error: 'Invalid base64 image data URL format.' }, { status: 400 });
      }

      const mimeSub = matches[2].toLowerCase();
      let ext = '.jpg';
      if (mimeSub === 'png') ext = '.png';
      else if (mimeSub === 'webp') ext = '.webp';
      else if (mimeSub === 'svg+xml' || mimeSub === 'svg') ext = '.svg';
      else if (mimeSub === 'gif') ext = '.gif';

      const buffer = Buffer.from(matches[3], 'base64');
      const safeBase = (filename || 'uploaded')
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '_')
        .slice(0, 30);
      const fileName = `${safeBase}_${Date.now()}${ext}`;
      const destPath = path.join(UPLOADS_DIR, fileName);

      fs.writeFileSync(destPath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${fileName}`,
        fileName
      });
    }

    return NextResponse.json({ error: 'Unsupported Content-Type.' }, { status: 400 });
  } catch (error) {
    console.error('Image Upload Error:', error);
    return NextResponse.json({ error: 'Failed to process image upload.' }, { status: 500 });
  }
}
