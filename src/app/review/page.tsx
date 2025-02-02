"use client";

import { useAuth } from "@/app/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { supermemo } from "@/lib/supermemo";
import { CircleHelp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // fetch due cards
  useEffect(() => {
    if (!session && !loading) {
      router.push("/login");
      return;
    }
    if (session) {
      fetchDueCards();
    }
  }, [session, loading]);

  async function fetchDueCards() {
    try {
      const nowIso = new Date().toISOString();
      const { data, error } = await supabaseBrowser
        .from("cards")
        .select("*")
        .eq("user_id", session?.user.id)
        .lte("next_review_at", nowIso);

      if (error) throw error;
      setCardsDue(data as CardType[]);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  }

  // handle rating
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

    try {
      const { error } = await supabaseBrowser
        .from("cards")
        .update({
          correct_review_streak_count: newStreak,
          ease_factor: newEaseFactor,
          next_review_at: nextReviewAt,
        })
        .eq("id", card.id);

      if (error) throw error;

      setShowAnswer(false);
      setCurrentIndex((prev) => prev + 1);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  }

  // handle empty or completed states
  if (loading) return <div className="p-4">loading...</div>;

  if (!cardsDue.length) {
    return (
      <div className="max-w-3xl mx-auto p-4 fade-in-up">
        <h1 className="text-3xl font-serif font-semibold mb-2">review session</h1>
        <p className="text-sm">no cards due right now. nicely done!</p>
      </div>
    );
  }

  if (currentIndex >= cardsDue.length) {
    return (
      <div className="max-w-3xl mx-auto p-4 fade-in-up">
        <h1 className="text-3xl font-serif font-semibold mb-2">review session</h1>
        <p className="text-sm">all reviews complete! go celebrate.</p>
      </div>
    );
  }

  // current card
  const currentCard = cardsDue[currentIndex];
  const progressFraction = (currentIndex / cardsDue.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-4 fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-serif font-semibold">review session</h1>
        <div className="w-1/3 mt-2">
          <Progress value={progressFraction} />
          <p className="text-xs text-foreground/70 mt-1 text-right">
            {currentIndex}/{cardsDue.length}
          </p>
        </div>
      </div>

      <Card className="relative">
        <CardHeader>
          <p className="text-sm uppercase text-foreground/70 tracking-wider">
            question
          </p>
          <CardTitle className="text-lg">
            {currentCard.question_text}
          </CardTitle>
          <CardDescription className="text-sm text-foreground/70">
            {/* optional subheading or deck name, etc. */}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {showAnswer && (
            <div className="mb-4">
              <p className="text-sm uppercase text-foreground/70 tracking-wider">
                answer
              </p>
              <p className="font-semibold text-base">
                {currentCard.answer_text}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-gray-200 py-6">
          {!showAnswer ? (
            <Button onClick={() => setShowAnswer(true)} variant="default">
              show answer
            </Button>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm mb-2 uppercase flex flex-row gap-2 items-center">
                recall strength
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CircleHelp className="w-4 h-4 text-gray-500 text-sm" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>how well did you recall the answer to this question?</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleRating(1)}
                  variant="outline"
                  className="w-1/5 active:animate-pop"
                >
                  forgot
                </Button>
                <Button
                  onClick={() => handleRating(2)}
                  variant="outline"
                  className="w-1/5 active:animate-pop"
                >
                  struggled
                </Button>
                <Button
                  onClick={() => handleRating(3)}
                  variant="outline"
                  className="w-1/5 active:animate-pop"
                >
                  partial
                </Button>
                <Button
                  onClick={() => handleRating(4)}
                  variant="outline"
                  className="w-1/5 active:animate-pop"
                >
                  mostly correct
                </Button>
                <Button
                  onClick={() => handleRating(5)}
                  variant="outline"
                  className="w-1/5 active:animate-pop"
                >
                  perfect
                </Button>
              </div>
            </div>
          )}

          {errorMessage && (
            <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
