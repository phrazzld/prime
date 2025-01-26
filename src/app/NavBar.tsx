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
    <nav className="flex justify-between items-center py-4 px-8 mb-4 border-b border-foreground/20 transition-colors duration-300">
      <div className="flex gap-6 lowercase">
        <Link href="/" className="hover:text-brand-accent transition-colors">
          home
        </Link>
        <Link href="/decks" className="hover:text-brand-accent transition-colors">
          decks
        </Link>
        <Link href="/review" className="hover:text-brand-accent transition-colors">
          review
        </Link>
        <Link href="/snippets" className="hover:text-brand-accent transition-colors">
          snippets
        </Link>
        {session ? (
          <button
            onClick={handleSignOut}
            className="hover:text-red-400 transition-colors"
          >
            sign out
          </button>
        ) : (
          <Link href="/login" className="hover:text-brand-accent transition-colors">
            login
          </Link>
        )}
      </div>
      <button
        onClick={toggleTheme}
        className="btn bg-transparent text-foreground border border-foreground hover:bg-foreground hover:text-background transition-colors"
      >
        {theme === 'light' ? 'dark mode' : 'light mode'}
      </button>
    </nav>
  );
}
