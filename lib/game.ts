import { guide, isDone, startMatch, stepMatch, type MatchState } from "./romaji";
import type { Word } from "./words";

/** 1かいぶんの遊びの状態 */
export type GameState = {
  words: Word[];
  index: number;                     // 何こめのことばか（0 から）
  match: MatchState;                 // ことばの中で、どこまで打ったか
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
    words, index: 0, match: startMatch(), wrong: false,
    correct: 0, miss: 0, missChars: {}, startedAt: null, finishedAt: null,
  };
}

/** いまのことばのお手本（打った部分と、これから打つ部分） */
export function currentGuide(s: GameState) {
  return guide(s.words[s.index].units, s.match);
}

/** 次に打つ文字（お手本の標準の打ち方で） */
export function expectedChar(s: GameState): string | undefined {
  return currentGuide(s).rest[0];
}

/** 1文字打ったときの判定。新しい状態と、何が起きたかを返す */
export function typeChar(s: GameState, ch: string, now: number): [GameState, KeyResult] {
  if (s.finishedAt !== null) return [s, "ignored"];
  const word = s.words[s.index];
  const next = stepMatch(word.units, s.match, ch);

  if (!next) {
    const expected = expectedChar(s) ?? "?";
    return [
      { ...s, wrong: true, miss: s.miss + 1, missChars: { ...s.missChars, [expected]: (s.missChars[expected] ?? 0) + 1 } },
      "wrong",
    ];
  }

  const ok: GameState = { ...s, match: next, wrong: false, correct: s.correct + 1, startedAt: s.startedAt ?? now };
  if (!isDone(word.units, next)) return [ok, "correct"];

  // ことばを打ち終えた
  if (s.index + 1 < s.words.length) return [{ ...ok, index: s.index + 1, match: startMatch() }, "word-done"];
  return [{ ...ok, finishedAt: now }, "finished"];
}
