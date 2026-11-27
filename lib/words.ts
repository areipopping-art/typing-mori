import { toUnits, type Unit } from "./romaji";

export type Word = { kana: string; units: Unit[] };

/** ステージ（timeattack は 60 びょうで何もじ打てるか） */
export type StageId = "lv1" | "lv2" | "lv3" | "time";

/** ステージごとのことば（ひらがなだけ。ローマ字は romaji.ts で自動で作る） */
const LISTS: Record<Exclude<StageId, "time">, string[]> = {
  // Lv1 あいうえお：1〜2文字
  lv1: [
    "あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ",
    "いえ", "うえ", "あお", "かお", "いか", "えき", "あき", "いけ", "おか", "きく",
  ],
  // Lv2 みじかいことば：2〜3文字
  lv2: [
    "ねこ", "いぬ", "くま", "うさぎ", "さる", "たぬき", "りす", "ことり", "かえる", "めだか",
    "かめ", "ぶた", "うま", "やぎ", "あり", "くり", "もも", "ぶどう", "すいか", "かき",
    "もり", "やま", "うみ", "そら", "くも", "あめ", "はな", "はっぱ", "きのこ", "さかな",
    "たまご", "しか", "きつね", "いちご", "みかん", "ほし", "つき", "ふね", "にじ", "ぱんだ", "きりん",
  ],
  // Lv3 ながいことば：4文字以上
  lv3: [
    "ひこうき", "おにぎり", "ありがとう", "おはよう", "どんぐり", "ともだち", "しんかんせん",
    "かたつむり", "ちょうちょ", "でんしゃ", "ぎゅうにゅう", "とうもろこし", "ひまわり",
    "にんじん", "らいおん", "せんせい", "がっこう", "ぺんぎん", "くわがた", "かぶとむし",
  ],
};

/** 1かいに出すことばの数 */
export const WORDS_PER_ROUND = 10;

/** タイムアタックの制限時間（秒） */
export const TIME_LIMIT = 60;

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function kanaFor(stage: StageId): string[] {
  return stage === "time" ? [...LISTS.lv2, ...LISTS.lv3] : LISTS[stage];
}

/** ステージのことばをランダムに選ぶ（同じことばは続けて出さない） */
export function pickWords(stage: StageId): Word[] {
  const n = stage === "time" ? Infinity : WORDS_PER_ROUND; // タイムアタックは全部をまぜて出す
  return shuffle(kanaFor(stage))
    .slice(0, n)
    .map((kana) => ({ kana, units: toUnits(kana) }));
}
