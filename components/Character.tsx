"use client";

import { selectedCharacter } from "@/lib/characters";
import { useData } from "@/lib/storage";

export type Mood = "normal" | "happy" | "surprised";

const BADGE: Record<Mood, string> = { normal: "", happy: "✨", surprised: "💦" };

/** えらんだ もりの なかまと 吹き出し */
export default function Character({ mood = "normal", message }: { mood?: Mood; message: string }) {
  const c = selectedCharacter(useData());
  const motion =
    mood === "happy" ? "animate-bounce" : mood === "surprised" ? "animate-[shake_0.3s_ease-in-out]" : "";
  return (
    <div className="flex items-center justify-center gap-3">
      <div key={mood + message} className={`relative text-6xl ${motion}`} aria-label={c.name} role="img">
        {c.emoji}
        <span className="absolute -right-3 -top-2 text-2xl" aria-hidden>
          {BADGE[mood]}
        </span>
        {/* 持ち物（サッカーボール・名札 など） */}
        {c.badge && (
          <span className="absolute -bottom-1 -right-3 text-3xl" aria-hidden>
            {c.badge}
          </span>
        )}
      </div>
      <p
        className="relative rounded-2xl border-2 border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-lg font-bold"
        role="status"
      >
        {message}
      </p>
    </div>
  );
}
