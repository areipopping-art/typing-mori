import type { StageId } from "./words";
import type { Data } from "./storage";

export type Stage = { id: StageId; key: string; name: string; desc: string; emoji: string };

export const STAGES: Stage[] = [
  { id: "lv1", key: "1", name: "Lv1 あいうえお", desc: "1〜2もじの みじかい ことば", emoji: "🌱" },
  { id: "lv2", key: "2", name: "Lv2 みじかい ことば", desc: "どうぶつ や くだもの", emoji: "🌿" },
  { id: "lv3", key: "3", name: "Lv3 ながい ことば", desc: "4もじ いじょうの ことば", emoji: "🌳" },
  { id: "time", key: "4", name: "タイムアタック", desc: "60びょうで なんもじ うてるかな？", emoji: "⏱" },
];

export const STAGE_IDS = STAGES.map((s) => s.id);

export function isStageId(v: unknown): v is StageId {
  return typeof v === "string" && (STAGE_IDS as string[]).includes(v);
}

export function stageOf(id: StageId): Stage {
  return STAGES.find((s) => s.id === id)!;
}

/** そのステージが あそべるか（前のステージで ★3 を取ると ひらく。タイムアタックは いつでも） */
export function isUnlocked(id: StageId, data: Data): boolean {
  if (id === "lv2") return data.stars.lv1 === 3;
  if (id === "lv3") return data.stars.lv2 === 3;
  return true;
}

/** 次にひらくステージ（★3 を取ったときに使う） */
export function nextStage(id: StageId): StageId | null {
  return id === "lv1" ? "lv2" : id === "lv2" ? "lv3" : null;
}
