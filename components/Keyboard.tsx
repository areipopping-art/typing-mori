const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
const INDENT = ["pl-0", "pl-4 sm:pl-6", "pl-8 sm:pl-12"];

/**
 * 画面のキーボード
 * - next：次に打つキー（光らせる）
 * - wrong：いま まちがえて押したキー（赤くする）
 */
export default function Keyboard({ next, wrong }: { next?: string; wrong?: string | null }) {
  return (
    <div className="w-full max-w-2xl select-none space-y-1.5" aria-hidden>
      {ROWS.map((row, r) => (
        <div key={row} className={`flex gap-1.5 ${INDENT[r]}`}>
          {[...row].map((k) => {
            const isNext = k === next;
            const isWrong = k === wrong && !isNext;
            const style = isNext
              ? "bg-[var(--accent)] text-[var(--accent-text)] border-[var(--accent)] scale-110 shadow-[0_0_0_4px_var(--card-border)]"
              : isWrong
                ? "bg-[var(--ng-bg)] text-[var(--ng)] border-[var(--ng)]"
                : "bg-[var(--card)] text-[var(--muted)] border-[var(--card-border)]";
            return (
              <div
                key={k}
                className={`relative flex aspect-square flex-1 items-center justify-center rounded-lg border-2 font-mono text-lg font-bold uppercase transition ${style}`}
              >
                {k}
                {/* ホームポジション（F と J）の目印 */}
                {(k === "f" || k === "j") && (
                  <span className="absolute bottom-1 h-0.5 w-3 rounded bg-current opacity-60" />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
