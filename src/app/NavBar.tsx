"use client";

import { useAuth } from "@/app/auth-provider";
import { useTheme } from "@/app/ThemeProvider";
import { Button } from '@/components/ui/button';
import { supabaseBrowser } from "@/lib/supabaseClient";
import Link from "next/link";

export default function NavBar() {
  const { session } = useAuth();
  const { theme, toggleTheme } = useTheme();

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();
  }

  return (
    <nav className="w-full flex items-center justify-between px-8 py-3 mb-6">
      <div className="flex items-center gap-6">
        <Button asChild variant="link">
          <Link href="/" className="text-sm tracking-normal">
            home
          </Link>
        </Button>
        <Button asChild variant="link">
          <Link href="/decks" className="text-sm tracking-normal">
            decks
          </Link>
        </Button>
        <Button asChild variant="link">
          <Link href="/review" className="text-sm tracking-normal">
            review
          </Link>
        </Button>
        <Button asChild variant="link">
          <Link href="/snippets" className="text-sm tracking-normal">
            snippets
          </Link>
        </Button>
        {session && (
          <Button variant="ghost" onClick={handleSignOut}>
            sign out
          </Button>
        )}
        {!session && (
          <Button asChild variant="link">
            <Link href="/login" className="text-sm tracking-normal">
              login
            </Link>
          </Button>
        )}
      </div>
      <Button variant="secondary" onClick={toggleTheme}>
        {theme === "light" ? "dark mode" : "light mode"}
      </Button>
    </nav>
  );
}
