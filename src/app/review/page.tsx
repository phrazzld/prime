'use client';

import { useAuth } from '@/app/auth-provider';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { supermemo } from '@/lib/supermemo';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type CardType = {
  id: string;
  question_text: string;
  answer_text: string;
  correct_review_streak_count: number;
  ease_factor: number;
  next_review_at: string;
};

export default function ReviewPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [cardsDue, setCardsDue] = useState<CardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (!session && !loading) {
      router.push('/login');
      return;
    }
    fetchDueCards();
  }, [session]);

  async function fetchDueCards() {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabaseBrowser
      .from('cards')
      .select('*')
      .eq('user_id', session?.user.id)
      .lte('next_review_at', nowIso);
    if (error) {
      alert(error.message);
    } else {
      setCardsDue(data as CardType[]);
    }
  }

  async function handleRating(rating: number) {
    const card = cardsDue[currentIndex];
    const { newStreak, newEaseFactor, interval } = supermemo(
      card.correct_review_streak_count,
      card.ease_factor,
      rating
    );
    const now = new Date();
    now.setDate(now.getDate() + interval);
    const nextReviewAt = now.toISOString();

    const { error } = await supabaseBrowser
      .from('cards')
      .update({
        correct_review_streak_count: newStreak,
        ease_factor: newEaseFactor,
        next_review_at: nextReviewAt
      })
      .eq('id', card.id);

    if (error) {
      alert(error.message);
      return;
    }

    setShowAnswer(false);
    setCurrentIndex((prev) => prev + 1);
  }

  if (loading) return <div>loading...</div>;

  if (!cardsDue.length) {
    return (
      <div className="fade-in-up text-center">
        <h1 className="text-3xl font-serif font-semibold mb-4">review session</h1>
        <p className="text-sm">no cards due rn. nice work!</p>
      </div>
    );
  }

  if (currentIndex >= cardsDue.length) return <div>all reviews complete!</div>;

  const currentCard = cardsDue[currentIndex];

  return (
    <div className="max-w-3xl mx-auto p-4 fade-in-up">
      <h1 className="text-4xl font-serif font-semibold mb-6">review session</h1>
      <p className="mb-4 text-sm text-foreground/70">
        card {currentIndex + 1} of {cardsDue.length}
      </p>
      <div className="card">
        <div className="font-semibold mb-4 text-lg">
          q: {currentCard.question_text}
        </div>
        {!showAnswer ? (
          <button onClick={() => setShowAnswer(true)} className="btn btn-secondary text-sm">
            show answer
          </button>
        ) : (
          <>
            <p className="mb-4">
              <strong>a:</strong> {currentCard.answer_text}
            </p>
            <p className="mb-4 font-medium">how well did you recall it?</p>
            <div className="flex flex-col gap-1 w-full sm:w-2/3">
              <button
                onClick={() => handleRating(1)}
                className="btn bg-red-500 hover:bg-red-600 text-white text-sm"
              >
                1 - i forgot completely
              </button>
              <button
                onClick={() => handleRating(2)}
                className="btn bg-orange-400 hover:bg-orange-500 text-white text-sm"
              >
                2 - i struggled
              </button>
              <button
                onClick={() => handleRating(3)}
                className="btn bg-yellow-400 hover:bg-yellow-500 text-white text-sm"
              >
                3 - partial recall
              </button>
              <button
                onClick={() => handleRating(4)}
                className="btn bg-green-500 hover:bg-green-600 text-white text-sm"
              >
                4 - mostly correct
              </button>
              <button
                onClick={() => handleRating(5)}
                className="btn bg-blue-500 hover:bg-blue-600 text-white text-sm"
              >
                5 - perfect recall
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
