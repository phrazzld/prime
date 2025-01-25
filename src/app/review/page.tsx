'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/auth-provider';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { supermemo } from '@/lib/supermemo';

type CardType = {
  id: string;
  question_text: string;
  answer_text: string;
  correct_review_streak_count: number;
  ease_factor: number;
  next_review_at: string;
};

export default function ReviewPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [cardsDue, setCardsDue] = useState<CardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (!session && !loading) {
      router.push('/login');
      return;
    }
    fetchDueCards();
  }, [session]);

  async function fetchDueCards() {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabaseBrowser
      .from('cards')
      .select('*')
      .eq('user_id', session?.user.id)
      .lte('next_review_at', nowIso);
    if (error) {
      alert(error.message);
    } else {
      setCardsDue(data as CardType[]);
    }
  }

  async function handleRating(rating: number) {
    const card = cardsDue[currentIndex];
    const { newStreak, newEaseFactor, interval } = supermemo(
      card.correct_review_streak_count,
      card.ease_factor,
      rating
    );
    const now = new Date();
    now.setDate(now.getDate() + interval);
    const nextReviewAt = now.toISOString();

    const { error } = await supabaseBrowser
      .from('cards')
      .update({
        correct_review_streak_count: newStreak,
        ease_factor: newEaseFactor,
        next_review_at: nextReviewAt
      })
      .eq('id', card.id);

    if (error) {
      alert(error.message);
      return;
    }

    setShowAnswer(false);
    setCurrentIndex((prev) => prev + 1);
  }

  if (loading) return <div>loading...</div>;

  if (!cardsDue.length) return <div>no cards due rn. nice work!</div>;

  if (currentIndex >= cardsDue.length) return <div>all reviews complete!</div>;

  const currentCard = cardsDue[currentIndex];

  return (
    <div className="max-w-3xl mx-auto p-4 fade-in">
      <h1 className="text-4xl font-semibold mb-6">review session</h1>
      <p className="mb-4">
        card {currentIndex + 1} of {cardsDue.length}
      </p>
      <div className="border p-4 rounded">
        <div className="font-semibold mb-4">q: {currentCard.question_text}</div>
        {!showAnswer ? (
          <button onClick={() => setShowAnswer(true)} className="btn">
            show answer
          </button>
        ) : (
          <div>
            <p className="mb-4">
              <strong>a:</strong> {currentCard.answer_text}
            </p>
            <p className="mb-4 font-medium">how well did you recall it?</p>
            <div className="grid grid-cols-5 gap-2">
              <button onClick={() => handleRating(1)} className="btn bg-red-500">
                1
              </button>
              <button onClick={() => handleRating(2)} className="btn bg-orange-500">
                2
              </button>
              <button onClick={() => handleRating(3)} className="btn bg-yellow-500">
                3
              </button>
              <button onClick={() => handleRating(4)} className="btn bg-green-500">
                4
              </button>
              <button onClick={() => handleRating(5)} className="btn bg-blue-500">
                5
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 'use client';
//
// import { useEffect, useState } from 'react';
// import { useAuth } from '@/app/auth-provider';
// import { useRouter } from 'next/navigation';
// import { supabaseBrowser } from '@/lib/supabaseClient';
// import { supermemo } from '@/lib/supermemo';
//
// type CardType = {
//   id: string;
//   question_text: string;
//   answer_text: string;
//   correct_review_streak_count: number;
//   ease_factor: number;
//   next_review_at: string;
// };
//
// export default function ReviewPage() {
//   const { session, loading } = useAuth();
//   const router = useRouter();
//   const [cardsDue, setCardsDue] = useState<CardType[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [showAnswer, setShowAnswer] = useState(false);
//
//   // for typed approach:
//   const [userInput, setUserInput] = useState('');
//   const [graded, setGraded] = useState<'not-graded' | 'correct' | 'incorrect'>('not-graded');
//
//   useEffect(() => {
//     if (!session && !loading) {
//       router.push('/login');
//       return;
//     }
//     fetchDueCards();
//   }, [session]);
//
//   async function fetchDueCards() {
//     const nowIso = new Date().toISOString();
//     const { data, error } = await supabaseBrowser
//       .from('cards')
//       .select('*')
//       .eq('user_id', session?.user.id)
//       .lte('next_review_at', nowIso);
//     if (error) {
//       alert(error.message);
//     } else {
//       setCardsDue(data as CardType[]);
//     }
//   }
//
//   async function handleRating(rating: number) {
//     const card = cardsDue[currentIndex];
//     // run supermemo
//     const { newStreak, newEaseFactor, interval } = supermemo(
//       card.correct_review_streak_count,
//       card.ease_factor,
//       rating
//     );
//     // set new next review date
//     const now = new Date();
//     now.setDate(now.getDate() + interval);
//     const nextReviewAt = now.toISOString();
//
//     // update supabase
//     const { error } = await supabaseBrowser
//       .from('cards')
//       .update({
//         correct_review_streak_count: newStreak,
//         ease_factor: newEaseFactor,
//         next_review_at: nextReviewAt
//       })
//       .eq('id', card.id);
//
//     if (error) {
//       alert(error.message);
//       return;
//     }
//
//     // reset states, move to next card
//     setShowAnswer(false);
//     setUserInput('');
//     setGraded('not-graded');
//     setCurrentIndex((prev) => prev + 1);
//   }
//
//   // typed approach auto-check (placeholder example)
//   function autoCheckAnswer() {
//     const card = cardsDue[currentIndex];
//     // naive check: case-insensitive exact match
//     const correct = card.answer_text.trim().toLowerCase() === userInput.trim().toLowerCase();
//     setGraded(correct ? 'correct' : 'incorrect');
//     setShowAnswer(true);
//   }
//
//   if (loading) {
//     return <div>loading...</div>;
//   }
//
//   if (!cardsDue.length) {
//     return <div>no cards due right now</div>;
//   }
//
//   if (currentIndex >= cardsDue.length) {
//     return <div>all done with today’s reviews!</div>;
//   }
//
//   const currentCard = cardsDue[currentIndex];
//
//   return (
//     <div className="max-w-md mx-auto">
//       <h1 className="text-2xl mb-4">review session</h1>
//       <p className="mb-2">
//         card {currentIndex + 1} of {cardsDue.length}
//       </p>
//       <div className="border p-4 rounded">
//         <div className="font-semibold mb-2">q: {currentCard.question_text}</div>
//
//         {!showAnswer && (
//           <>
//             {/* typed answer approach */}
//             <input
//               type="text"
//               className="border p-2 w-full"
//               placeholder="type your answer"
//               value={userInput}
//               onChange={(e) => setUserInput(e.target.value)}
//             />
//             <div className="flex gap-2 mt-2">
//               <button
//                 onClick={autoCheckAnswer}
//                 className="bg-blue-500 text-white px-4 py-2 rounded"
//               >
//                 check answer
//               </button>
//               <button
//                 onClick={() => setShowAnswer(true)}
//                 className="bg-gray-300 px-4 py-2 rounded"
//               >
//                 show answer
//               </button>
//             </div>
//           </>
//         )}
//
//         {showAnswer && (
//           <div className="mt-2 mb-4">
//             <strong>a:</strong> {currentCard.answer_text}
//             {graded === 'correct' && (
//               <p className="text-green-600 mt-1">you got it right!</p>
//             )}
//             {graded === 'incorrect' && (
//               <p className="text-red-500 mt-1">not quite. see the correct answer above.</p>
//             )}
//           </div>
//         )}
//
//         {/* rating buttons if we have an answer */}
//         {showAnswer && (
//           <div>
//             <p className="mt-4 mb-2 font-medium">how well did you recall it?</p>
//             <div className="flex flex-col gap-1">
//               <button
//                 onClick={() => handleRating(1)}
//                 className="bg-red-400 text-white px-4 py-2 rounded"
//               >
//                 1 - i forgot completely
//               </button>
//               <button
//                 onClick={() => handleRating(2)}
//                 className="bg-orange-400 text-white px-4 py-2 rounded"
//               >
//                 2 - i struggled
//               </button>
//               <button
//                 onClick={() => handleRating(3)}
//                 className="bg-yellow-400 text-white px-4 py-2 rounded"
//               >
//                 3 - partial recall
//               </button>
//               <button
//                 onClick={() => handleRating(4)}
//                 className="bg-green-500 text-white px-4 py-2 rounded"
//               >
//                 4 - mostly correct
//               </button>
//               <button
//                 onClick={() => handleRating(5)}
//                 className="bg-blue-500 text-white px-4 py-2 rounded"
//               >
//                 5 - perfect recall
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
