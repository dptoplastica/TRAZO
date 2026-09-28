import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hhsmjmgxarxofyigystd.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_q8GojCWi5kKiybPp_kd6yQ_DlD-sJ-o';

export const supabase = createClient(supabaseUrl, supabaseKey);
