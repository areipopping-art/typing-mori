export type Word = { kana: string; romaji: string };

/**
 * 出題することば（子どもが知っている、ひらがなだけのことば）
 * MVP ではローマ字の打ち方が1通りに決まることばだけにしている。
 * し（shi/si）・つ・ち・ふ・じ・ん・きゃ などは v1.0 の「ローマ字のゆれ対応」で追加する。
 */
export const WORDS: Word[] = [
  { kana: "ねこ", romaji: "neko" },
  { kana: "いぬ", romaji: "inu" },
  { kana: "くま", romaji: "kuma" },
  { kana: "うさぎ", romaji: "usagi" },
  { kana: "さる", romaji: "saru" },
  { kana: "たぬき", romaji: "tanuki" },
  { kana: "りす", romaji: "risu" },
  { kana: "ことり", romaji: "kotori" },
  { kana: "かえる", romaji: "kaeru" },
  { kana: "めだか", romaji: "medaka" },
  { kana: "かめ", romaji: "kame" },
  { kana: "ぶた", romaji: "buta" },
  { kana: "うま", romaji: "uma" },
  { kana: "やぎ", romaji: "yagi" },
  { kana: "あり", romaji: "ari" },
  { kana: "くり", romaji: "kuri" },
  { kana: "もも", romaji: "momo" },
  { kana: "ぶどう", romaji: "budou" },
  { kana: "すいか", romaji: "suika" },
  { kana: "かき", romaji: "kaki" },
  { kana: "もり", romaji: "mori" },
  { kana: "やま", romaji: "yama" },
  { kana: "うみ", romaji: "umi" },
  { kana: "そら", romaji: "sora" },
  { kana: "くも", romaji: "kumo" },
  { kana: "あめ", romaji: "ame" },
  { kana: "はな", romaji: "hana" },
  { kana: "はっぱ", romaji: "happa" },
  { kana: "きのこ", romaji: "kinoko" },
  { kana: "さかな", romaji: "sakana" },
  { kana: "ひこうき", romaji: "hikouki" },
  { kana: "おにぎり", romaji: "onigiri" },
  { kana: "たまご", romaji: "tamago" },
  { kana: "ありがとう", romaji: "arigatou" },
  { kana: "おはよう", romaji: "ohayou" },
];

/** 1かいに出すことばの数 */
export const WORDS_PER_ROUND = 10;

/** ことばをランダムに n こ選ぶ（同じことばは出さない） */
export function pickWords(n = WORDS_PER_ROUND): Word[] {
  const list = [...WORDS];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list.slice(0, n);
}
