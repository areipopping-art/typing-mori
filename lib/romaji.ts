/**
 * ひらがな → ローマ字の打ち方（ゆれ対応）
 *
 * ことばを「音のまとまり（Unit）」に分け、それぞれに打ち方の候補を持たせる。
 * 候補の先頭が「標準の打ち方」で、お手本の表示に使う（例：し → shi / si / ci）。
 */

export type Unit = { kana: string; options: string[] };

/** 1文字のかなの打ち方 */
const SINGLE: Record<string, string[]> = {
  あ: ["a"], い: ["i"], う: ["u", "wu"], え: ["e"], お: ["o"],
  か: ["ka", "ca"], き: ["ki"], く: ["ku", "cu", "qu"], け: ["ke"], こ: ["ko", "co"],
  さ: ["sa"], し: ["shi", "si", "ci"], す: ["su"], せ: ["se", "ce"], そ: ["so"],
  た: ["ta"], ち: ["chi", "ti"], つ: ["tsu", "tu"], て: ["te"], と: ["to"],
  な: ["na"], に: ["ni"], ぬ: ["nu"], ね: ["ne"], の: ["no"],
  は: ["ha"], ひ: ["hi"], ふ: ["fu", "hu"], へ: ["he"], ほ: ["ho"],
  ま: ["ma"], み: ["mi"], む: ["mu"], め: ["me"], も: ["mo"],
  や: ["ya"], ゆ: ["yu"], よ: ["yo"],
  ら: ["ra"], り: ["ri"], る: ["ru"], れ: ["re"], ろ: ["ro"],
  わ: ["wa"], を: ["wo"],
  が: ["ga"], ぎ: ["gi"], ぐ: ["gu"], げ: ["ge"], ご: ["go"],
  ざ: ["za"], じ: ["ji", "zi"], ず: ["zu"], ぜ: ["ze"], ぞ: ["zo"],
  だ: ["da"], ぢ: ["di"], づ: ["du"], で: ["de"], ど: ["do"],
  ば: ["ba"], び: ["bi"], ぶ: ["bu"], べ: ["be"], ぼ: ["bo"],
  ぱ: ["pa"], ぴ: ["pi"], ぷ: ["pu"], ぺ: ["pe"], ぽ: ["po"],
  ぁ: ["xa", "la"], ぃ: ["xi", "li"], ぅ: ["xu", "lu"], ぇ: ["xe", "le"], ぉ: ["xo", "lo"],
  ゃ: ["xya", "lya"], ゅ: ["xyu", "lyu"], ょ: ["xyo", "lyo"],
  っ: ["xtu", "ltu", "xtsu", "ltsu"],
  ー: ["-"],
};

/** 2文字のかな（きゃ・しゅ など）の打ち方 */
const DOUBLE: Record<string, string[]> = {
  きゃ: ["kya"], きゅ: ["kyu"], きょ: ["kyo"],
  しゃ: ["sha", "sya"], しゅ: ["shu", "syu"], しょ: ["sho", "syo"], しぇ: ["she", "sye"],
  ちゃ: ["cha", "tya", "cya"], ちゅ: ["chu", "tyu", "cyu"], ちょ: ["cho", "tyo", "cyo"], ちぇ: ["che", "tye"],
  にゃ: ["nya"], にゅ: ["nyu"], にょ: ["nyo"],
  ひゃ: ["hya"], ひゅ: ["hyu"], ひょ: ["hyo"],
  みゃ: ["mya"], みゅ: ["myu"], みょ: ["myo"],
  りゃ: ["rya"], りゅ: ["ryu"], りょ: ["ryo"],
  ぎゃ: ["gya"], ぎゅ: ["gyu"], ぎょ: ["gyo"],
  じゃ: ["ja", "zya", "jya"], じゅ: ["ju", "zyu", "jyu"], じょ: ["jo", "zyo", "jyo"], じぇ: ["je", "zye"],
  びゃ: ["bya"], びゅ: ["byu"], びょ: ["byo"],
  ぴゃ: ["pya"], ぴゅ: ["pyu"], ぴょ: ["pyo"],
  ふぁ: ["fa"], ふぃ: ["fi"], ふぇ: ["fe"], ふぉ: ["fo"],
};

const SMALL = "ゃゅょぁぃぅぇぉ";
const VOWELS = "aeiou";

function uniq(list: string[]): string[] {
  return [...new Set(list)];
}

