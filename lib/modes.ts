/**
 * あそびかたの モード（ペルソナに合わせる）
 * - a：はじめて モード（ペルソナ A：はじめてキーボードをさわる子）
 * - b：チャレンジ モード（ペルソナ B：ローマ字を習って、はやく打ちたい子）
 */
export type Mode = "a" | "b";

export type ModeInfo = { id: Mode; emoji: string; name: string; short: string; desc: string[] };

export const MODES: ModeInfo[] = [
  {
    id: "a",
    emoji: "🌱",
    name: "はじめて モード",
    short: "はじめて",
    desc: ["キーボードと ゆびの ガイドが でるよ", "じかんは きにしないで ゆっくり", "★が もらいやすいよ"],
  },
  {
    id: "b",
    emoji: "🔥",
    name: "チャレンジ モード",
    short: "チャレンジ",
    desc: ["うちながら はやさが わかるよ", "タイムアタックで きろくに ちょうせん", "きろくの グラフが みられるよ"],
  },
];

export function modeOf(id: Mode): ModeInfo {
  return MODES.find((m) => m.id === id)!;
}
