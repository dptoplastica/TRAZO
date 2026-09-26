import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mbyjsvmyjgacoapfadyx.supabase.co';
const supabaseKey = 'sb_publishable_kava-820jsluTBu_ssV_jQ_cOPi7DsH';

export const supabase = createClient(supabaseUrl, supabaseKey);
