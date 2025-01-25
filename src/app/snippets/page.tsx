'use client';

import { useAuth } from '@/app/auth-provider';
import { supabaseBrowser } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

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
    <div>
      <h1 className="text-3xl mb-4">my snippets</h1>
      <div className="mb-4">
        <Link href="/snippets/new" className="btn">
          create new snippet
        </Link>
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
            <li key={snip.id} className="p-4 border rounded hover:shadow transition-shadow">
              <Link href={`/snippets/${snip.id}`} className="font-medium underline">
                {snip.content.length > 60
                  ? snip.content.slice(0, 60) + '...'
                  : snip.content}
              </Link>
              <div className="text-sm text-gray-500">
                created at: {new Date(snip.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
