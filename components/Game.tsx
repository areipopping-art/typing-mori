"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Character, { type Mood } from "@/components/Character";
import Keyboard from "@/components/Keyboard";
import { currentGuide, expectedChar, initGame, timeUp, typeChar, type GameState } from "@/lib/game";
import { keyToChar } from "@/lib/keys";
import { accuracy, speedPerMinute, stars } from "@/lib/score";
import { playSound } from "@/lib/sound";
import { isUnlocked, nextStage } from "@/lib/stages";
import { loadData, recordResult, saveData, saveLast, useData } from "@/lib/storage";
import { pickLine, selectedCharacter } from "@/lib/characters";
import { textsFor } from "@/lib/texts";
import { pickWords, TIME_LIMIT, type StageId } from "@/lib/words";


/** 1かい おわったときに、記録を保存して けっかページへ わたす */
function finishRound(stage: StageId, game: GameState) {
  if (game.finishedAt === null || game.startedAt === null) return;
  const seconds = (game.finishedAt - game.startedAt) / 1000;
  const speed = speedPerMinute({ correct: game.correct, seconds });
  const acc = accuracy(game);
  const next = nextStage(stage);
  const before = loadData();
  const mode = before.mode ?? "a";
  const course = before.viewCourse;
  const star = stars(speed, acc, mode, course);
  const nextWasOpen = next !== null && isUnlocked(next, before);
  const { newRecord, prevBest, newStickers, data } = recordResult(
    { stage, speed, acc, stars: star, mode },
    game.missChars,
  );
  saveLast({
    stage,
    correct: game.correct,
    miss: game.miss,
    seconds,
    missChars: game.missChars,
    newRecord,
    prevBest,
    unlocked: next !== null && !nextWasOpen && isUnlocked(next, data) ? next : null,
    newStickers,
    mode,
    course,
    stars: star,
  });
}

