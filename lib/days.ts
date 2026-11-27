/** 端末の日付で "2026-11-27" の形にする */
export function dayKey(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** today から さかのぼって n 日ぶん（古い順） */
export function lastDays(n: number, today: Date = new Date()): Date[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (n - 1 - i));
    return d;
  });
}

/**
 * れんぞくで遊んだ日数
 * 今日まだ遊んでいなくても、きのうまで続いていれば その日数を返す（今日あそべば つながる）
 */
export function streak(playDays: string[], today: Date = new Date()): number {
  const set = new Set(playDays);
  const d = new Date(today);
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(dayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
