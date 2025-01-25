'use client';

import { useAuth } from '@/app/auth-provider';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const { session, loading } = useAuth();
  const [cardsDue, setCardsDue] = useState(0);

  useEffect(() => {
    if (session) {
      // maybe fetch actual cards due from supabase if you like
      // for now: randomly pretend we have some or none
      // TODO: replace with actual count
      setCardsDue(Math.round(Math.random() * 10));
    }
  }, [session]);

  if (loading) {
    return <p>loading...</p>;
  }

  if (!session) {
    return (
      <div className="fade-in">
        <h1 className="text-4xl mb-4">welcome to prime</h1>
        <p className="mb-6">
          your personal space to shape knowledge, because spaced repetition is the new black.
        </p>
        <Link href="/login" className="btn">
          sign up now
        </Link>
      </div>
    );
  }

  // user is logged in
  return (
    <div className="fade-in">
      <h1 className="text-3xl mb-2">welcome back!</h1>
      {cardsDue > 0 ? (
        <>
          <p className="mb-6">you have {cardsDue} cards waiting for review. mind if we get started?</p>
          <Link href="/review" className="btn">
            review now
          </Link>
        </>
      ) : (
        <>
          <p className="mb-6">no cards due, you total champ. wanna add new content?</p>
          <Link href="/decks" className="btn">
            manage decks
          </Link>
        </>
      )}
    </div>
  );
}
