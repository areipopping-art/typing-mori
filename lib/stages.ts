import type { StageId } from "./words";
import type { Data } from "./storage";

/** lockHint は、まだ遊べないときに出す説明 */
export type Stage = { id: StageId; key: string; name: string; desc: string; emoji: string; lockHint?: string };

export const STAGES: Stage[] = [
  { id: "lv1", key: "1", name: "Lv1 あいうえお", desc: "1〜2もじの みじかい ことば", emoji: "🌱" },
  {
    id: "lv2", key: "2", name: "Lv2 みじかい ことば", desc: "どうぶつ や くだもの", emoji: "🌿",
    lockHint: "Lv1 で ★3 を とると ひらくよ",
  },
  {
    id: "lv3", key: "3", name: "Lv3 ながい ことば", desc: "4もじ いじょうの ことば", emoji: "🌳",
    lockHint: "Lv2 で ★3 を とると ひらくよ",
  },
  { id: "time", key: "4", name: "タイムアタック", desc: "60びょうで なんもじ うてるかな？", emoji: "⏱" },
  { id: "english", key: "5", name: "えいたんご", desc: "cat や apple を うってみよう", emoji: "🔤" },
  {
    id: "weak", key: "6", name: "とっくん", desc: "まちがえやすい もじが はいった ことばを れんしゅう", emoji: "💪",
    lockHint: "まちがえた もじが まだ ないよ。ほかの ステージで あそんでね",
  },
];

export const STAGE_IDS = STAGES.map((s) => s.id);

export function isStageId(v: unknown): v is StageId {
  return typeof v === "string" && (STAGE_IDS as string[]).includes(v);
}

export function stageOf(id: StageId): Stage {
  return STAGES.find((s) => s.id === id)!;
}

/** そのステージが あそべるか（前のステージで ★3 を取ると ひらく。タイムアタック・えいたんごは いつでも） */
/** そのモードで ステージえらびに 出すか（はじめて モードでは タイムアタックを 出さない） */
export function isShown(id: StageId, data: Data): boolean {
  return !(id === "time" && data.mode === "a");
}

export function isUnlocked(id: StageId, data: Data): boolean {
  if (!isShown(id, data)) return false;
  if (id === "lv2") return data.stars.lv1 === 3;
  if (id === "lv3") return data.stars.lv2 === 3;
  if (id === "weak") return Object.keys(data.missStats).length > 0;
  return true;
}

/** 次にひらくステージ（★3 を取ったときに使う） */
export function nextStage(id: StageId): StageId | null {
  return id === "lv1" ? "lv2" : id === "lv2" ? "lv3" : null;
}
