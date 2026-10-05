import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth-server';
import { supabaseServer } from '@/lib/supabase-server';

const STORAGE_BUCKET = 'cms-images';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function sanitizeFileName(name: string) {
  const ext = name.includes('.') ? name.substring(name.lastIndexOf('.')).toLowerCase() : '.jpg';
  const base = name
    .substring(0, name.length - ext.length)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .slice(0, 40);

  return `${base || 'image'}_${Date.now()}${ext}`;
}

// GET: List available uploaded images
export async function GET() {
  const auth = await getAuthenticatedAdmin();

  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const libraryImages: string[] = [];
  const storageImages: string[] = [];

  try {
    const { data, error } = await supabaseServer.storage
      .from(STORAGE_BUCKET)
      .list('', {
        limit: 1000,
        sortBy: {
          column: 'name',
          order: 'desc',
        },
      });

    if (error) {
      console.error('Failed to list Supabase Storage images:', error);
    } else {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

      if (supabaseUrl) {
        for (const file of data || []) {
          if (/\.(jpg|jpeg|png|webp|svg|gif)$/i.test(file.name)) {
            storageImages.push(
              `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${file.name}`
            );
          }
        }
      }
    }
  } catch (err) {
    console.error('Error reading Supabase Storage images:', err);
  }

  return NextResponse.json({
    libraryImages,
    uploadedImages: storageImages,
  });
}

// POST: Create a signed Supabase Storage upload URL
export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedAdmin();

  if (!auth.authenticated) {
    return NextResponse.json(
      {
        error: 'Unauthorized: Session required to upload images.',
      },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { action, filename, contentType, size } = body;

    if (action !== 'create_signed_upload') {
      return NextResponse.json(
        { error: 'Invalid upload action.' },
        { status: 400 }
      );
    }

    if (!filename || typeof filename !== 'string') {
      return NextResponse.json(
        { error: 'A valid filename is required.' },
        { status: 400 }
      );
    }

    if (!contentType || typeof contentType !== 'string' || !contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed.' },
        { status: 400 }
      );
    }

    if (typeof size === 'number' && size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Image must be under 10MB.' },
        { status: 400 }
      );
    }

    const fileName = sanitizeFileName(filename);

    const { data, error } = await supabaseServer.storage
      .from(STORAGE_BUCKET)
      .createSignedUploadUrl(fileName);

    if (error || !data) {
      console.error('Failed to create signed upload URL:', error);

      return NextResponse.json(
        {
          error: error?.message || 'Failed to prepare image upload.',
        },
        { status: 500 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      return NextResponse.json(
        { error: 'Missing Supabase URL configuration.' },
        { status: 500 }
      );
    }

    const publicUrl =
      `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${fileName}`;

    return NextResponse.json({
      success: true,
      path: data.path,
      token: data.token,
      publicUrl,
    });
  } catch (error) {
    console.error('Image Upload Preparation Error:', error);

    return NextResponse.json(
      { error: 'Failed to prepare image upload.' },
      { status: 500 }
    );
  }
}