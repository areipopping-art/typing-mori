"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Character from "@/components/Character";

export default function Home() {
  const router = useRouter();

  // Space キーでも あそべる
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        router.push("/play");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 text-center">
      <Character mood="happy" message="いっしょに れんしゅう しよう！" />
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold">タイピングのもり</h1>
        <p className="text-[var(--muted)]">ひらがなの ことばを ローマじで うってみよう。1かい 10こ だよ。</p>
      </div>
      <Link
        href="/play"
        className="rounded-full bg-[var(--accent)] px-16 py-5 text-3xl font-extrabold text-[var(--accent-text)] shadow-[0_6px_0_rgb(0_0_0/0.15)] transition active:translate-y-1 active:shadow-none"
      >
        ▶ あそぶ
      </Link>
      <p className="text-sm text-[var(--muted)]">
        <kbd className="rounded border border-[var(--card-border)] bg-[var(--card)] px-2 py-0.5">スペース</kbd>{" "}
        キーでも はじめられるよ
      </p>
    </div>
  );
}
