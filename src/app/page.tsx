"use client";

import { useAuth } from "@/app/auth-provider";
import { supabaseBrowser } from "@/lib/supabaseClient";
import Link from "next/link";
import { useEffect, useState } from "react";

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
          .from("cards")
          .select("count", { count: "exact" })
          .eq("user_id", session.user.id)
          .lte("next_review_at", new Date().toISOString());

        if (error) throw error;
        setCardsDue(count || 0);
      } catch (err) {
        console.error("error fetching cards:", err);
        setErrorMessage(
          err instanceof Error ? err.message : "failed to load cards"
        );
        setCardsDue(null);
      } finally {
        setIsLoadingCards(false);
      }
    };

    fetchDueCount();
  }, [session]);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "good morning";
    if (hour < 18) return "good afternoon";
    return "good evening";
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center gap-3 fade-in-up">
        <p className="text-sm text-foreground/70">checking session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <section className="fade-in-up text-center max-w-xl mx-auto">
        <h1 className="text-4xl mb-4 font-serif font-semibold">
          welcome to prime
        </h1>
        <p className="mb-6 text-base text-foreground/70">
          an intelligent srs platform that helps you master anything, elegantly.
        </p>
        <Link href="/login" className="btn btn-primary text-sm">
          get started
        </Link>
      </section>
    );
  }

  // authenticated homepage
  return (
    <section className="fade-in-up flex flex-col gap-6">
      {/* hero / greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-1 font-serif font-semibold flex items-center gap-2">
            {getTimeBasedGreeting()}
          </h1>
        </div>
      </div>

      {/* error display */}
      {errorMessage && (
        <div className="alert bg-red-100 border border-red-300 text-red-700">
          <p>{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline hover:text-red-600"
          >
            retry
          </button>
        </div>
      )}

      {/* main review panel */}
      <div className="card">
        {isLoadingCards ? (
          <p className="text-sm text-foreground/70">
            loading your review queue...
          </p>
        ) : cardsDue === 0 ? (
          <>
            <h2 className="text-xl mb-2 font-serif font-semibold">
              no cards due right now
            </h2>
            <p className="text-sm mb-4">
              you’ve tackled everything! consider adding new decks or refining existing ones.
            </p>
            <div className="flex gap-3">
              <Link href="/decks" className="btn btn-primary text-sm">
                explore decks
              </Link>
              <Link href="/snippets" className="btn btn-secondary text-sm">
                add content
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl mb-2 font-serif font-semibold">
              you have {cardsDue} cards due
            </h2>
            <p className="text-sm mb-4">it’s time to review.</p>
            <div className="flex gap-3">
              <Link href="/review" className="btn btn-primary text-sm">
                start reviewing
              </Link>
              <Link
                href="/decks"
                className="text-sm underline hover:text-color-base"
              >
                manage decks →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
