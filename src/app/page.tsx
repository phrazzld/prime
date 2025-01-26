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
        console.error('error fetching cards:', error);
        setErrorMessage(error instanceof Error ? error.message : 'failed to load cards');
        setCardsDue(null);
      } finally {
        setIsLoadingCards(false);
      }
    };

    fetchDueCount();
  }, [session]);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'good morning';
    if (hour < 18) return 'good afternoon';
    return 'good evening';
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center gap-4 fade-in">
        <IconLoader className="animate-spin text-brand h-12 w-12" />
        <p className="text-foreground/70">checking session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="fade-in text-center">
        <h1 className="text-4xl mb-4 font-bold">
          welcome to prime
        </h1>
        <p className="mb-6 text-lg text-foreground/70 max-w-2xl mx-auto">
          your ai-powered learning companion. we combine spaced repetition with adaptive learning to help you master anything.
        </p>
        <Link href="/login" className="btn px-8 py-4 text-lg hover:scale-105 transform transition">
          start learning now
        </Link>
      </div>
    );
  }

  // user is logged in - handle card states
  return (
    <div className="fade-in">
      <h1 className="text-3xl mb-2 flex items-center gap-3 font-bold">
        <IconBrain className="w-8 h-8 text-brand-accent" />
        {getTimeBasedGreeting()}, learner!
      </h1>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-100/20 rounded-lg border border-red-400 text-red-300">
          <p>⚠️ {errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline hover:text-red-200"
          >
            try again
          </button>
        </div>
      )}

      {isLoadingCards ? (
        <div className="flex items-center gap-3 text-foreground/70">
          <IconLoader className="animate-spin h-5 w-5" />
          checking your review queue...
        </div>
      ) : (
        <div className="space-y-6">
          {cardsDue === 0 ? (
            <div className="p-6 bg-brand/10 rounded-xl border border-brand/20 text-center">
              <IconConfetti className="w-12 h-12 mx-auto text-brand-accent mb-4" />
              <p className="text-xl mb-4">
                all caught up! you’re rocking it 🎉
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/decks" className="btn bg-brand-accent hover:bg-brand-accent/90">
                  explore decks
                </Link>
                <Link
                  href="/snippets"
                  className="btn bg-transparent border border-brand text-brand hover:bg-brand/10"
                >
                  add content
                </Link>
              </div>
            </div>
          ) : (
            <div className="group relative p-6 bg-gradient-to-br from-brand/20 to-brand-accent/5 rounded-xl border border-brand/20 transition-all hover:border-brand/40">
              <div className="absolute inset-0 pointer-events-none opacity-5" />
              <p className="text-xl mb-4">
                you have <span className="text-brand-accent font-bold">{cardsDue}</span> cards waiting in your review queue.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/review"
                  className="btn px-6 py-3 flex items-center gap-2 hover:scale-105 transform transition"
                >
                  start review session
                  <span className="animate-pulse">🚀</span>
                </Link>
                <Link
                  href="/decks"
                  className="text-foreground/70 hover:text-foreground transition"
                >
                  manage decks →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