/** ひらがなのことばを、音のまとまりに分ける */
export function toUnits(kana: string): Unit[] {
  // 1) っ・ん 以外をまとまりに分ける
  const raw: Unit[] = [];
  const chars = [...kana];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const next = chars[i + 1];
    if (next && SMALL.includes(next) && SINGLE[c]) {
      const pair = c + next;
      // 「き＋ぃ」のように1文字ずつ打つ方法も正解にする
      const split = SINGLE[c].flatMap((a) => (SINGLE[next] ?? []).map((b) => a + b));
      raw.push({ kana: pair, options: uniq([...(DOUBLE[pair] ?? []), ...split]) });
      i++;
      continue;
    }
    if (c === "ん" || c === "っ") {
      raw.push({ kana: c, options: [] }); // 次の音を見て決める
      continue;
    }
    const opts = SINGLE[c];
    if (!opts) throw new Error(`打ち方が分からない文字です：${c}`);
    raw.push({ kana: c, options: opts });
  }

  // 2) 後ろから、っ（次の音とくっつける）と ん（次の音で n 1回でよいか）を決める
  const units: Unit[] = [];
  for (let i = raw.length - 1; i >= 0; i--) {
    const u = raw[i];
    const next = units[0]; // すでに決まった、すぐ後ろのまとまり
    if (u.kana === "ん") {
      // 次が子音（な行・や行 以外）なら n 1回でよい。お手本もそのときは n にする
      const canSingle =
        next !== undefined && next.options.every((o) => !VOWELS.includes(o[0]) && o[0] !== "y" && o[0] !== "n");
      units.unshift({ kana: "ん", options: canSingle ? ["n", "nn", "xn"] : ["nn", "xn"] });
    } else if (u.kana === "っ") {
      if (!next) {
        units.unshift({ kana: "っ", options: SINGLE["っ"] });
        continue;
      }
      // 「っぱ」→ ppa（子音を重ねる）か、xtu + pa
      const doubled = next.options
        .filter((o) => !VOWELS.includes(o[0]) && o[0] !== "n")
        .map((o) => o[0] + o);
      const separate = SINGLE["っ"].flatMap((x) => next.options.map((o) => x + o));
      units[0] = { kana: "っ" + next.kana, options: uniq([...doubled, ...separate]) };
    } else {
      units.unshift(u);
    }
  }
  return units;
}

/** ことばを打っている途中の状態 */
export type MatchState = {
  unit: number;  // 何番目のまとまりを打っているか
  buf: string;   // そのまとまりで、いま打った文字
  typed: string; // ことば全体で、いままで打った文字
};

export const startMatch = (): MatchState => ({ unit: 0, buf: "", typed: "" });

export function isDone(units: Unit[], s: MatchState): boolean {
  return s.unit >= units.length;
}

/** 1文字打ったときの判定。正しければ新しい状態、まちがいなら null */
export function stepMatch(units: Unit[], s: MatchState, ch: string): MatchState | null {
  const u = units[s.unit];
  if (!u) return null;
  const nb = s.buf + ch;

  if (u.options.some((o) => o.startsWith(nb))) {
    const longer = u.options.some((o) => o.length > nb.length && o.startsWith(nb));
    if (u.options.includes(nb) && !longer) {
      return { unit: s.unit + 1, buf: "", typed: s.typed + ch }; // まとまりを打ち終えた
    }
    return { unit: s.unit, buf: nb, typed: s.typed + ch };
  }

  // 「ん」を n 1回で打ち終えていて、次のキーが次の音の始まりなら進める
  if (s.buf !== "" && u.options.includes(s.buf)) {
    return stepMatch(units, { unit: s.unit + 1, buf: "", typed: s.typed }, ch);
  }
  return null;
}

/** お手本の表示：打った文字と、これから打つ文字（いまの打ち方に合わせて変わる） */
export function guide(units: Unit[], s: MatchState): { typed: string; rest: string } {
  let rest = "";
  const u = units[s.unit];
  if (u) {
    const current = u.options.find((o) => o.startsWith(s.buf)) ?? u.options[0];
    rest += current.slice(s.buf.length);
  }
  for (const next of units.slice(s.unit + 1)) rest += next.options[0];
  return { typed: s.typed, rest };
}

/** 標準の打ち方（お手本の最初の表示） */
export function standardRomaji(kana: string): string {
  return toUnits(kana).map((u) => u.options[0]).join("");
}
