import type { Course } from "./courses";

/**
 * いっしょに練習する キャラクター（コースごと。F-23・F-37）
 * - badge：右下に 小さく出す 持ち物
 * - greet・praise・miss：口ぐせ（ないときは texts.ts の ふつうの言葉を使う）
 */
export type CharacterInfo = {
  id: string;
  emoji: string;
  name: string;
  badge?: string;
  greet?: string;
  praise?: string[];
  miss?: (ch: string) => string;
};

export const CHARACTERS_BY_COURSE: Record<Course, CharacterInfo[]> = {
  kids: [
    { id: "risu", emoji: "🐿️", name: "りすくん" },
    { id: "usagi", emoji: "🐰", name: "うさぎさん" },
    { id: "kitsune", emoji: "🦊", name: "きつねくん" },
    { id: "kuma", emoji: "🐻", name: "くまさん" },
    { id: "panda", emoji: "🐼", name: "ぱんださん" },
  ],
  student: [
    {
      id: "teacher", emoji: "🧑‍🏫", name: "担任の先生",
      greet: "今日もタイピングの授業を始めますよ",
      praise: ["よくできました！", "花丸です 💮"],
      miss: (ch) => `落ち着いて。「${ch}」ですよ`,
    },
    {
      id: "principal", emoji: "👴", badge: "🏫", name: "校長先生",
      greet: "継続は力なりですぞ",
      praise: ["素晴らしいですぞ！", "全校集会で表彰ものですな"],
      miss: (ch) => `焦らずに。「${ch}」ですぞ`,
    },
    {
      id: "soccer", emoji: "👦", badge: "⚽", name: "サッカー部の男子",
      greet: "部活の前にタイピングでウォーミングアップ！",
      praise: ["ナイスシュート！", "ゴール！"],
      miss: (ch) => `ドンマイ！「${ch}」だぜ`,
    },
    {
      id: "basketball", emoji: "👧", badge: "🏀", name: "バスケ部の女子",
      greet: "一緒にがんばろ！",
      praise: ["ナイッシュー！", "スリーポイント決まった！"],
      miss: (ch) => `ドンマイ！「${ch}」だよ`,
    },
    {
      id: "brass", emoji: "👧", badge: "🎺", name: "吹奏楽部の女子",
      greet: "リズムよく打っていこう♪",
      praise: ["いい音色！", "ハーモニーばっちり♪"],
      miss: (ch) => `テンポ落としていこ。「${ch}」だよ`,
    },
  ],
  adult: [
    {
      id: "boss", emoji: "🧑‍💼", badge: "📋", name: "上司（課長）",
      greet: "今日もよろしく頼むよ",
      praise: ["いい仕事だ！", "その調子で頼む"],
      miss: (ch) => `焦らず確認だ。「${ch}」だぞ`,
    },
    {
      id: "president", emoji: "👨‍🦲", badge: "👔", name: "社長",
      greet: "うむ、期待しているよ",
      praise: ["うむ、見事だ", "君は我が社の星だな"],
      miss: (ch) => `うむ…「${ch}」だな`,
    },
    {
      id: "junior", emoji: "🧑", badge: "🔰", name: "新人の後輩",
      greet: "先輩、よろしくお願いします！",
      praise: ["先輩さすがっす！", "速すぎて見えないっす！"],
      miss: (ch) => `先輩、「${ch}」っす！`,
    },
    {
      id: "peer", emoji: "👩‍💼", badge: "☕", name: "同期",
      greet: "コーヒー片手にがんばろ",
      praise: ["やるじゃん！", "さすが同期！"],
      miss: (ch) => `ドンマイ、「${ch}」だよ`,
    },
  ],
};

export const DEFAULT_CHARACTER = "risu";

export function charactersFor(course: Course | null | undefined): CharacterInfo[] {
  return CHARACTERS_BY_COURSE[course ?? "kids"];
}

/** コースの キャラクター。見つからないときは そのコースの 1人目 */
export function characterOf(id: string | undefined, course: Course | null | undefined): CharacterInfo {
  const list = charactersFor(course);
  return list.find((c) => c.id === id) ?? list[0];
}

/** いま 選んでいる キャラクター（コースごとに 覚える。子どもは 前からの character も見る） */
export function selectedCharacter(data: {
  course: Course | null;
  character: string;
  characterByCourse: Partial<Record<Course, string>>;
}): CharacterInfo {
  const course = data.course ?? "kids";
  const id = data.characterByCourse[course] ?? (course === "kids" ? data.character : undefined);
  return characterOf(id, course);
}

/** 口ぐせと ふつうの言葉を 半々で まぜる */
export function pickLine<T>(own: T | undefined, normal: T): T {
  return own !== undefined && Math.random() < 0.5 ? own : normal;
}
