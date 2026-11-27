"use client";

import Character from "@/components/Character";
import { stageOf } from "@/lib/stages";
import { STICKERS } from "@/lib/stickers";
import { useData } from "@/lib/storage";

export default function StickersPage() {
  const data = useData();
  const count = STICKERS.filter((s) => data.stickers.includes(s.id)).length;

  return (
    <div className="flex flex-1 flex-col items-center gap-8">
      <Character
        mood={count > 0 ? "happy" : "normal"}
        message={count === STICKERS.length ? "ぜんぶ あつめたね！ すごい！" : "がんばって シールを あつめよう！"}
      />
      <h1 className="text-3xl font-extrabold">
        📖 ずかん <span className="text-xl text-[var(--muted)]">{count} / {STICKERS.length} まい</span>
      </h1>
      <ul className="grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {STICKERS.map((s) => {
          const has = data.stickers.includes(s.id);
          return (
            <li
              key={s.id}
              className={`flex flex-col items-center rounded-3xl border-2 p-4 text-center ${
                has ? "border-[var(--sun)] bg-[var(--card)]" : "border-dashed border-[var(--card-border)] bg-[var(--card)]"
              }`}
            >
              {/* まだのものは シルエット */}
              <span className={`text-6xl ${has ? "" : "opacity-25 brightness-0 grayscale"}`} aria-hidden>
                {s.emoji}
              </span>
              <span className="mt-2 font-bold">{has ? s.name : "？？？"}</span>
              <span className="text-xs text-[var(--muted)]">
                {stageOf(s.stage).name.split(" ")[0]} で {"★".repeat(s.stars)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
