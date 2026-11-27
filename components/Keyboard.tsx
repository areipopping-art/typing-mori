"use client";

import { fingerOf } from "@/lib/fingers";
import { useData } from "@/lib/storage";

const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
const INDENT = ["pl-0", "pl-4 sm:pl-6", "pl-8 sm:pl-12"];

/**
 * 画面のキーボード
 * - next：次に打つキー（光らせる）
 * - wrong：いま まちがえて押したキー（赤くする）
 * - ゆびガイドがオンなら、キーを 打つ指ごとに色分けし、次のキーを打つ指の名前を出す
 */
export default function Keyboard({ next, wrong }: { next?: string; wrong?: string | null }) {
  const { fingerGuide } = useData();
  const nextFinger = fingerOf(next);

  return (
    <div className="w-full max-w-2xl select-none space-y-1.5">
      <div className="space-y-1.5" aria-hidden>
        {ROWS.map((row, r) => (
          <div key={row} className={`flex gap-1.5 ${INDENT[r]}`}>
            {[...row].map((k) => {
              const isNext = k === next;
              const isWrong = k === wrong && !isNext;
              const finger = fingerOf(k);
              const style = isNext
                ? "bg-[var(--accent)] text-[var(--accent-text)] border-[var(--accent)] scale-110 shadow-[0_0_0_4px_var(--card-border)]"
                : isWrong
                  ? "bg-[var(--ng-bg)] text-[var(--ng)] border-[var(--ng)]"
                  : "text-[var(--muted)] border-[var(--card-border)]";
              const bg =
                !isNext && !isWrong ? (fingerGuide && finger ? `var(--f${finger.id})` : "var(--card)") : undefined;
              return (
                <div
                  key={k}
                  style={bg ? { background: bg } : undefined}
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
      {fingerGuide && nextFinger && (
        <p className="pt-2 text-center text-lg font-bold">
          <span
            className="rounded-full px-3 py-1"
            style={{ background: `var(--f${nextFinger.id})` }}
          >
            ☝️ {nextFinger.name}
          </span>{" "}
          で「{next}」
        </p>
      )}
    </div>
  );
}
