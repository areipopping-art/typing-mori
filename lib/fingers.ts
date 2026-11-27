/** キーを打つ指（タッチタイピングの ふつうの割り当て） */
export type Finger = { id: number; name: string; keys: string };

export const FINGERS: Finger[] = [
  { id: 1, name: "ひだりの こゆび", keys: "qaz" },
  { id: 2, name: "ひだりの くすりゆび", keys: "wsx" },
  { id: 3, name: "ひだりの なかゆび", keys: "edc" },
  { id: 4, name: "ひだりの ひとさしゆび", keys: "rfvtgb" },
  { id: 5, name: "みぎの ひとさしゆび", keys: "yhnujm" },
  { id: 6, name: "みぎの なかゆび", keys: "ik" },
  { id: 7, name: "みぎの くすりゆび", keys: "ol" },
  { id: 8, name: "みぎの こゆび", keys: "p-" },
];

export function fingerOf(key: string | undefined): Finger | undefined {
  if (!key) return undefined;
  return FINGERS.find((f) => f.keys.includes(key));
}
