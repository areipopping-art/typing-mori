"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Character from "@/components/Character";
import { accuracy, sortMissChars, speedPerMinute, stars } from "@/lib/score";
import { loadLast } from "@/lib/storage";

const STAR_MESSAGE = {
  1: "さいごまで うてたね！ つぎは ゆっくり ていねいに うってみよう",
  2: "じょうず！ もうすこしで ★3つ だよ",
  3: "すごい！ もりの タイピング めいじん だ！",
} as const;

export default function ResultView() {
  const router = useRouter();
  const [result] = useState(loadLast);

  // 結果がない（直接このページを開いた）ときはホームへ
  useEffect(() => {
    if (!result) router.replace("/");
  }, [result, router]);

  // Enter で もういっかい
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.repeat) router.push("/play");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  if (!result) return null;

  const speed = speedPerMinute(result);
  const acc = accuracy(result);
  const star = stars(speed, acc);
  const misses = sortMissChars(result.missChars);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      <Character mood="happy" message={STAR_MESSAGE[star]} />

      <p className="text-6xl tracking-widest" aria-label={`ほし ${star} こ`}>
        {[1, 2, 3].map((n) => (
          <span key={n} className={n <= star ? "text-[var(--sun)]" : "text-[var(--card-border)]"}>
            ★
          </span>
        ))}
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
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/play"
          className="rounded-full bg-[var(--accent)] px-10 py-4 text-2xl font-extrabold text-[var(--accent-text)] shadow-[0_6px_0_rgb(0_0_0/0.15)] transition active:translate-y-1 active:shadow-none"
        >
          🔁 もういっかい
        </Link>
        <Link
          href="/"
          className="rounded-full border-2 border-[var(--card-border)] bg-[var(--card)] px-10 py-4 text-2xl font-bold"
        >
          🏠 ホームへ
        </Link>
      </div>
      <p className="text-sm text-[var(--muted)]">
        <kbd className="rounded border border-[var(--card-border)] bg-[var(--card)] px-2 py-0.5">エンター</kbd> キーでも
        もういっかい あそべるよ
      </p>
    </div>
  );
}
