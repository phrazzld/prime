"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { useAuth } from "@/app/auth-provider";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch decks
  useEffect(() => {
    if (!session) return;
    const fetchDecks = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabaseBrowser
          .from("decks")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: true });
        if (error) throw error;
        // optional: fetch due counts for each deck, or store it in "decks" table w/ trigger
        // for now, we’ll assume we have deck.card_count and deck.due_count or we can fetch separately
        setDecks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDecks();
  }, [session]);

  // create deck
  const handleCreateDeck = async () => {
    if (!title.trim()) return;
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
      setError(err.message);
    }
  };

  console.group("decks")
  console.log("decks:", decks)
  console.groupEnd();

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

      <div className="flex gap-2 mb-6">
        <input
          className="border border-neutral-300 rounded px-2 py-1 text-sm w-full"
          placeholder="deck title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={handleCreateDeck} className="btn btn-primary text-sm">
          create
        </button>
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
