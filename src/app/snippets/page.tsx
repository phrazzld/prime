'use client';

import { useAuth } from '@/app/auth-provider';
import { supabaseBrowser } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Snippet {
  id: string;
  content: string;
  created_at: string;
}

export default function SnippetsIndexPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingSnippets, setLoadingSnippets] = useState(true);

  useEffect(() => {
    if (!loading && !session) {
      router.push('/login');
      return;
    }
    if (session) {
      fetchSnippets();
    }
  }, [session, loading]);

  async function fetchSnippets() {
    setLoadingSnippets(true);
    setErrorMsg('');
    const { data, error } = await supabaseBrowser
      .from('snippets')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setErrorMsg(error.message);
    } else if (data) {
      setSnippets(data);
    }
    setLoadingSnippets(false);
  }

  if (loading) {
    return <p>loading auth...</p>;
  }

  if (!session) {
    return null; // or a "not logged in" message
  }

  return (

    <div className="fade-in-up">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-3xl font-serif font-semibold mb-4">my snippets</h1>
        <Button asChild variant="link">
          <Link href="/snippets/new">
            create new snippet
          </Link>
        </Button>
      </div>

      {loadingSnippets ? (
        <p>loading snippets...</p>
      ) : errorMsg ? (
        <p className="text-red-600">error: {errorMsg}</p>
      ) : snippets.length === 0 ? (
        <p className="italic">no snippets yet. add your first snippet above!</p>
      ) : (
        <ul className="space-y-3">
          {snippets.map((snip) => (
            <li key={snip.id} className="card hover:shadow transition-shadow">
              <Button variant="link" asChild>
                <Link href={`/snippets/${snip.id}`}>
                  {snip.content.length > 60
                    ? snip.content.slice(0, 60) + '...'
                    : snip.content}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
