import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth-server';
import { INITIAL_CMS_DATA } from '@/lib/initial-data';
import { CMSData } from '@/lib/types';
import { supabaseServer } from '@/lib/supabase-server';

const CMS_STATE_ID = 'main';

async function loadServerData(): Promise<CMSData> {
  try {
    const { data, error } = await supabaseServer
      .from('cms_state')
      .select('data')
      .eq('id', CMS_STATE_ID)
      .maybeSingle();

    if (error) {
      console.error('Failed to read CMS data from Supabase:', error);
      return { ...INITIAL_CMS_DATA };
    }

    if (data?.data && typeof data.data === 'object') {
      return data.data as CMSData;
    }
  } catch (err) {
    console.error('Failed to load CMS data from Supabase:', err);
  }

  return { ...INITIAL_CMS_DATA };
}

async function saveServerData(data: CMSData): Promise<boolean> {
  try {
    const { error } = await supabaseServer
      .from('cms_state')
      .upsert(
        {
          id: CMS_STATE_ID,
          data,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'id',
        }
      );

    if (error) {
      console.error('Failed to save CMS data to Supabase:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to write CMS data to Supabase:', err);
    return false;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isPublic = searchParams.get('public') === 'true';

  const serverCmsData = await loadServerData();

  if (isPublic) {
    const publicData = {
      books: serverCmsData.books.filter((b) => b.visibility),
      authors: serverCmsData.authors.filter((a) => a.visibility),
      works: serverCmsData.works.filter((w) => w.visibility),
      news: serverCmsData.news.filter((n) => n.published && !n.archived),
      events: serverCmsData.events.filter((e) => e.published && !e.archived),
      extras: serverCmsData.extras.filter((x) => x.visibility),
      settings: serverCmsData.settings,
    };

    return NextResponse.json(publicData);
  }

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
  const auth = await getAuthenticatedAdmin();

  if (!auth.authenticated) {
    return NextResponse.json(
      {
        error:
          'Unauthorized: Valid author administrator session required to perform mutations.',
      },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { action, payload } = body;

    if (action === 'save_all' && payload) {
      const saved = await saveServerData(payload as CMSData);

      if (!saved) {
        return NextResponse.json(
          { error: 'Failed to save CMS data to Supabase.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Content updated successfully and saved to persistent Supabase storage.',
        updatedBy: auth.email,
      });
    }

    if (action === 'reset_to_defaults') {
      const defaultData = { ...INITIAL_CMS_DATA };
      const saved = await saveServerData(defaultData);

      if (!saved) {
        return NextResponse.json(
          { error: 'Failed to save default CMS data to Supabase.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Content reset to Batch One defaults.',
        updatedBy: auth.email,
      });
    }

    if (payload && payload.books) {
      const saved = await saveServerData(payload as CMSData);

      if (!saved) {
        return NextResponse.json(
          { error: 'Failed to synchronize CMS data with Supabase.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'CMS state synchronized successfully.',
        updatedBy: auth.email,
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