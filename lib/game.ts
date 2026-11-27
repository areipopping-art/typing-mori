import type { Word } from "./words";

/** 1かいぶんの遊びの状態 */
export type GameState = {
  words: Word[];
  index: number;                     // 何こめのことばか（0 から）
  pos: number;                       // ことばの中で、次に打つ文字の位置
  wrong: boolean;                    // 今の文字をまちがえている
  correct: number;                   // 正しく打った文字数
  miss: number;                      // まちがえた回数
  missChars: Record<string, number>; // まちがえた文字と回数（お手本の文字ごと）
  startedAt: number | null;          // 最初に正しく打った時刻（ms）
  finishedAt: number | null;         // 全部打ち終えた時刻（ms）
};

export type KeyResult = "correct" | "wrong" | "word-done" | "finished" | "ignored";

export function initGame(words: Word[]): GameState {
  return {
    words, index: 0, pos: 0, wrong: false,
    correct: 0, miss: 0, missChars: {}, startedAt: null, finishedAt: null,
  };
}

/** 1文字打ったときの判定。新しい状態と、何が起きたかを返す */
export function typeChar(s: GameState, ch: string, now: number): [GameState, KeyResult] {
  if (s.finishedAt !== null) return [s, "ignored"];
  const word = s.words[s.index];
  const expected = word.romaji[s.pos];

  if (ch !== expected) {
    return [
      { ...s, wrong: true, miss: s.miss + 1, missChars: { ...s.missChars, [expected]: (s.missChars[expected] ?? 0) + 1 } },
      "wrong",
    ];
  }

  const next: GameState = { ...s, wrong: false, correct: s.correct + 1, pos: s.pos + 1, startedAt: s.startedAt ?? now };
  if (next.pos < word.romaji.length) return [next, "correct"];

  // ことばを打ち終えた
  next.index += 1;
  next.pos = 0;
  if (next.index < s.words.length) return [next, "word-done"];
  next.index = s.words.length - 1;
  next.pos = word.romaji.length;
  next.finishedAt = now;
  return [next, "finished"];
}
