/** キーを打つ指（タッチタイピングの ふつうの割り当て） */
/** name は子ども向け、nameGrown は 学生・社会人向け */
export type Finger = { id: number; name: string; nameGrown: string; keys: string };

export const FINGERS: Finger[] = [
  { id: 1, name: "ひだりの こゆび", nameGrown: "左手の小指", keys: "qaz" },
  { id: 2, name: "ひだりの くすりゆび", nameGrown: "左手の薬指", keys: "wsx" },
  { id: 3, name: "ひだりの なかゆび", nameGrown: "左手の中指", keys: "edc" },
  { id: 4, name: "ひだりの ひとさしゆび", nameGrown: "左手の人差し指", keys: "rfvtgb" },
  { id: 5, name: "みぎの ひとさしゆび", nameGrown: "右手の人差し指", keys: "yhnujm" },
  { id: 6, name: "みぎの なかゆび", nameGrown: "右手の中指", keys: "ik" },
  { id: 7, name: "みぎの くすりゆび", nameGrown: "右手の薬指", keys: "ol" },
  { id: 8, name: "みぎの こゆび", nameGrown: "右手の小指", keys: "p-" },
];

export function fingerOf(key: string | undefined): Finger | undefined {
  if (!key) return undefined;
  return FINGERS.find((f) => f.keys.includes(key));
}
