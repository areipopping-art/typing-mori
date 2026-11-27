import { useSyncExternalStore } from "react";
import { DEFAULT_CHARACTER } from "./characters";
import type { Course } from "./courses";
import { dayKey } from "./days";
import type { Mode } from "./modes";
import { earnedStickers } from "./stickers";
import type { StageId } from "./words";

/* ---------- /play → /result の受け渡し（sessionStorage） ---------- */

/** 1かいぶんの結果 */
export type LastResult = {
  stage: StageId;
  correct: number;                   // 正しく打った文字数
  miss: number;                      // まちがえた回数
  seconds: number;                   // かかった時間（秒）
  missChars: Record<string, number>; // まちがえた文字と回数
  newRecord: boolean;                // さいこうきろくを こえたか
  prevBest: number | null;           // この回の前の さいこうきろく
  unlocked: StageId | null;          // この回で ひらいたステージ
  newStickers: string[];             // この回で もらった シール
  mode: Mode;                        // あそんだ ときの モード
  course?: Course;                   // あそんだ ときの コース
  stars: 1 | 2 | 3;                  // その モードの 基準で ついた ★
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

/* ---------- ずっと残すデータ（localStorage のキー：typing-mori） ---------- */

export type HistoryItem = {
  at: string;   // 遊んだ日時（ISO 形式）
  stage: StageId;
  speed: number;
  acc: number;
  stars: 1 | 2 | 3;
  mode?: Mode;  // あそんだ ときの モード（モードを入れる前の記録には ない）
  course?: Course; // あそんだ ときの コース（コースを入れる前の記録は 子ども）
};

/** コースごとに 分けて残す 記録（難しさが違うので コース間では 比べない） */
export type Progress = {
  best: Partial<Record<StageId, number>>;
  stars: Partial<Record<StageId, 1 | 2 | 3>>;
  missStats: Record<string, number>;
};

const EMPTY_PROGRESS: Progress = { best: {}, stars: {}, missStats: {} };

/**
 * 画面で使う データ。best・stars・missStats は「いまの コース」の ぶん（progress から とりだしたもの）
 * 保存するときは progress[viewCourse] に もどす（saveData）
 */
export type Data = {
  best: Partial<Record<StageId, number>>;      // ステージごとの さいこうきろく（もじ/分）
  stars: Partial<Record<StageId, 1 | 2 | 3>>;  // ステージごとの いちばん多い ★
  stickers: string[];                          // もらったシールの id
  sound: boolean;                              // 効果音
  history: HistoryItem[];                      // 練習の記録（新しい順、最大 100 件）
  character: string;                           // えらんだ なかま（子どもコース。コースを入れる前からの値）
  characterByCourse: Partial<Record<Course, string>>; // コースごとに えらんだ キャラクター
  playDays: string[];                          // 遊んだ日（"2026-11-27"、古い順、最大 60 日）
  fingerGuide: boolean;                        // ゆびガイド（キーの色分けと 指の名前）
  missStats: Record<string, number>;           // これまでに まちがえた文字と回数（とっくん用）
  mode: Mode | null;                           // あそびかたの モード（null は まだ えらんでいない）
  showKeyboardB: boolean;                      // チャレンジ モードで 画面キーボードを出すか
  course: Course | null;                       // コース（null は まだ えらんでいない）
  progress: Partial<Record<Course, Progress>>; // コースごとの 記録
  viewCourse: Course;                          // best・stars・missStats が どの コースの ものか（保存しない）
};

/** localStorage に 入れる形（best・stars・missStats は progress の中だけ） */
type Stored = Omit<Data, "best" | "stars" | "missStats" | "viewCourse">;

const DATA_KEY = "typing-mori";
const CHANGE_EVENT = "typing-mori-change";
const HISTORY_MAX = 100;
const PLAY_DAYS_MAX = 60;

export const EMPTY_DATA: Data = {
  best: {},
  stars: {},
  stickers: [],
  sound: true,
  history: [],
  character: DEFAULT_CHARACTER,
  characterByCourse: {},
  playDays: [],
  fingerGuide: true,
  missStats: {},
  mode: null,
  showKeyboardB: false,
  course: null,
  progress: {},
  viewCourse: "kids",
};

let cache: { raw: string | null; data: Data } | null = null;

/** 保存データを読む（同じ中身なら同じオブジェクトを返す） */
export function loadData(): Data {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(DATA_KEY);
  } catch {
    return EMPTY_DATA;
  }
  if (cache && cache.raw === raw) return cache.data;
  let data = EMPTY_DATA;
  try {
    const d = raw ? (JSON.parse(raw) as Partial<Data> & { bestSpeed?: number }) : {};
    const progress: Partial<Record<Course, Progress>> = { ...(d.progress ?? {}) };
    // コースを入れる前の 記録（best・stars・missStats が 上の階層に ある）は 子どもコースに 引き継ぐ
    if (!d.progress && (d.best || d.stars || d.missStats || typeof d.bestSpeed === "number")) {
      const best = { ...(d.best ?? {}) };
      // MVP のデータ（bestSpeed）は Lv2 の記録として引き継ぐ
      if (typeof d.bestSpeed === "number" && best.lv2 === undefined) best.lv2 = d.bestSpeed;
      progress.kids = { best, stars: d.stars ?? {}, missStats: d.missStats ?? {} };
    }
    const viewCourse: Course = d.course ?? "kids";
    const p = { ...EMPTY_PROGRESS, ...(progress[viewCourse] ?? {}) };
    data = { ...EMPTY_DATA, ...d, progress, viewCourse, best: p.best, stars: p.stars, missStats: p.missStats };
    delete (data as { bestSpeed?: number }).bestSpeed;
  } catch {
    data = EMPTY_DATA;
  }
  cache = { raw, data };
  return data;
}

