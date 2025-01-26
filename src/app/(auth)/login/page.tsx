'use client';

import { supabaseBrowser } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setFeedback('');

    const { error } = await supabaseBrowser.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/decks`
      }
    });

    if (error) {
      setFeedback(`error sending magic link: ${error.message}`);
    } else {
      setFeedback('sweet! check your email for the link. see you soon...');
    }
  }

  return (
    <div className="fade-in max-w-md mx-auto p-4">
      <h1 className="text-3xl mb-4 font-bold">log in</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn btn-secondary px-4 py-2">
          send magic link
        </button>
      </form>
      {feedback && <p className="mt-2">{feedback}</p>}
    </div>
  );
}
