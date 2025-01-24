import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// for client usage
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);

// if you need server-side usage with service key, you'd do:
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
// export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
