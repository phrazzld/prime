'use client';

import { useAuth } from '@/app/auth-provider';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function NewSnippetPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !session) {
      router.push('/login');
    }
  }, [loading, session, router]);

  async function createSnippet(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    if (!content.trim()) {
      setErrorMsg('please provide snippet content');
      return;
    }

    try {
      setSubmitting(true);
      const { data, error } = await supabaseBrowser
        .from('snippets')
        .insert([{ content, user_id: session?.user.id }])
        .select()
        .single();
      if (error) {
        setErrorMsg(error.message);
      } else if (data) {
        router.push(`/snippets/${data.id}`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !session) {
    return <p>loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">create new snippet</h1>
      {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}
      <form onSubmit={createSnippet} className="flex flex-col gap-2 max-w-md">
        <textarea
          className="border p-2"
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="enter your ephemeral snippet here..."
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <div className="flex flex-row items-center gap-2">
              <Loader2 className="animate-spin" />
              <p className="text-sm">creating...</p>
            </div>
          ) : (
            'create snippet'
          )}
        </Button>
      </form>
    </div>
  );
}
