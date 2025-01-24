'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabaseBrowser.auth.signUp({
      email,
      password
    });
    if (error) {
      alert(error.message);
    } else {
      alert('check your email for confirmation link');
      router.push('/login');
    }
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">sign up</h1>
      <form onSubmit={handleSignup} className="flex flex-col gap-2 max-w-sm">
        <input
          type="email"
          placeholder="email"
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-green-600 text-white p-2">
          sign up
        </button>
      </form>
    </div>
  );
}
