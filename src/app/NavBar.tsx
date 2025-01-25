'use client';

import Link from 'next/link';
import { useAuth } from '@/app/auth-provider';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { useTheme } from '@/app/ThemeProvider';

export default function NavBar() {
  const { session } = useAuth();
  const { theme, toggleTheme } = useTheme();

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();
  }

  return (
    <nav
      className="flex justify-between items-center p-4 mb-4"
      style={{ backgroundColor: 'var(--brand)', color: '#ffffff' }}
    >
      <div className="flex gap-4">
        <Link href="/">home</Link>
        <Link href="/decks">decks</Link>
        <Link href="/review">review</Link>
        {session ? (
          <button onClick={handleSignOut} className="text-red-200 hover:text-red-300">
            sign out
          </button>
        ) : (
          <>
            <Link href="/login">login</Link>
          </>
        )}
      </div>
      <button
        onClick={toggleTheme}
        className="btn"
        style={{ backgroundColor: 'transparent', border: '1px solid #ffffff', color: '#ffffff' }}
      >
        {theme === 'light' ? 'dark mode' : 'light mode'}
      </button>
    </nav>
  );
}
