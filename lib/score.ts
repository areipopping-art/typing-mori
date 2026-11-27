import type { LastResult } from "./storage";

/** はやさ：1ぷんあたりに正しく打った文字数（四捨五入） */
export function speedPerMinute(r: Pick<LastResult, "correct" | "seconds">): number {
  if (r.seconds <= 0) return 0;
  return Math.round(r.correct / (r.seconds / 60));
}

/** せいかくさ：正しく打った ÷（正しい＋まちがい）×100（四捨五入、%） */
export function accuracy(r: Pick<LastResult, "correct" | "miss">): number {
  const total = r.correct + r.miss;
  return total === 0 ? 0 : Math.round((r.correct / total) * 100);
}

/**
 * ★の数（1〜3）。基準は要件定義書 F-09 の仮の値
 * ★3：せいかくさ 95% 以上 かつ はやさ 60 もじ/分 以上
 * ★2：せいかくさ 85% 以上
 */
export function stars(speed: number, acc: number): 1 | 2 | 3 {
  if (acc >= 95 && speed >= 60) return 3;
  if (acc >= 85) return 2;
  return 1;
}

/** まちがえた文字を、回数の多い順に並べる */
export function sortMissChars(missChars: Record<string, number>): [string, number][] {
  return Object.entries(missChars).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
