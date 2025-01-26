"use client";

import { TCard } from "@/lib/schema";
import { supabaseBrowser } from "@/lib/supabaseClient";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from '@/components/ui/input';

export default function DeckDetailPage() {
  const params = useParams();
  const [deckTitle, setDeckTitle] = useState("");
  const [cards, setCards] = useState<TCard[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [dueCount, setDueCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    try {
      const { data, error } = await supabaseBrowser
        .from("cards")
        .insert([
          {
            deck_id: deckId,
            question_text: question,
            answer_text: answer,
            next_review_at: new Date().toISOString(),
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
              <p className="text-foreground/70 text-gray-500 mb-0">
                deck
              </p>
              <h1 className="text-3xl font-serif font-semibold">{deckTitle}</h1>
            </div>
            {dueCount > 0 ? (
              <Link href="/review" className="btn btn-primary text-sm">
                review {dueCount} due
              </Link>
            ) : (
              <span className="text-sm text-foreground/70">no cards due</span>
            )}
          </div>

          <div className="mb-4">
            <div className="flex flex-col gap-2 mb-2 w-full">
              <Input type="text" placeholder="question" value={question} onChange={(e) => setQuestion(e.target.value)} />
              <Input type="text" placeholder="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            </div>
            <button onClick={createCard} className="btn btn-primary text-sm">
              create card
            </button>
          </div>

          {cards.length === 0 ? (
            <p className="text-sm text-foreground/70">no cards yet. create one above!</p>
          ) : (
            <div className="space-y-2">
              {cards.map((card) => (
                <div key={card.id} className="card">
                  <div className="mb-1 flex items-baseline justify-between">
                    <h2 className="font-serif text-lg font-semibold">
                      q: {card.question_text}
                    </h2>
                    <button className="text-sm text-red-600 hover:text-red-700">
                      delete
                    </button>
                  </div>
                  <p className="mb-2">a: {card.answer_text}</p>
                  <p className="text-xs text-foreground/70">
                    streak: {card.correct_review_streak_count} | ef: {card.ease_factor.toFixed(2)} | next: {card.next_review_at.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
