'use client';

import Link from 'next/link';
import { useAuth } from '@/app/auth-provider';
import { supabaseBrowser } from '@/lib/supabaseClient';

export default function NavBar() {
  const { session } = useAuth();

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();
  }

  return (
    <nav className="p-4 bg-gray-200 flex gap-4">
      <Link href="/">home</Link>
      <Link href="/decks">decks</Link>
      <Link href="/review">review</Link>
      {!session && (
        <>
          <Link href="/login">login</Link>
          <Link href="/signup">signup</Link>
        </>
      )}
      {session && (
        <button onClick={handleSignOut} className="text-red-500">
          sign out
        </button>
      )}
    </nav>
  );
}
