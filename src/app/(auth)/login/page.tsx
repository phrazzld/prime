'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setFeedback('');

    // this is the magic link flow
    const { error } = await supabaseBrowser.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/decks` // or wherever
      }
    });

    if (error) {
      setFeedback(`error sending magic link: ${error.message}`);
    } else {
      setFeedback('sweet! check your email for the link. see you soon...');
    }
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">log in (magic link style)</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-2 max-w-sm">
        <input
          type="email"
          placeholder="email"
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white p-2">
          send magic link
        </button>
      </form>
      {feedback && <p className="mt-2 text-red-600">{feedback}</p>}
    </div>
  );
}

// 'use client';
//
// import { useState } from 'react';
// import { supabaseBrowser } from '@/lib/supabaseClient';
// import { useRouter } from 'next/navigation';
//
// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//
//   async function handleLogin(e: React.FormEvent) {
//     e.preventDefault();
//     const { error } = await supabaseBrowser.auth.signInWithPassword({
//       email,
//       password
//     });
//     if (error) {
//       alert(error.message);
//     } else {
//       router.push('/decks');
//     }
//   }
//
//   return (
//     <div>
//       <h1 className="text-2xl mb-4">login</h1>
//       <form onSubmit={handleLogin} className="flex flex-col gap-2 max-w-sm">
//         <input
//           type="email"
//           placeholder="email"
//           className="border p-2"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="password"
//           className="border p-2"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button type="submit" className="bg-blue-600 text-white p-2">
//           login
//         </button>
//       </form>
//     </div>
//   );
// }
