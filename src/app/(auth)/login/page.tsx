'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSending, setIsSending] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    try {
      e.preventDefault();
      setFeedback('');
      setIsSending(true);

      const { error } = await supabaseBrowser.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/decks`
        }
      });

      if (error) {
        setFeedback(`error sending magic link: ${error.message}`);
      } else {
        setFeedback('magic link sent. check your inbox.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="fade-in max-w-md mx-auto p-4">
      <h1 className="text-3xl mb-4 font-bold">log in</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-2">
        <Input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" className="btn btn-primary px-4 py-2" disabled={isSending}>
          {isSending ? (
            <div className="flex flex-row items-center gap-2">
              <Loader2 className="animate-spin" />
              <p className="text-sm">sending magic link...</p>
            </div>
          ) : (
            <p>send magic link</p>
          )}
        </Button>
      </form>
      {feedback && <p className="mt-2">{feedback}</p>}
    </div>
  );
}
