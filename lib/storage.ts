/** 1かいぶんの結果（/play → /result の受け渡し） */
export type LastResult = {
  correct: number;                   // 正しく打った文字数
  miss: number;                      // まちがえた回数
  seconds: number;                   // かかった時間（秒）
  missChars: Record<string, number>; // まちがえた文字と回数
};

const LAST_KEY = "typing-mori-last";

export function saveLast(r: LastResult) {
  try {
    sessionStorage.setItem(LAST_KEY, JSON.stringify(r));
  } catch {
    // 保存できない環境（プライベートモードなど）でも遊べるようにする
  }
}

export function loadLast(): LastResult | null {
  try {
    const raw = sessionStorage.getItem(LAST_KEY);
    return raw ? (JSON.parse(raw) as LastResult) : null;
  } catch {
    return null;
  }
}
