import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAuthenticatedAdmin } from '@/lib/auth-server';
import { INITIAL_CMS_DATA } from '@/lib/initial-data';
import { CMSData } from '@/lib/types';

const CMS_DATA_FILE = path.join(process.cwd(), 'data', 'cms-data.json');

// Initialize server data from disk or fallback
function loadServerData(): CMSData {
  try {
    if (fs.existsSync(CMS_DATA_FILE)) {
      const raw = fs.readFileSync(CMS_DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.books && parsed.authors) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read CMS data from disk:', err);
  }
  return { ...INITIAL_CMS_DATA };
}

function saveServerData(data: CMSData) {
  try {
    const dir = path.dirname(CMS_DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CMS_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write CMS data to disk:', err);
  }
}

// Server-side cache
let serverCmsData: CMSData = loadServerData();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isPublic = searchParams.get('public') === 'true';

  // Always refresh from memory or disk
  if (!serverCmsData || !serverCmsData.books) {
    serverCmsData = loadServerData();
  }

  // If public request, return only published and visible content
  if (isPublic) {
    const publicData = {
      books: serverCmsData.books.filter(b => b.visibility),
      authors: serverCmsData.authors.filter(a => a.visibility),
      works: serverCmsData.works.filter(w => w.visibility),
      news: serverCmsData.news.filter(n => n.published && !n.archived),
      events: serverCmsData.events.filter(e => e.published && !e.archived),
      extras: serverCmsData.extras.filter(x => x.visibility),
      settings: serverCmsData.settings
    };
    return NextResponse.json(publicData);
  }

  // Private Administrative Access requires authenticated session!
  const auth = await getAuthenticatedAdmin();
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized: Author session required to access CMS data.' },
      { status: 401 }
    );
  }

  return NextResponse.json(serverCmsData);
}

export async function POST(req: NextRequest) {
  // STRICT AUTHORIZATION CHECK ON EVERY MUTATION
  const auth = await getAuthenticatedAdmin();
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized: Valid author administrator session required to perform mutations.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { action, payload } = body;

    if (action === 'save_all' && payload) {
      serverCmsData = payload;
      saveServerData(serverCmsData);
      return NextResponse.json({
        success: true,
        message: 'Content updated successfully and saved to persistent disk storage.',
        updatedBy: auth.email
      });
    }

    if (action === 'reset_to_defaults') {
      serverCmsData = { ...INITIAL_CMS_DATA };
      saveServerData(serverCmsData);
      return NextResponse.json({
        success: true,
        message: 'Content reset to Batch One defaults.',
        updatedBy: auth.email
      });
    }

    // Generic payload update
    if (payload && payload.books) {
      serverCmsData = payload;
      saveServerData(serverCmsData);
      return NextResponse.json({
        success: true,
        message: 'CMS state synchronized successfully.',
        updatedBy: auth.email
      });
    }

    return NextResponse.json(
      { error: 'Invalid mutation action or payload.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('CMS Mutation Error:', error);
    return NextResponse.json(
      { error: 'Failed to process content mutation.' },
      { status: 500 }
    );
  }
}
