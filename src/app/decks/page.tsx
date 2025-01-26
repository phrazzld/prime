'use client';

import { useAuth } from '@/app/auth-provider';
import { supabaseBrowser } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Deck = {
  id: string;
  title: string;
  created_at: string;
};

export default function DecksPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!session && !loading) {
      router.push('/login');
      return;
    }
    fetchDecks();
  }, [session]);

  async function fetchDecks() {
    const { data, error } = await supabaseBrowser
      .from('decks')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      alert(error.message);
    } else {
      setDecks(data as Deck[]);
    }
  }

  async function createDeck(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const { error } = await supabaseBrowser
      .from('decks')
      .insert([{ title, user_id: session?.user.id }]);
    if (error) {
      alert(error.message);
    } else {
      setTitle('');
      fetchDecks();
    }
  }

  async function deleteDeck(deckId: string) {
    if (!confirm('delete this deck?')) return;
    const { error } = await supabaseBrowser.from('decks').delete().eq('id', deckId);
    if (error) {
      alert(error.message);
    } else {
      fetchDecks();
    }
  }

  if (loading) return <div>loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 fade-in">
      <h1 className="text-3xl font-bold mb-6 lowercase">my decks</h1>
      <form onSubmit={createDeck} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="deck title"
          className="border p-2 rounded flex-grow"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit" className="btn">
          create deck
        </button>
      </form>
      <ul className="space-y-4">
        {decks.map((deck) => (
          <li
            key={deck.id}
            className="p-4 border rounded flex justify-between items-center hover:bg-foreground/5 transition-colors"
          >
            <Link
              href={`/decks/${deck.id}`}
              className="text-lg font-medium hover:underline"
            >
              {deck.title}
            </Link>
            <button
              className="text-red-500 text-sm hover:text-red-300"
              onClick={() => deleteDeck(deck.id)}
            >
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