export default function Game({ stage }: { stage: StageId }) {
  const router = useRouter();

  // まだ ひらいていない ステージを URL で開いたときは ステージえらびへ
  useEffect(() => {
    if (!isUnlocked(stage, loadData())) router.replace("/stages");
  }, [stage, router]);

  const [game, setGame] = useState(() => initGame(pickWords(stage, loadData().missStats, loadData().viewCourse), stage === "time" ? TIME_LIMIT : null));
  const gameRef = useRef(game);
  const [reaction, setReaction] = useState<{ mood: Mood; message: string }>({
    mood: "normal",
    message: textsFor(loadData().course).cheer,
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
        setReaction({ mood: "happy", message: textsFor(loadData().course).timeUp });
        playSound("clear");
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
      if (e.key === "Escape") {
        router.push("/"); // とちゅうで やめる（記録は のこさない）
        return;
      }
      const ch = keyToChar(e);
      if (!ch) return;
      const before = gameRef.current;
      const [next, result] = typeChar(before, ch, performance.now());
      gameRef.current = next;
      setGame(next);
      if (result === "ignored") return;
      const tt = textsFor(loadData().course);
      const me = selectedCharacter(loadData());
      playSound(result === "wrong" ? "ng" : result === "word-done" ? "word" : result === "finished" ? "clear" : "ok");
      if (result === "wrong") {
        // 押したキーを 画面キーボードで 一瞬 赤くする
        setWrongKey(ch);
        clearTimeout(wrongTimer.current);
        wrongTimer.current = setTimeout(() => setWrongKey(null), 350);
        const expected = expectedChar(before);
        setReaction({ mood: "surprised", message: pickLine(me.miss, tt.miss)(expected ?? "?") });
      } else if (result === "word-done") {
        const praise = pickLine(me.praise, tt.praise);
        setReaction({ mood: "happy", message: praise[Math.floor(Math.random() * praise.length)] });
      } else if (result === "finished") {
        setReaction({ mood: "happy", message: tt.finish });
        finishRound(stage, next);
      } else if (result === "correct") {
        setReaction((r) => (r.mood === "surprised" ? { mood: "normal", message: tt.recover } : r));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, router]);

  const data = useData();
  const mode = data.mode ?? "a";
  const t = textsFor(data.course);
  // はじめて モードは キーボードを いつも出す。チャレンジ モードは ボタンで 出し入れ
  const showKeyboard = mode === "a" || data.showKeyboardB;

  const word = game.words[game.index];
  const g = currentGuide(game);
  const shown = word.display ?? word.kana;
  const romajiLength = g.typed.length + g.rest.length;
  const done = game.finishedAt !== null;
  const elapsed =
    game.startedAt === null ? 0 : ((game.finishedAt ?? Math.max(now, game.startedAt)) - game.startedAt) / 1000;
  const left = game.words.length - game.index - (done ? 1 : 0);
  const timeLeft = game.timeLimit === null ? 0 : Math.max(0, Math.ceil(game.timeLimit - elapsed));
  // チャレンジ モード：打ちながらの はやさ と せいかくさ（1びょう たってから 出す）
  const liveSpeed = elapsed >= 1 ? speedPerMinute({ correct: game.correct, seconds: elapsed }) : null;
  const liveAcc = game.correct + game.miss > 0 ? accuracy(game) : null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8">
      <div className="flex w-full max-w-2xl flex-wrap justify-between gap-2 text-xl font-bold">
        {mode === "a" ? (
          // はじめて モード：じかんは 出さず、のこりの数だけ
          <span className="mx-auto">{t.left(left)}</span>
        ) : game.timeLimit === null ? (
          <>
            <span>{t.seconds(elapsed.toFixed(1))}</span>
            <span>{t.left(left)}</span>
          </>
        ) : (
          <>
            <span className={timeLeft <= 10 ? "text-[var(--ng)]" : ""}>{t.timeLeft(timeLeft)}</span>
            <span>{t.typedWords(game.done)}</span>
          </>
        )}
      </div>
      {mode === "b" && (
        <div className="flex w-full max-w-2xl justify-center gap-6 text-lg" aria-live="off">
          <span>
            {t.liveSpeed} <b className="text-2xl text-[var(--accent)]">{liveSpeed ?? "—"}</b> {t.liveSpeedUnit}
          </span>
          <span>
            {t.liveAcc} <b className="text-2xl text-[var(--accent)]">{liveAcc ?? "—"}</b> %
          </span>
        </div>
      )}
      <Character mood={reaction.mood} message={reaction.message} />
      <div className="w-full max-w-2xl rounded-3xl border-2 border-[var(--card-border)] bg-[var(--card)] px-6 py-10 text-center">
        {/* 表示（漢字など）。長い文は 文字を小さくする */}
        <p
          className={`font-extrabold leading-tight ${
            shown.length > 10 ? "text-3xl sm:text-4xl" : shown.length > 6 ? "text-4xl sm:text-5xl" : "text-[56px]"
          }`}
        >
          {word.hint && (
            <span className="mr-3" aria-hidden>
              {word.hint}
            </span>
          )}
          {shown}
        </p>
        {/* 漢字のときは 読みを 小さく出す */}
        {word.display && <p className="mt-2 text-lg text-[var(--muted)]">{word.kana}</p>}
        <p
          className={`mt-4 break-all font-mono font-bold tracking-wider ${
            romajiLength > 22 ? "text-2xl sm:text-3xl" : romajiLength > 12 ? "text-3xl sm:text-4xl" : "text-[48px]"
          }`}
          aria-label={`お手本 ${g.typed}${g.rest}`}
        >
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
      {!done && showKeyboard && (
        <Keyboard next={g.rest[0]} wrong={wrongKey} guide={mode === "a" || data.fingerGuide} />
      )}
      {!done && mode === "b" && (
        <button
          type="button"
          onClick={(e) => {
            saveData({ ...data, showKeyboardB: !data.showKeyboardB });
            e.currentTarget.blur(); // Enter で また押されないように
          }}
          className="rounded-full border-2 border-[var(--card-border)] bg-[var(--card)] px-4 py-1 text-sm font-bold"
        >
          {t.showKeyboard(showKeyboard)}
        </button>
      )}
      {done ? (
        <p className="text-2xl font-bold text-[var(--accent)]">
          {game.timeLimit === null ? t.allDone : t.timeUp}
        </p>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          {game.startedAt === null && t.startHint}
          <kbd className="rounded border border-[var(--card-border)] bg-[var(--card)] px-2 py-0.5">Esc</kbd> {t.escHint}
        </p>
      )}
    </div>
  );
}
