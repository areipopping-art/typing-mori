import type { Course } from "./courses";
import type { Mode } from "./modes";
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

export type StarRule = { acc3: number; speed3: number; acc2: number };

/**
 * ★の基準（コース × モード。要件定義書 F-09・F-30・F-35）
 * はじめて（A）は ★3 の はやさを ひくく、正確さも ゆるめにする
 */
export const STAR_RULES: Record<Course, Record<Mode, StarRule>> = {
  kids: { a: { acc3: 90, speed3: 30, acc2: 75 }, b: { acc3: 95, speed3: 60, acc2: 85 } },
  student: { a: { acc3: 90, speed3: 60, acc2: 75 }, b: { acc3: 95, speed3: 120, acc2: 85 } },
  adult: { a: { acc3: 90, speed3: 80, acc2: 75 }, b: { acc3: 95, speed3: 150, acc2: 85 } },
};

export function stars(speed: number, acc: number, mode: Mode = "b", course: Course = "kids"): 1 | 2 | 3 {
  const r = STAR_RULES[course][mode];
  if (acc >= r.acc3 && speed >= r.speed3) return 3;
  if (acc >= r.acc2) return 2;
  return 1;
}

/** まちがえた文字を、回数の多い順に並べる */
export function sortMissChars(missChars: Record<string, number>): [string, number][] {
  return Object.entries(missChars).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
