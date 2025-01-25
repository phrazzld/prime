'use client';

import { useAuth } from '@/app/auth-provider';
import { IconBrain, IconConfetti, IconLoader } from '@/app/components/Icons';
import { supabaseBrowser } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { session, loading: authLoading } = useAuth();
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cardsDue, setCardsDue] = useState<number | null>(null);

  useEffect(() => {
    const fetchDueCount = async () => {
      if (!session) {
        setIsLoadingCards(false);
        return;
      }

      try {
        setIsLoadingCards(true);
        setErrorMessage(null);

        const { count, error } = await supabaseBrowser
          .from('cards')
          .select('count', { count: 'exact' })
          .eq('user_id', session.user.id)
          .lte('next_review_at', new Date().toISOString());

        if (error) throw error;

        setCardsDue(count || 0);
      } catch (error) {
        console.error('Error fetching cards:', error);
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load cards');
        setCardsDue(null);
      } finally {
        setIsLoadingCards(false);
      }
    };

    fetchDueCount();
  }, [session]);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center gap-4 fade-in">
        <IconLoader className="animate-spin text-brand h-12 w-12" />
        <p className="text-foreground-muted">Checking session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="fade-in text-center">
        <h1 className="text-4xl mb-4 font-bold bg-gradient-to-r from-brand to-brand-accent bg-clip-text text-transparent">
          Welcome to Prime
        </h1>
        <p className="mb-6 text-lg text-foreground-muted max-w-2xl mx-auto">
          Your AI-powered learning companion. We combine spaced repetition with adaptive learning
          to help you master anything.
        </p>
        <Link href="/login" className="btn px-8 py-4 text-lg hover:scale-105 transform transition">
          Start Learning Now
        </Link>
      </div>
    );
  }

  // User is logged in - handle card states
  return (
    <div className="fade-in">
      <h1 className="text-3xl mb-2 flex items-center gap-3">
        <IconBrain className="w-8 h-8 text-brand-accent" />
        {getTimeBasedGreeting()}, Learner!
      </h1>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-100/20 rounded-lg border border-red-400 text-red-300">
          <p>⚠️ {errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline hover:text-red-200"
          >
            Try Again
          </button>
        </div>
      )}

      {isLoadingCards ? (
        <div className="flex items-center gap-3 text-foreground-muted">
          <IconLoader className="animate-spin h-5 w-5" />
          Checking your review queue...
        </div>
      ) : (
        <div className="space-y-6">
          {cardsDue === 0 ? (
            <div className="p-6 bg-brand/10 rounded-xl border border-brand/20 text-center">
              <IconConfetti className="w-12 h-12 mx-auto text-brand-accent mb-4" />
              <p className="text-xl mb-4">
                All caught up! You're rocking it 🎉
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/decks" className="btn bg-brand-accent hover:bg-brand-accent/90">
                  Explore Decks
                </Link>
                <Link
                  href="/snippets"
                  className="btn bg-transparent border border-brand text-brand hover:bg-brand/10"
                >
                  Add Content
                </Link>
              </div>
            </div>
          ) : (
            <div className="group relative p-6 bg-gradient-to-br from-brand/20 to-brand-accent/5 rounded-xl border border-brand/20 transition-all hover:border-brand/40">
              <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
              <p className="text-xl mb-4">
                You have <span className="text-brand-accent font-bold">{cardsDue}</span> cards
                waiting in your review queue.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/review"
                  className="btn px-6 py-3 flex items-center gap-2 hover:scale-105 transform transition"
                >
                  Start Review Session
                  <span className="animate-pulse">🚀</span>
                </Link>
                <Link
                  href="/decks"
                  className="text-foreground-muted hover:text-foreground transition"
                >
                  Manage Decks →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
