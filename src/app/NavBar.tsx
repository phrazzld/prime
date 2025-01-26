"use client";

import Link from "next/link";
import { useAuth } from "@/app/auth-provider";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { useTheme } from "@/app/ThemeProvider";

export default function NavBar() {
  const { session } = useAuth();
  const { theme, toggleTheme } = useTheme();

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();
  }

  return (
    <nav className="w-full flex items-center justify-between px-8 py-3 mb-6">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-sm tracking-normal">
          home
        </Link>
        <Link href="/decks" className="text-sm tracking-normal">
          decks
        </Link>
        <Link href="/review" className="text-sm tracking-normal">
          review
        </Link>
        <Link href="/snippets" className="text-sm tracking-normal">
          snippets
        </Link>
        {session && (
          <button
            onClick={handleSignOut}
            className="text-sm tracking-normal hover:text-red-600"
          >
            sign out
          </button>
        )}
        {!session && (
          <Link href="/login" className="text-sm tracking-normal">
            login
          </Link>
        )}
      </div>
      <button onClick={toggleTheme} className="btn btn-secondary text-xs">
        {theme === "light" ? "dark mode" : "light mode"}
      </button>
    </nav>
  );
}
