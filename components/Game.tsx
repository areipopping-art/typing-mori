"use client";

import { useEffect, useState } from "react";
import { initGame, typeChar } from "@/lib/game";
import { keyToChar } from "@/lib/keys";
import { pickWords } from "@/lib/words";

export default function Game() {
  const [game, setGame] = useState(() => initGame(pickWords()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") e.preventDefault(); // 画面がスクロールしないように
      const ch = keyToChar(e);
      if (!ch) return;
      const now = performance.now();
      setGame((g) => typeChar(g, ch, now)[0]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const word = game.words[game.index];
  const done = game.finishedAt !== null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8">
      <div className="w-full max-w-2xl rounded-3xl border-2 border-[var(--card-border)] bg-[var(--card)] px-6 py-10 text-center">
        <p className="text-[56px] font-extrabold leading-tight">{word.kana}</p>
        <p className="mt-4 font-mono text-[48px] font-bold tracking-wider" aria-label={`お手本 ${word.romaji}`}>
          {[...word.romaji].map((c, i) => {
            const typed = i < game.pos;
            const current = i === game.pos && !done;
            const color = typed
              ? "text-[var(--ok)]"
              : current && game.wrong
                ? "text-[var(--ng)] bg-[var(--ng-bg)] rounded-lg"
                : current
                  ? "text-[var(--foreground)]"
                  : "text-[var(--todo)]";
            return (
              <span
                key={i}
                className={`inline-block px-0.5 ${color} ${current ? "border-b-4 border-current" : "border-b-4 border-transparent"}`}
              >
                {c}
              </span>
            );
          })}
        </p>
      </div>
      {done && <p className="text-2xl font-bold text-[var(--accent)]">ぜんぶ うてたね！</p>}
    </div>
  );
}
