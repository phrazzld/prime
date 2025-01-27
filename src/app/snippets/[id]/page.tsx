'use client';

import { useAuth } from '@/app/auth-provider';
import { Button } from '@/components/ui/button';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SnippetDetailPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const snippetId = params.id;

  const [snippet, setSnippet] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingSnippet, setLoadingSnippet] = useState(true);

  // -- editing state
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !session) {
      router.push('/login');
      return;
    }
    if (session) {
      fetchSnippet();
    }
  }, [session, loading]);

  async function fetchSnippet() {
    setLoadingSnippet(true);
    setErrorMsg('');
    const { data, error } = await supabaseBrowser
      .from('snippets')
      .select('*')
      .eq('id', snippetId)
      .single();
    if (error) {
      setErrorMsg(error.message);
      setSnippet(null);
    } else {
      setSnippet(data);
    }
    setLoadingSnippet(false);
  }

  async function deleteSnippet() {
    if (!confirm('delete this snippet?')) return;
    const { error } = await supabaseBrowser
      .from('snippets')
      .delete()
      .eq('id', snippetId);
    if (error) {
      alert(error.message);
    } else {
      router.push('/snippets');
    }
  }

  function startEditing() {
    if (!snippet) return;
    setDraftContent(snippet.content);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setDraftContent('');
  }

  async function saveEdits(e: React.FormEvent) {
    e.preventDefault();
    if (!draftContent.trim()) {
      setErrorMsg('cannot have empty snippet content');
      return;
    }
    setSubmitting(true);
    const { error } = await supabaseBrowser
      .from('snippets')
      .update({ content: draftContent })
      .eq('id', snippetId);
    setSubmitting(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      // update local snippet state and flip out of edit mode
      setSnippet({ ...snippet, content: draftContent });
      setIsEditing(false);
    }
  }

  if (loading) {
    return <p>loading auth...</p>;
  }
  if (!session) {
    return null;
  }
  if (loadingSnippet) {
    return <p>loading snippet...</p>;
  }
  if (errorMsg && !snippet) {
    // if error loading snippet, show it
    return <p className="text-red-600">{errorMsg}</p>;
  }
  if (!snippet) {
    // snippet not found
    return <p>no snippet found.</p>;
  }

  return (
    <div className="fade-in-up">
      <h1 className="text-2xl font-serif font-semibold mb-4">snippet details</h1>

      {isEditing ? (
        <form onSubmit={saveEdits} className="card mb-4 flex flex-col gap-2">
          {errorMsg && <p className="text-red-600">{errorMsg}</p>}
          <textarea
            className="border p-2 w-full"
            rows={6}
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <div className="flex flex-row items-center gap-2">
                  <Loader2 className="animate-spin" />
                  <p className="text-sm">saving...</p>
                </div>
              ) : (
                'save changes'
              )}
            </Button>
            <Button type="button" onClick={cancelEditing} disabled={submitting} variant="outline">
              cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="card mb-4">
          <p>{snippet.content}</p>
          <div className="text-sm text-foreground/70 mt-2">
            created at: {new Date(snippet.created_at).toLocaleString()}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        {!isEditing && (
          <Button onClick={startEditing}>
            edit
          </Button>
        )}
        <Button onClick={deleteSnippet} variant="destructive">
          delete
        </Button>
        <Button asChild variant="link">
          <Link href="/snippets">
            back
          </Link>
        </Button>
      </div>
    </div>
  );
}
