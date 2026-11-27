import { useData } from "./storage";
import type { Course } from "./courses";
import type { Mode } from "./modes";

/**
 * 画面の言葉（F-36）
 * - kids：子どもコース（ひらがな中心・やさしい言葉）
 * - grown：学生・社会人コース（漢字かな混じり）
 */
const kids = {
  // ホーム
  greet: (name: string) => `${name}と いっしょに れんしゅう しよう！`,
  homeLead: "ひらがなの ことばを ローマじで うってみよう。1かい 10こ だよ。",
  bestTitle: "🏆 さいこうきろく（1ぷんで なんもじ）",
  bestNone: "まだ ないよ。あそんで きろくを つくろう！",
  chooseCharacter: "いっしょに あそぶ なかまを えらんでね",
  nowMode: (emoji: string, name: string) => `いまは ${emoji} ${name}（モードを かえる）`,
  nowCourse: (emoji: string, name: string) => `${emoji} ${name}コース（コースを かえる）`,
  play: "▶ あそぶ",
  spaceKey: "スペース",
  spaceHint: "キーでも はじめられるよ",
  welcome: "タイピングのもりへ ようこそ！",
  // スタンプ
  stamp: "📅 まいにち スタンプ",
  streak: (n: number) => `れんぞく ${n} にち！`,
  today: "きょう",
  week: ["にち", "げつ", "か", "すい", "もく", "きん", "ど"],
  // モード
  chooseMode: "どっちで あそぶ？",
  modeNote: "あとから いつでも かえられるよ。きろくや シールは そのまま だよ。",
  modes: {
    a: { name: "はじめて モード", short: "はじめて", desc: ["キーボードと ゆびの ガイドが でるよ", "じかんは きにしないで ゆっくり", "★が もらいやすいよ"] },
    b: { name: "チャレンジ モード", short: "チャレンジ", desc: ["うちながら はやさが わかるよ", "タイムアタックで きろくに ちょうせん", "きろくの グラフが みられるよ"] },
  } as Record<Mode, { name: string; short: string; desc: string[] }>,
  // ステージ
  chooseStage: "どの ステージで あそぶ？",
  noRecord: "きろく なし",
  perMinute: (n: number) => `1ぷんで ${n} もじ`,
  // あそぶ
  cheer: "がんばって！",
  praise: ["いいね！", "すごい！", "じょうず！", "その ちょうし！"],
  miss: (ch: string) => `おしい！「${ch}」だよ`,
  recover: "そう そう！",
  finish: "やったね！",
  timeUp: "タイムアップ！",
  left: (n: number) => `のこり ${n} こ`,
  seconds: (s: string) => `⏱ ${s} びょう`,
  timeLeft: (n: number) => `⏱ のこり ${n} びょう`,
  typedWords: (n: number) => `うった ことば ${n} こ`,
  liveSpeed: "🚀 いまの はやさ",
  liveSpeedUnit: "もじ/ぷん",
  liveAcc: "🎯 せいかくさ",
  showKeyboard: (shown: boolean) => `⌨ キーボードを ${shown ? "かくす" : "みせる"}`,
  startHint: "さいしょの もじを うつと スタート！ ／ ",
  escHint: "で やめる",
  allDone: "ぜんぶ うてたね！",
  fingerWith: (ch: string) => `で「${ch}」`,
  // けっか
  newRecord: "🎉 しんきろく！ 🎉",
  starMessage: {
    1: "さいごまで うてたね！ つぎは ゆっくり ていねいに うってみよう",
    2: "じょうず！ もうすこしで ★3つ だよ",
    3: "すごい！ タイピング めいじん だ！",
  } as Record<1 | 2 | 3, string>,
  unlocked: (name: string) => `🔓 ${name} が ひらいたよ！`,
  rule: (mode: string, acc: number, speed: number) =>
    `${mode}モードの ★3 は せいかくさ ${acc}% いじょう で 1ぷんに ${speed}もじ いじょう`,
  speed: "はやさ",
  speedValue: ["1ぷんで", "もじ"] as [string, string],
  acc: "せいかくさ",
  gap: (best: number, n: number) => [`🏆 さいこうきろくは 1ぷんで ${best} もじ。あと `, `${n}`, " もじで しんきろく！"] as [string, string, string],
  summary: (sec: number, chars: number, miss: number) => `${sec} びょうで ${chars} もじ うったよ（まちがい ${miss} かい）`,
  missTitle: "まちがえやすかった もじ",
  perfect: "まちがい 0 かい！ パーフェクト！",
  times: (n: number) => `${n} かい`,
  toWeak: "💪 にがてを とっくん する",
  again: "🔁 もういっかい",
  toStages: "🗺 ステージえらび",
  enterKey: "エンター",
  enterHint: "キーでも もういっかい あそべるよ",
  // シール
  stickerGet: "🎁 シールゲット！",
  stickerAdded: "📖 ずかんに はったよ",
  stickerOk: "やったー！",
  collection: "📖 ずかん",
  collectionCount: (n: number, all: number) => `${n} / ${all} まい`,
  collectionAll: "ぜんぶ あつめたね！ すごい！",
  collectionLead: "がんばって シールを あつめよう！",
  unknown: "？？？",
  // ヘッダー
  navStages: "🗺 ステージ",
  navCollection: "📖 ずかん",
  navRecords: "📈 きろく",
  changeCourse: "コースを かえる",
  changeMode: "モードを かえる",
  // きろく
  recordsLead: "どれだけ はやく なったかな？",
  records: "📈 きろく",
  recordsBest: "🏆 ステージごとの さいこうきろく",
  recordsChart: "📈 はやさの グラフ",
  notYet: "まだ",
  speedUnit: "もじ/ぷん",
};