export function saveData(data: Data) {
  // best・stars・missStats は、それを 読んだ コース（viewCourse）の ぶんとして progress に もどす
  const { best, stars, missStats, viewCourse, ...rest } = data;
  const stored: Stored = {
    ...rest,
    progress: { ...data.progress, [viewCourse]: { best, stars, missStats } },
  };
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(stored));
  } catch {
    // 保存できなくても遊びは続けられる
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function clearData() {
  try {
    localStorage.removeItem(DATA_KEY);
  } catch {
    // 何もしない
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange); // ほかのタブで変わったとき
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** 画面で保存データを使う（サーバーでの描画時は空のデータ） */
export function useData(): Data {
  return useSyncExternalStore(subscribe, loadData, () => EMPTY_DATA);
}

function addCounts(a: Record<string, number>, b: Record<string, number>): Record<string, number> {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = (out[k] ?? 0) + v;
  return out;
}

/** 1かい遊び終えたときに、記録・★・履歴・まちがえた文字を保存する */
export function recordResult(
  item: Omit<HistoryItem, "at">,
  missChars: Record<string, number> = {},
): {
  newRecord: boolean;
  prevBest: number | null;
  newStickers: string[];
  data: Data;
} {
  const before = loadData();
  const prevBest = before.best[item.stage] ?? null;
  const newRecord = prevBest === null || item.speed > prevBest;
  const newStickers = earnedStickers(item.stage, item.stars, before.stickers);
  const data: Data = {
    ...before,
    stickers: [...before.stickers, ...newStickers],
    best: newRecord ? { ...before.best, [item.stage]: item.speed } : before.best,
    stars: { ...before.stars, [item.stage]: Math.max(before.stars[item.stage] ?? 0, item.stars) as 1 | 2 | 3 },
    history: [{ ...item, course: before.viewCourse, at: new Date().toISOString() }, ...before.history].slice(
      0,
      HISTORY_MAX,
    ),
    missStats: addCounts(before.missStats, missChars),
    playDays: before.playDays.includes(dayKey())
      ? before.playDays
      : [...before.playDays, dayKey()].slice(-PLAY_DAYS_MAX),
  };
  saveData(data);
  return { newRecord, prevBest, newStickers, data };
}

/** いまの コースの 練習の記録だけ（コースを入れる前の 記録は 子ども） */
export function historyOf(data: Data): HistoryItem[] {
  return data.history.filter((h) => (h.course ?? "kids") === data.viewCourse);
}
