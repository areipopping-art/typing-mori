/**
 * keydown イベントから「打った1文字」を取り出す。文字でないキーは null。
 * - 押しっぱなし（repeat）、Ctrl / Cmd / Alt つきは無視する
 * - 日本語入力がオンだと e.key が "Process" になるので、e.code（KeyA など）から文字を取る
 */
export function keyToChar(e: KeyboardEvent): string | null {
  if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return null;
  if (e.key.length === 1) {
    return e.key === " " ? null : e.key.toLowerCase();
  }
  if (e.key === "Process" || e.isComposing) {
    const m = /^Key([A-Z])$/.exec(e.code);
    if (m) return m[1].toLowerCase();
    if (e.code === "Minus") return "-";
  }
  return null;
}
