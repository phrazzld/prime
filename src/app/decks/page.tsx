"use client";

import { useAuth } from "@/app/auth-provider";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabaseBrowser } from "@/lib/supabaseClient";
import { Loader2 } from 'lucide-react';
import Link from "next/link";
import { useEffect, useState } from "react";

interface Deck {
  id: string;
  title: string;
  description?: string;
  card_count?: number;
  due_count?: number;
}

export default function DecksPage() {
  const { session } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [title, setTitle] = useState("");
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);

  // fetch decks
  useEffect(() => {
    if (!session) return;
    const fetchDecks = async () => {
      try {
        const { data, error } = await supabaseBrowser
          .from("decks")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: true });
        if (error) throw error;
        // TODO: fetch due counts for each deck, or store it in "decks" table w/ trigger
        setDecks(data);
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchDecks();
  }, [session]);

  // create deck
  const handleCreateDeck = async () => {
    if (!title.trim()) return;

    setIsCreatingDeck(true);
    try {
      const { data, error } = await supabaseBrowser
        .from("decks")
        .insert([{ title, user_id: session?.user.id }])
        .select();
      if (error) throw error;
      if (data) {
        setDecks((prev) => [...prev, data[0]]);
        setTitle("");
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsCreatingDeck(false);
    }
  };

  if (!session) {
    return (
      <section className="fade-in-up">
        <p className="text-sm">please log in to view your decks.</p>
      </section>
    );
  }

  return (
    <section className="fade-in-up">
      <h1 className="text-3xl font-serif font-semibold mb-4">my decks</h1>

      <div className="flex gap-2 mb-6 items-center">
        <Input type="text" placeholder="deck title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Button onClick={handleCreateDeck} disabled={isCreatingDeck}>
          {isCreatingDeck ? (
            <div className="flex flex-row items-center gap-2">
              <Loader2 className="animate-spin" />
              <p className="text-sm">creating...</p>
            </div>
          ) : (
            'create'
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map((deck) => (
          <Link key={deck.id} href={`/decks/${deck.id}`}>
            <div className="card cursor-pointer hover:shadow-md transition group">
              <h2 className="text-xl font-serif font-semibold mb-2 group-hover:text-color-accent transition-colors">
                {deck.title}
              </h2>
              <p className="text-sm text-foreground/70 italic">
                {deck.description || "no description"}
              </p>
              <div className="mt-3 flex justify-between text-sm">
                <span>{deck.card_count ?? 0} cards</span>
                {deck.due_count && deck.due_count > 0 ? (
                  <span className="text-color-accent">{deck.due_count} due</span>
                ) : (
                  <span className="text-foreground/50">0 due</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
