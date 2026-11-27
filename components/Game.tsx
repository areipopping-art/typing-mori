"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Character, { type Mood } from "@/components/Character";
import Keyboard from "@/components/Keyboard";
import { currentGuide, expectedChar, initGame, timeUp, typeChar, type GameState } from "@/lib/game";
import { keyToChar } from "@/lib/keys";
import { accuracy, speedPerMinute, stars } from "@/lib/score";
import { isUnlocked, nextStage } from "@/lib/stages";
import { loadData, recordResult, saveLast } from "@/lib/storage";
import { pickWords, TIME_LIMIT, type StageId } from "@/lib/words";

const PRAISE = ["いいね！", "すごい！", "じょうず！", "その ちょうし！"];

/** 1かい おわったときに、記録を保存して けっかページへ わたす */
function finishRound(stage: StageId, game: GameState) {
  if (game.finishedAt === null || game.startedAt === null) return;
  const seconds = (game.finishedAt - game.startedAt) / 1000;
  const speed = speedPerMinute({ correct: game.correct, seconds });
  const acc = accuracy(game);
  const next = nextStage(stage);
  const nextWasOpen = next !== null && isUnlocked(next, loadData());
  const { newRecord, prevBest, data } = recordResult({ stage, speed, acc, stars: stars(speed, acc) });
  saveLast({
    stage,
    correct: game.correct,
    miss: game.miss,
    seconds,
    missChars: game.missChars,
    newRecord,
    prevBest,
    unlocked: next !== null && !nextWasOpen && isUnlocked(next, data) ? next : null,
  });
}

export default function Game({ stage }: { stage: StageId }) {
  const router = useRouter();

  // まだ ひらいていない ステージを URL で開いたときは ステージえらびへ
  useEffect(() => {
    if (!isUnlocked(stage, loadData())) router.replace("/stages");
  }, [stage, router]);

  const [game, setGame] = useState(() => initGame(pickWords(stage), stage === "time" ? TIME_LIMIT : null));
  const gameRef = useRef(game);
  const [reaction, setReaction] = useState<{ mood: Mood; message: string }>({
    mood: "normal",
    message: "がんばって！",
  });
  const [now, setNow] = useState(0);
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const wrongTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // タイマー：はじまってから終わるまで 0.1 秒ごとに表示を更新
  const running = game.startedAt !== null && game.finishedAt === null;
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const t = performance.now();
      setNow(t);
      // タイムアタックの時間切れ
      const g = gameRef.current;
      if (g.timeLimit !== null && g.startedAt !== null && t - g.startedAt >= g.timeLimit * 1000) {
        const ended = timeUp(g);
        gameRef.current = ended;
        setGame(ended);
        setReaction({ mood: "happy", message: "タイムアップ！" });
        finishRound(stage, ended);
      }
    }, 100);
    return () => clearInterval(id);
  }, [running, stage]);

  // ぜんぶ打ち終えたら、けっかページへ（「ぜんぶ うてたね！」を少し見せる）
  const finished = game.finishedAt !== null;
  useEffect(() => {
    if (!finished) return;
    const id = setTimeout(() => router.push("/result"), 600);
    return () => clearTimeout(id);
  }, [finished, router]);

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
        // 押したキーを 画面キーボードで 一瞬 赤くする
        setWrongKey(ch);
        clearTimeout(wrongTimer.current);
        wrongTimer.current = setTimeout(() => setWrongKey(null), 350);
        const expected = expectedChar(before);
        setReaction({ mood: "surprised", message: `おしい！「${expected}」だよ` });
      } else if (result === "word-done") {
        setReaction({ mood: "happy", message: PRAISE[Math.floor(Math.random() * PRAISE.length)] });
      } else if (result === "finished") {
        setReaction({ mood: "happy", message: "やったね！" });
        finishRound(stage, next);
      } else if (result === "correct") {
        setReaction((r) => (r.mood === "surprised" ? { mood: "normal", message: "そう そう！" } : r));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage]);

  const word = game.words[game.index];
  const g = currentGuide(game);
  const done = game.finishedAt !== null;
  const elapsed =
    game.startedAt === null ? 0 : ((game.finishedAt ?? Math.max(now, game.startedAt)) - game.startedAt) / 1000;
  const left = game.words.length - game.index - (done ? 1 : 0);
  const timeLeft = game.timeLimit === null ? 0 : Math.max(0, Math.ceil(game.timeLimit - elapsed));

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8">
      <div className="flex w-full max-w-2xl justify-between text-xl font-bold">
        {game.timeLimit === null ? (
          <>
            <span>⏱ {elapsed.toFixed(1)} びょう</span>
            <span>のこり {left} こ</span>
          </>
        ) : (
          <>
            <span className={timeLeft <= 10 ? "text-[var(--ng)]" : ""}>⏱ のこり {timeLeft} びょう</span>
            <span>うった ことば {game.done} こ</span>
          </>
        )}
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
      {!done && <Keyboard next={g.rest[0]} wrong={wrongKey} />}
      {done ? (
        <p className="text-2xl font-bold text-[var(--accent)]">
          {game.timeLimit === null ? "ぜんぶ うてたね！" : "タイムアップ！"}
        </p>
      ) : (
        game.startedAt === null && <p className="text-[var(--muted)]">さいしょの もじを うつと スタート！</p>
      )}
    </div>
  );
}
