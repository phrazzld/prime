import { supabaseUrl } from '@/lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
