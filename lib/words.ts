import { toUnits, type Unit } from "./romaji";

/** 出題する ことば。kana は画面に大きく出す文字（えいたんごでは英単語）、hint は絵文字 */
export type Word = { kana: string; units: Unit[]; hint?: string };

/** ステージ（time は 60 びょうで何もじ打てるか、english は えいたんご、weak は にがての とっくん） */
export type StageId = "lv1" | "lv2" | "lv3" | "time" | "english" | "weak";

/** ステージごとのことば（ひらがなだけ。ローマ字は romaji.ts で自動で作る） */
const LISTS: Record<"lv1" | "lv2" | "lv3", string[]> = {
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

/** えいたんご（絵文字の ヒントつき） */
const ENGLISH: [string, string][] = [
  ["cat", "🐱"], ["dog", "🐶"], ["fish", "🐟"], ["bird", "🐦"], ["frog", "🐸"],
  ["bear", "🐻"], ["lion", "🦁"], ["duck", "🦆"], ["cow", "🐮"], ["pig", "🐷"],
  ["apple", "🍎"], ["banana", "🍌"], ["lemon", "🍋"], ["grape", "🍇"], ["milk", "🥛"],
  ["cake", "🍰"], ["egg", "🥚"], ["bread", "🍞"], ["sun", "☀️"], ["moon", "🌙"],
  ["star", "⭐"], ["tree", "🌳"], ["book", "📕"], ["bus", "🚌"], ["car", "🚗"],
  ["ball", "⚽"], ["pen", "🖊️"], ["cup", "🥤"], ["hat", "🎩"], ["rain", "🌧️"],
];

/** 英単語は 1文字ずつ そのまま打つ（ゆれなし） */
function englishWord([word, hint]: [string, string]): Word {
  return { kana: word, hint, units: [...word].map((ch) => ({ kana: ch, options: [ch] })) };
}

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

function wordsFor(stage: StageId): Word[] {
  if (stage === "english") return ENGLISH.map(englishWord);
  const kana = stage === "time" || stage === "weak" ? [...LISTS.lv2, ...LISTS.lv3] : LISTS[stage];
  return kana.map((k) => ({ kana: k, units: toUnits(k) }));
}

/** ことばに、にがてな文字が どれだけ入っているか（標準の打ち方で数える） */
export function weakScore(word: Word, missStats: Record<string, number>): number {
  const romaji = word.units.map((u) => u.options[0]).join("");
  return [...romaji].reduce((sum, ch) => sum + (missStats[ch] ?? 0), 0);
}

/** とっくん：にがてな文字が多い ことば 上位 20 こから、10 こを ランダムに出す */
function pickWeakWords(missStats: Record<string, number>): Word[] {
  const ranked = wordsFor("weak")
    .map((w) => ({ w, score: weakScore(w, missStats) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, WORDS_PER_ROUND * 2)
    .map((x) => x.w);
  return shuffle(ranked).slice(0, WORDS_PER_ROUND);
}

/** ステージのことばをランダムに選ぶ（同じことばは続けて出さない） */
export function pickWords(stage: StageId, missStats: Record<string, number> = {}): Word[] {
  if (stage === "weak") return pickWeakWords(missStats);
  const n = stage === "time" ? Infinity : WORDS_PER_ROUND; // タイムアタックは全部をまぜて出す
  return shuffle(wordsFor(stage)).slice(0, n);
}
