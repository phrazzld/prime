"use client";

import { useAuth } from "@/app/auth-provider";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TCard } from "@/lib/schema";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { Loader2 } from 'lucide-react';
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

export default function DeckDetailPage() {
  const { session } = useAuth();
  const params = useParams();
  const [deckTitle, setDeckTitle] = useState("");
  const [cards, setCards] = useState<TCard[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [dueCount, setDueCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [isDeletingCard, setIsDeletingCard] = useState<string | null>(null);

  const deckId = params.deckId;

  // fetch deck + cards
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: deckData, error: deckError } = await supabaseBrowser
          .from("decks")
          .select("*")
          .eq("id", deckId)
          .single();
        if (deckError) throw deckError;
        setDeckTitle(deckData.title);

        const { data: cardData, error: cardError } = await supabaseBrowser
          .from("cards")
          .select("*")
          .eq("deck_id", deckId)
          .order("created_at", { ascending: true });
        if (cardError) throw cardError;

        setCards(cardData);

        // calculate due
        const now = new Date().toISOString();
        const due = cardData.filter((c) => c.next_review_at <= now).length;
        setDueCount(due);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [deckId]);

  // create card
  const createCard = async () => {
    if (!question.trim()) return;

    setIsCreatingCard(true);
    try {
      const { data, error } = await supabaseBrowser
        .from("cards")
        .insert([
          {
            deck_id: deckId,
            question_text: question,
            answer_text: answer,
            next_review_at: new Date().toISOString(),
            user_id: session?.user.id,
          },
        ])
        .select();
      if (error) throw error;
      if (data) {
        setCards((prev) => [...prev, data[0]]);
        setQuestion("");
        setAnswer("");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCreatingCard(false);
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!confirm('delete this card?')) return;
    setIsDeletingCard(cardId);
    try {
      const { error } = await supabaseBrowser
        .from("cards")
        .delete()
        .eq("id", cardId);
      if (error) throw error;
      setCards((prev) => prev.filter((c) => c.id !== cardId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeletingCard(null);
    }
  };

  return (
    <section className="fade-in-up">
      {error && (
        <div className="alert bg-red-100 border border-red-300 text-red-700">
          {error}
        </div>
      )}
      {loading ? (
        <p className="text-sm text-foreground/70">loading deck...</p>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-foreground/70 text-gray-500 mb-0 uppercase text-sm">
                deck
              </p>
              <h1 className="text-3xl font-serif font-semibold">{deckTitle}</h1>
            </div>
            {dueCount > 0 ? (
              <Button asChild>
                <Link href="/review" className="btn btn-primary text-sm">
                  review {dueCount} due
                </Link>
              </Button>
            ) : (
              <span className="text-sm text-foreground/70">no cards due</span>
            )}
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>new card</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 mb-2 w-full">
                <Input type="text" placeholder="question" value={question} onChange={(e) => setQuestion(e.target.value)} />
                <Input type="text" placeholder="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={createCard} disabled={isCreatingCard}>
                {isCreatingCard ? (
                  <div className="flex flex-row items-center gap-2">
                    <Loader2 className="animate-spin" />
                    <p className="text-sm">creating...</p>
                  </div>
                ) : (
                  'create card'
                )}
              </Button>
            </CardFooter>
          </Card>

          {cards.length === 0 ? (
            <p className="text-sm text-foreground/70">no cards yet. create one above!</p>
          ) : (
            <div className="space-y-2">
              {cards.map((card) => (
                <Card key={card.id} className="mb-6">
                  <CardHeader>
                    <p className="text-sm uppercase text-foreground/70 tracking-wider">
                      question
                    </p>
                    <CardTitle>{card.question_text}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm uppercase text-foreground/70 tracking-wider">
                      answer
                    </p>
                    <p className="font-semibold text-base">{card.answer_text}</p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex flex-row items-center justify-between w-full">
                      <p className="text-xs text-foreground/70">
                        streak: {card.correct_review_streak_count} | ef: {card.ease_factor.toFixed(2)} | next: {card.next_review_at.toLocaleString()}
                      </p>
                      <Button onClick={() => deleteCard(card.id)} disabled={!!isDeletingCard} variant="destructive">
                        {isDeletingCard === card.id ? (
                          <div className="flex flex-row items-center gap-2">
                            <Loader2 className="animate-spin" />
                            <p className="text-sm">deleting...</p>
                          </div>
                        ) : (
                          'delete'
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
