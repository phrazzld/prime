export type TCard = {
  id: string;
  created_at: Date;
  user_id: string;
  deck_id: string;
  question_text: string;
  answer_text: string;
  correct_review_streak_count: number;
  ease_factor: number;
  next_review_at: Date;
};

export type TDeck = {
  id: string;
  created_at: Date;
  user_id: string;
  title: string;
};

export type TSnippet = {
  id: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  content: string;
};
