import type { StageId } from "./words";

export type Sticker = { id: string; stage: StageId; stars: 1 | 2 | 3; emoji: string; name: string };

/** シール 15 まい（ステージごとに ★1・★2・★3 を はじめて とったときに もらえる） */
export const STICKERS: Sticker[] = [
  { id: "lv1-1", stage: "lv1", stars: 1, emoji: "🌱", name: "ふたば" },
  { id: "lv1-2", stage: "lv1", stars: 2, emoji: "🍀", name: "クローバー" },
  { id: "lv1-3", stage: "lv1", stars: 3, emoji: "🌷", name: "チューリップ" },
  { id: "lv2-1", stage: "lv2", stars: 1, emoji: "🐞", name: "てんとうむし" },
  { id: "lv2-2", stage: "lv2", stars: 2, emoji: "🦋", name: "ちょうちょ" },
  { id: "lv2-3", stage: "lv2", stars: 3, emoji: "🐿️", name: "りすくん" },
  { id: "lv3-1", stage: "lv3", stars: 1, emoji: "🍄", name: "きのこ" },
  { id: "lv3-2", stage: "lv3", stars: 2, emoji: "🦉", name: "ふくろう" },
  { id: "lv3-3", stage: "lv3", stars: 3, emoji: "🦌", name: "しか" },
  { id: "time-1", stage: "time", stars: 1, emoji: "🌰", name: "どんぐり" },
  { id: "time-2", stage: "time", stars: 2, emoji: "⚡", name: "いなずま" },
  { id: "time-3", stage: "time", stars: 3, emoji: "👑", name: "おうかん" },
  { id: "english-1", stage: "english", stars: 1, emoji: "🍎", name: "りんご" },
  { id: "english-2", stage: "english", stars: 2, emoji: "🌍", name: "ちきゅう" },
  { id: "english-3", stage: "english", stars: 3, emoji: "🚀", name: "ロケット" },
];

/** この回の ★で もらえる シールのうち、まだ もっていないもの */
export function earnedStickers(stage: StageId, stars: number, owned: string[]): string[] {
  return STICKERS.filter((s) => s.stage === stage && s.stars <= stars && !owned.includes(s.id)).map((s) => s.id);
}

export function stickerOf(id: string): Sticker | undefined {
  return STICKERS.find((s) => s.id === id);
}
