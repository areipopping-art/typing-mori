/** 1かいぶんの結果（/play → /result の受け渡し） */
export type LastResult = {
  correct: number;                   // 正しく打った文字数
  miss: number;                      // まちがえた回数
  seconds: number;                   // かかった時間（秒）
  missChars: Record<string, number>; // まちがえた文字と回数
  newRecord: boolean;                // さいこうきろくを こえたか
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

/** さいこうきろく（はやさ・もじ/分）。localStorage のキー：typing-mori */
type Data = { bestSpeed: number | null };
const DATA_KEY = "typing-mori";

export function loadBest(): number | null {
  try {
    const d = JSON.parse(localStorage.getItem(DATA_KEY) ?? "{}") as Partial<Data>;
    return typeof d.bestSpeed === "number" ? d.bestSpeed : null;
  } catch {
    return null;
  }
}

/** はやさが さいこうきろくを こえていたら保存して true を返す */
export function updateBest(speed: number): boolean {
  const best = loadBest();
  if (best !== null && speed <= best) return false;
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify({ bestSpeed: speed } satisfies Data));
  } catch {
    // 保存できなくても遊びは続けられる
  }
  return true;
}
