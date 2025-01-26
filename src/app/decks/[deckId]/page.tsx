'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { useAuth } from '@/app/auth-provider';

type CardType = {
  id: string;
  question_text: string;
  answer_text: string;
  correct_review_streak_count: number;
  ease_factor: number;
  next_review_at: string;
};

export default function DeckDetailPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const deckId = params.deckId as string;

  const [deckTitle, setDeckTitle] = useState('');
  const [cards, setCards] = useState<CardType[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (!session && !loading) {
      router.push('/login');
      return;
    }
    loadDeck();
    loadCards();
  }, [session, deckId]);

  async function loadDeck() {
    const { data, error } = await supabaseBrowser
      .from('decks')
      .select('title')
      .eq('id', deckId)
      .single();
    if (error) {
      alert(error.message);
    } else {
      setDeckTitle(data.title);
    }
  }

  async function loadCards() {
    const { data, error } = await supabaseBrowser
      .from('cards')
      .select('*')
      .eq('deck_id', deckId)
      .order('created_at', { ascending: false });
    if (error) {
      alert(error.message);
    } else {
      setCards(data as CardType[]);
    }
  }

  async function createCard(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    const { error } = await supabaseBrowser.from('cards').insert([
      {
        deck_id: deckId,
        question_text: question,
        answer_text: answer,
        user_id: session?.user.id
      }
    ]);
    if (error) {
      alert(error.message);
    } else {
      setQuestion('');
      setAnswer('');
      loadCards();
    }
  }

  async function deleteCard(cardId: string) {
    if (!confirm('delete this card?')) return;
    const { error } = await supabaseBrowser.from('cards').delete().eq('id', cardId);
    if (error) {
      alert(error.message);
    } else {
      loadCards();
    }
  }

  if (loading) return <div>loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 fade-in">
      <h1 className="text-3xl font-bold mb-6 lowercase">deck: {deckTitle}</h1>
      <form onSubmit={createCard} className="flex flex-col gap-2 mb-6">
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button type="submit" className="btn">
          create card
        </button>
      </form>
      <ul className="space-y-4">
        {cards.map((card) => (
          <li key={card.id} className="border p-4 rounded hover:bg-foreground/5 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <div>
                <strong>q:</strong> {card.question_text} <br />
                <strong>a:</strong> {card.answer_text}
              </div>
              <button
                onClick={() => deleteCard(card.id)}
                className="text-red-500 text-sm hover:text-red-300"
              >
                delete
              </button>
            </div>
            <div className="text-sm text-foreground/60">
              streak: {card.correct_review_streak_count} | ef: {card?.ease_factor?.toFixed(2)} | next: {card?.next_review_at}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
