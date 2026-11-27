/** もりの なかま（キャラクター）。えらんだ なかまが どのページにも でてくる */
export type CharacterInfo = { id: string; emoji: string; name: string };

export const CHARACTERS: CharacterInfo[] = [
  { id: "risu", emoji: "🐿️", name: "りすくん" },
  { id: "usagi", emoji: "🐰", name: "うさぎさん" },
  { id: "kitsune", emoji: "🦊", name: "きつねくん" },
  { id: "kuma", emoji: "🐻", name: "くまさん" },
  { id: "panda", emoji: "🐼", name: "ぱんださん" },
];

export const DEFAULT_CHARACTER = "risu";

export function characterOf(id: string): CharacterInfo {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}
