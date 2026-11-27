"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Character, { type Mood } from "@/components/Character";
import { currentGuide, expectedChar, initGame, typeChar } from "@/lib/game";
import { keyToChar } from "@/lib/keys";
import { speedPerMinute } from "@/lib/score";
import { saveLast, updateBest } from "@/lib/storage";
import { pickWords } from "@/lib/words";

const PRAISE = ["いいね！", "すごい！", "じょうず！", "その ちょうし！"];

export default function Game() {
  const router = useRouter();
  const [game, setGame] = useState(() => initGame(pickWords("lv2")));
  const gameRef = useRef(game);
  const [reaction, setReaction] = useState<{ mood: Mood; message: string }>({
    mood: "normal",
    message: "がんばって！",
  });
  const [now, setNow] = useState(0);

  // タイマー：はじまってから終わるまで 0.1 秒ごとに表示を更新
  const running = game.startedAt !== null && game.finishedAt === null;
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(performance.now()), 100);
    return () => clearInterval(id);
  }, [running]);

  // ぜんぶ打ち終えたら結果を保存して、けっかページへ
  useEffect(() => {
    if (game.finishedAt === null || game.startedAt === null) return;
    const seconds = (game.finishedAt - game.startedAt) / 1000;
    saveLast({
      correct: game.correct,
      miss: game.miss,
      seconds,
      missChars: game.missChars,
      newRecord: updateBest(speedPerMinute({ correct: game.correct, seconds })),
    });
    const id = setTimeout(() => router.push("/result"), 600); // 「ぜんぶ うてたね！」を少し見せる
    return () => clearTimeout(id);
  }, [game, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") e.preventDefault(); // 画面がスクロールしないように
      const ch = keyToChar(e);
      if (!ch) return;
      const before = gameRef.current;
      const [next, result] = typeChar(before, ch, performance.now());
      gameRef.current = next;
      setGame(next);
      if (result === "wrong") {
        const expected = expectedChar(before);
        setReaction({ mood: "surprised", message: `おしい！「${expected}」だよ` });
      } else if (result === "word-done") {
        setReaction({ mood: "happy", message: PRAISE[Math.floor(Math.random() * PRAISE.length)] });
      } else if (result === "finished") {
        setReaction({ mood: "happy", message: "やったね！" });
      } else if (result === "correct") {
        setReaction((r) => (r.mood === "surprised" ? { mood: "normal", message: "そう そう！" } : r));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const word = game.words[game.index];
  const g = currentGuide(game);
  const done = game.finishedAt !== null;
  const elapsed =
    game.startedAt === null ? 0 : ((game.finishedAt ?? Math.max(now, game.startedAt)) - game.startedAt) / 1000;
  const left = game.words.length - game.index - (done ? 1 : 0);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8">
      <div className="flex w-full max-w-2xl justify-between text-xl font-bold">
        <span>⏱ {elapsed.toFixed(1)} びょう</span>
        <span>のこり {left} こ</span>
      </div>
      <Character mood={reaction.mood} message={reaction.message} />
      <div className="w-full max-w-2xl rounded-3xl border-2 border-[var(--card-border)] bg-[var(--card)] px-6 py-10 text-center">
        <p className="text-[56px] font-extrabold leading-tight">{word.kana}</p>
        <p className="mt-4 font-mono text-[48px] font-bold tracking-wider" aria-label={`お手本 ${g.typed}${g.rest}`}>
          <span className="text-[var(--ok)]">{g.typed}</span>
          {g.rest !== "" && (
            <span
              className={`inline-block border-b-4 border-current px-0.5 ${
                game.wrong ? "rounded-lg bg-[var(--ng-bg)] text-[var(--ng)]" : "text-[var(--foreground)]"
              }`}
              data-current
            >
              {g.rest[0]}
            </span>
          )}
          <span className="text-[var(--todo)]">{g.rest.slice(1)}</span>
        </p>
      </div>
      {done ? (
        <p className="text-2xl font-bold text-[var(--accent)]">ぜんぶ うてたね！</p>
      ) : (
        game.startedAt === null && <p className="text-[var(--muted)]">さいしょの もじを うつと スタート！</p>
      )}
    </div>
  );
}
