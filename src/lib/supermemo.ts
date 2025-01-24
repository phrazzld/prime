export function supermemo(
  streak: number,
  easeFactor: number,
  rating: number
): {
  newStreak: number;
  newEaseFactor: number;
  interval: number;
} {
  // if rating < 3 => user forgot, so reset streak
  const newStreak = rating < 3 ? 0 : streak + 1;

  // supermemo-ish formula for updated ef
  let newEf =
    easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
  if (newEf < 1.3) {
    newEf = 1.3;
  }

  // approximate interval logic
  let interval: number;
  if (newStreak <= 1) {
    interval = 1;
  } else if (newStreak === 2) {
    interval = 6;
  } else {
    interval = Math.round(streak * newEf);
  }

  return {
    newStreak,
    newEaseFactor: newEf,
    interval
  };
}
