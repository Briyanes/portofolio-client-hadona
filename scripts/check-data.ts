import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkData() {
  const { data, error } = await supabaseAdmin
    .from('case_studies')
    .select('slug, thumbnail_url, client_logo_url')
    .limit(3);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Current data in database:');
    console.log(JSON.stringify(data, null, 2));
  }
  process.exit(0);
}

checkData().catch(console.error);
