const fs = require('fs');
const path = require('path');
const { loadEnvConfig } = require('@next/env');
const { createClient } = require('@supabase/supabase-js');

loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error('Supabase environment variables are missing.');
}

const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const cmsFile = path.join(process.cwd(), 'data', 'cms-data.json');

async function main() {
  const raw = fs.readFileSync(cmsFile, 'utf8');
  const cmsData = JSON.parse(raw);

  const { data: existing, error: readError } = await supabase
    .from('cms_state')
    .select('id, updated_at')
    .eq('id', 'main')
    .maybeSingle();

  if (readError) {
    throw new Error(`Could not check Supabase: ${readError.message}`);
  }

  if (existing) {
    console.log('Migration stopped: cms_state already contains a main row.');
    console.log(`Existing updated_at: ${existing.updated_at}`);
    process.exit(1);
  }

  const { error: insertError } = await supabase
    .from('cms_state')
    .insert({
      id: 'main',
      data: cmsData,
      updated_at: new Date().toISOString(),
    });

  if (insertError) {
    throw new Error(`Migration failed: ${insertError.message}`);
  }

  console.log('CMS migration completed successfully.');
  console.log(`Books: ${cmsData.books?.length ?? 0}`);
  console.log(`Authors: ${cmsData.authors?.length ?? 0}`);
  console.log(`Artwork: ${cmsData.artworks?.length ?? 0}`);
  console.log(`News: ${cmsData.news?.length ?? 0}`);
  console.log(`Events: ${cmsData.events?.length ?? 0}`);
  console.log(`Extras: ${cmsData.extras?.length ?? 0}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});