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
    const { error } = await supabaseBrowser.from('decks').insert([{ title, user_id: session?.user.id }]);
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
      <h1 className="text-4xl font-semibold mb-6">my decks</h1>
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
            className="p-4 border rounded flex justify-between items-center"
          >
            <Link
              href={`/decks/${deck.id}`}
              className="text-lg font-medium hover:underline"
            >
              {deck.title}
            </Link>
            <button
              className="text-red-500 text-sm hover:underline"
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

// 'use client';
//
// import { useAuth } from '@/app/auth-provider';
// import { supabaseBrowser } from '@/lib/supabaseClient';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
//
// type Deck = {
//   id: string;
//   title: string;
//   created_at: string;
// };
//
// export default function DecksPage() {
//   const { session, loading } = useAuth();
//   const router = useRouter();
//   const [decks, setDecks] = useState<Deck[]>([]);
//   const [title, setTitle] = useState('');
//
//   useEffect(() => {
//     if (!session && !loading) {
//       router.push('/login');
//       return;
//     }
//     fetchDecks();
//   }, [session]);
//
//   async function fetchDecks() {
//     const { data, error } = await supabaseBrowser
//       .from('decks')
//       .select('*')
//       .order('created_at', { ascending: false });
//     if (error) {
//       alert(error.message);
//     } else {
//       setDecks(data as Deck[]);
//     }
//   }
//
//   async function createDeck(e: React.FormEvent) {
//     e.preventDefault();
//     const { error } = await supabaseBrowser.from('decks').insert([{ title, user_id: session?.user.id }]);
//     if (error) {
//       alert(error.message);
//     } else {
//       setTitle('');
//       fetchDecks();
//     }
//   }
//
//   async function deleteDeck(deckId: string) {
//     if (!confirm('delete this deck?')) return;
//     const { error } = await supabaseBrowser.from('decks').delete().eq('id', deckId);
//     if (error) {
//       alert(error.message);
//     } else {
//       fetchDecks();
//     }
//   }
//
//   if (loading) return <div>loading...</div>;
//
//   return (
//     <div>
//       <h1 className="text-2xl mb-4">my decks</h1>
//       <form onSubmit={createDeck} className="flex gap-2 mb-4">
//         <input
//           type="text"
//           placeholder="deck title"
//           className="border p-2"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <button className="bg-blue-600 text-white p-2" type="submit">
//           create deck
//         </button>
//       </form>
//       <ul className="space-y-2">
//         {decks.map((deck) => (
//           <li key={deck.id} className="border p-2 flex justify-between items-center">
//             <Link href={`/decks/${deck.id}`} className="text-blue-500 underline">
//               {deck.title}
//             </Link>
//             <div className="flex gap-2">
//               {/* optional link to an edit page if you want */}
//               {/* <Link href={`/decks/${deck.id}/edit`} className="text-sm text-gray-600">edit</Link> */}
//               <button
//                 className="text-red-500 text-sm"
//                 onClick={() => deleteDeck(deck.id)}
//               >
//                 delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
