"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Character from "@/components/Character";
import Confetti from "@/components/Confetti";
import StickerModal from "@/components/StickerModal";
import { modeOf } from "@/lib/modes";
import { accuracy, sortMissChars, speedPerMinute, STAR_RULES, stars } from "@/lib/score";
import { stageOf } from "@/lib/stages";
import { loadLast } from "@/lib/storage";

const STAR_MESSAGE = {
  1: "さいごまで うてたね！ つぎは ゆっくり ていねいに うってみよう",
  2: "じょうず！ もうすこしで ★3つ だよ",
  3: "すごい！ もりの タイピング めいじん だ！",
} as const;

export default function ResultView() {
  const router = useRouter();
  const [result] = useState(loadLast);
  const [stickerOpen, setStickerOpen] = useState(() => (result?.newStickers?.length ?? 0) > 0);

  // 結果がない（直接このページを開いた）ときはホームへ
  useEffect(() => {
    if (!result) router.replace("/");
  }, [result, router]);

  // Enter で もういっかい
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.repeat && result) router.push(`/play?stage=${result.stage}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, result]);

  if (!result) return null;

  const speed = speedPerMinute(result);
  const acc = accuracy(result);
  const mode = result.mode ?? "b";
  const star = result.stars ?? stars(speed, acc, mode);
  const rule = STAR_RULES[mode];
  const misses = sortMissChars(result.missChars);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      {stickerOpen && <StickerModal ids={result.newStickers} onClose={() => setStickerOpen(false)} />}
      {result.newRecord && <Confetti />}
      {result.newRecord && (
        <p className="animate-bounce text-5xl font-extrabold text-[var(--sun)] [text-shadow:0_3px_0_rgb(0_0_0/0.15)]">
          🎉 しんきろく！ 🎉
        </p>
      )}
      <Character mood="happy" message={STAR_MESSAGE[star]} />
      <p className="-mt-4 text-sm font-bold text-[var(--muted)]">
        {stageOf(result.stage).emoji} {stageOf(result.stage).name}
      </p>
      {result.unlocked && (
        <p className="rounded-full bg-[var(--sun)] px-6 py-2 text-xl font-extrabold text-[#3b2a00]">
          🔓 {stageOf(result.unlocked).name} が ひらいたよ！
        </p>
      )}

      <p className="text-6xl tracking-widest" aria-label={`ほし ${star} こ`}>
        {[1, 2, 3].map((n) => (
          <span key={n} className={n <= star ? "text-[var(--sun)]" : "text-[var(--card-border)]"}>
            ★
          </span>
        ))}
      </p>

      <p className="-mt-4 text-xs text-[var(--muted)]">
        {modeOf(mode).emoji} {modeOf(mode).short}モードの ★3 は せいかくさ {rule.acc3}% いじょう で 1ぷんに {rule.speed3}もじ
        いじょう
      </p>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border-2 border-[var(--card-border)] bg-[var(--card)] p-6">
          <p className="text-[var(--muted)]">はやさ</p>
          <p className="text-2xl font-bold">
            1ぷんで <span className="text-5xl font-extrabold text-[var(--accent)]">{speed}</span> もじ
          </p>
        </div>
        <div className="rounded-3xl border-2 border-[var(--card-border)] bg-[var(--card)] p-6">
          <p className="text-[var(--muted)]">せいかくさ</p>
          <p className="text-2xl font-bold">
            <span className="text-5xl font-extrabold text-[var(--accent)]">{acc}</span> %
          </p>
        </div>
      </div>
      {!result.newRecord && result.prevBest !== null && (
        <p className="rounded-2xl bg-[var(--card)] px-5 py-2 font-bold">
          🏆 さいこうきろくは 1ぷんで {result.prevBest} もじ。あと{" "}
          <span className="text-2xl text-[var(--accent)]">{result.prevBest - speed + 1}</span> もじで しんきろく！
        </p>
      )}
      <p className="text-sm text-[var(--muted)]">
        {Math.round(result.seconds)} びょうで {result.correct} もじ うったよ（まちがい {result.miss} かい）
      </p>

      <div className="w-full max-w-2xl rounded-3xl border-2 border-[var(--card-border)] bg-[var(--card)] p-6">
        <p className="mb-3 font-bold">まちがえやすかった もじ</p>
        {misses.length === 0 ? (
          <p className="text-[var(--accent)] font-bold">まちがい 0 かい！ パーフェクト！</p>
        ) : (
          <ul className="flex flex-wrap justify-center gap-3">
            {misses.map(([ch, n]) => (
              <li key={ch} className="rounded-2xl bg-[var(--ng-bg)] px-4 py-2">
                <span className="font-mono text-3xl font-bold text-[var(--ng)]">{ch}</span>
                <span className="ml-2 text-sm">{n} かい</span>
              </li>
            ))}
          </ul>
        )}
        {misses.length > 0 && (
          <Link
            href="/play?stage=weak"
            className="mt-4 inline-block rounded-full border-2 border-[var(--accent)] px-6 py-2 font-bold text-[var(--accent)]"
          >
            💪 にがてを とっくん する
          </Link>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href={`/play?stage=${result.stage}`}
          className="rounded-full bg-[var(--accent)] px-10 py-4 text-2xl font-extrabold text-[var(--accent-text)] shadow-[0_6px_0_rgb(0_0_0/0.15)] transition active:translate-y-1 active:shadow-none"
        >
          🔁 もういっかい
        </Link>
        <Link
          href="/stages"
          className="rounded-full border-2 border-[var(--card-border)] bg-[var(--card)] px-10 py-4 text-2xl font-bold"
        >
          🗺 ステージえらび
        </Link>
      </div>
      <p className="text-sm text-[var(--muted)]">
        <kbd className="rounded border border-[var(--card-border)] bg-[var(--card)] px-2 py-0.5">エンター</kbd> キーでも
        もういっかい あそべるよ
      </p>
    </div>
  );
}