export type Texts = typeof kids;

const grown: Texts = {
  greet: (name: string) => `${name}と一緒に練習しましょう`,
  homeLead: "表示された言葉をローマ字で入力しましょう。1回10問です。",
  bestTitle: "🏆 最高記録（1分あたりの文字数）",
  bestNone: "まだ記録がありません。まずは1回挑戦してみましょう。",
  chooseCharacter: "一緒に練習するキャラクター",
  nowMode: (emoji: string, name: string) => `現在：${emoji} ${name}（モードを変更）`,
  nowCourse: (emoji: string, name: string) => `${emoji} ${name}コース（コースを変更）`,
  play: "▶ スタート",
  spaceKey: "Space",
  spaceHint: "キーでも開始できます",
  welcome: "ようこそ！",
  stamp: "📅 毎日スタンプ",
  streak: (n: number) => `${n}日連続！`,
  today: "今日",
  week: ["日", "月", "火", "水", "木", "金", "土"],
  chooseMode: "モードを選んでください",
  modeNote: "あとからいつでも変更できます。記録やシールはそのまま残ります。",
  modes: {
    a: { name: "初心者モード", short: "初心者", desc: ["キーボードと指のガイドを表示", "時間を気にせずじっくり練習", "★が取りやすい基準"] },
    b: { name: "チャレンジモード", short: "チャレンジ", desc: ["入力中の速さと正確さを表示", "タイムアタックで記録に挑戦", "記録のグラフを確認できる"] },
  },
  chooseStage: "ステージを選んでください",
  noRecord: "記録なし",
  perMinute: (n: number) => `${n} 文字/分`,
  cheer: "がんばりましょう",
  praise: ["いいですね！", "その調子！", "順調です！", "ナイス！"],
  miss: (ch: string) => `惜しい！「${ch}」です`,
  recover: "その調子です",
  finish: "完了です！",
  timeUp: "タイムアップ！",
  left: (n: number) => `残り ${n} 問`,
  seconds: (s: string) => `⏱ ${s} 秒`,
  timeLeft: (n: number) => `⏱ 残り ${n} 秒`,
  typedWords: (n: number) => `入力した言葉 ${n} 問`,
  liveSpeed: "🚀 現在の速さ",
  liveSpeedUnit: "文字/分",
  liveAcc: "🎯 正確さ",
  showKeyboard: (shown: boolean) => `⌨ キーボードを${shown ? "隠す" : "表示"}`,
  startHint: "最初の文字を入力するとスタート ／ ",
  escHint: "で中断",
  allDone: "すべて入力できました！",
  fingerWith: (ch: string) => `で「${ch}」`,
  newRecord: "🎉 新記録！ 🎉",
  starMessage: {
    1: "完走しました！ 次は正確さを意識してみましょう",
    2: "いい調子です！ あと少しで ★3 です",
    3: "素晴らしい！ タイピングの達人です",
  },
  unlocked: (name: string) => `🔓 ${name} が解放されました！`,
  rule: (mode: string, acc: number, speed: number) => `${mode}モードの ★3 の目安：正確さ ${acc}% 以上・1分あたり ${speed} 文字以上`,
  speed: "速さ",
  speedValue: ["1分あたり", "文字"],
  acc: "正確さ",
  gap: (best: number, n: number) => [`🏆 最高記録は 1分あたり ${best} 文字。あと `, `${n}`, " 文字で新記録！"] as [string, string, string],
  summary: (sec: number, chars: number, miss: number) => `${sec} 秒で ${chars} 文字入力（ミス ${miss} 回）`,
  missTitle: "ミスが多かった文字",
  perfect: "ミス 0 回！ パーフェクト！",
  times: (n: number) => `${n} 回`,
  toWeak: "💪 苦手を克服する",
  again: "🔁 もう一度",
  toStages: "🗺 ステージ選択",
  enterKey: "Enter",
  enterHint: "キーでもう一度挑戦できます",
  stickerGet: "🎁 シール獲得！",
  stickerAdded: "📖 コレクションに追加しました",
  stickerOk: "OK",
  collection: "📖 コレクション",
  collectionCount: (n: number, all: number) => `${n} / ${all} 枚`,
  collectionAll: "すべて集めました！ おめでとうございます",
  collectionLead: "★を取ってシールを集めましょう",
  unknown: "？？？",
  navStages: "🗺 ステージ",
  navCollection: "📖 コレクション",
  navRecords: "📈 記録",
  changeCourse: "コースを変更",
  changeMode: "モードを変更",
  recordsLead: "どれだけ速くなったか確認しましょう",
  records: "📈 記録",
  recordsBest: "🏆 ステージごとの最高記録",
  recordsChart: "📈 速さのグラフ",
  notYet: "未挑戦",
  speedUnit: "文字/分",
};

export function textsFor(course: Course | null | undefined): Texts {
  return !course || course === "kids" ? kids : grown;
}

/** 画面で使う：いまの コースの 言葉 */
export function useTexts(): Texts {
  const { course } = useData();
  return textsFor(course);
}
