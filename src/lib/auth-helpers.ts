import { cookies } from 'next/headers';
import { supabaseServer } from '@/lib/supabaseServer';

export async function getSessionOrThrow() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('sb-access-token')?.value;
  if (!accessToken) {
    throw new Error('no auth token found');
  }

  const { data: { user }, error } = await supabaseServer.auth.getUser(accessToken);
  if (error || !user) {
    throw new Error('unauthorized');
  }
  return { user };
}
