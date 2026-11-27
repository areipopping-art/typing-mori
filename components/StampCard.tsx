"use client";

import { dayKey, lastDays, streak } from "@/lib/days";
import { useData } from "@/lib/storage";
import { useTexts } from "@/lib/texts";


/** まいにちスタンプ（直近 7 日。遊んだ日に 🐾） */
export default function StampCard() {
  const { playDays } = useData();
  const t = useTexts();
  const days = lastDays(7);
  const todayKey = dayKey();
  const n = streak(playDays);

  return (
    <div className="rounded-3xl border-2 border-[var(--card-border)] bg-[var(--card)] px-6 py-4">
      <p className="mb-2 text-sm text-[var(--muted)]">
        {t.stamp}
        {n > 0 && (
          <span className="ml-2 font-bold text-[var(--accent)]">
            {t.streak(n)}
          </span>
        )}
      </p>
      <ol className="flex gap-2">
        {days.map((d) => {
          const key = dayKey(d);
          const played = playDays.includes(key);
          const isToday = key === todayKey;
          return (
            <li key={key} className="flex flex-col items-center gap-1">
              <span className={`text-xs ${isToday ? "font-bold text-[var(--accent)]" : "text-[var(--muted)]"}`}>
                {isToday ? t.today : t.week[d.getDay()]}
              </span>
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-2xl ${
                  played ? "border-[var(--sun)] bg-[var(--background)]" : "border-dashed border-[var(--card-border)]"
                } ${isToday ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--card)]" : ""}`}
                aria-label={`${d.getMonth() + 1}がつ${d.getDate()}にち ${played ? "あそんだ" : "まだ"}`}
              >
                {played ? "🐾" : ""}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
