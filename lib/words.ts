import type { Course } from "./courses";
import { toUnits, type Unit } from "./romaji";
import { WORD_LISTS, type Entry } from "./wordlists";

/**
 * 出題する ことば
 * - kana：打つ 読み（ひらがな。えいたんごでは英単語）
 * - display：画面に 大きく出す 表示（漢字など。ないときは kana を出す）
 * - hint：えいたんごの 絵文字
 */
export type Word = { kana: string; units: Unit[]; display?: string; hint?: string };

/** ステージ（time は 60 びょうで何もじ打てるか、english は えいたんご、weak は にがての とっくん） */
export type StageId = "lv1" | "lv2" | "lv3" | "time" | "english" | "weak";

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

function toWord(entry: Entry): Word {
  if (typeof entry === "string") return { kana: entry, units: toUnits(entry) };
  const [display, reading] = entry;
  return { kana: reading, display, units: toUnits(reading) };
}

/** 英単語は 1文字ずつ そのまま打つ（ゆれなし） */
function englishWord([word, hint]: [string, string]): Word {
  return { kana: word, hint, units: [...word].map((ch) => ({ kana: ch, options: [ch] })) };
}

/** そのコース・ステージで 出す ことば ぜんぶ */
export function wordsFor(stage: StageId, course: Course = "kids"): Word[] {
  const lists = WORD_LISTS[course];
  if (stage === "english") return lists.english.map(englishWord);
  const entries = stage === "time" || stage === "weak" ? [...lists.lv2, ...lists.lv3] : lists[stage];
  return entries.map(toWord);
}

/** ことばに、にがてな文字が どれだけ入っているか（標準の打ち方で数える） */
export function weakScore(word: Word, missStats: Record<string, number>): number {
  const romaji = word.units.map((u) => u.options[0]).join("");
  return [...romaji].reduce((sum, ch) => sum + (missStats[ch] ?? 0), 0);
}

/** とっくん：にがてな文字が多い ことば 上位 20 こから、10 こを ランダムに出す */
function pickWeakWords(missStats: Record<string, number>, course: Course): Word[] {
  const ranked = wordsFor("weak", course)
    .map((w) => ({ w, score: weakScore(w, missStats) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, WORDS_PER_ROUND * 2)
    .map((x) => x.w);
  return shuffle(ranked).slice(0, WORDS_PER_ROUND);
}

/** ステージのことばをランダムに選ぶ（同じことばは続けて出さない） */
export function pickWords(stage: StageId, missStats: Record<string, number> = {}, course: Course = "kids"): Word[] {
  if (stage === "weak") return pickWeakWords(missStats, course);
  const n = stage === "time" ? Infinity : WORDS_PER_ROUND; // タイムアタックは全部をまぜて出す
  return shuffle(wordsFor(stage, course)).slice(0, n);
}
