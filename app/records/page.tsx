"use client";

import Character from "@/components/Character";
import SpeedChart from "@/components/SpeedChart";
import { isShown, stagesFor } from "@/lib/stages";
import { historyOf, useData } from "@/lib/storage";

/** F-32 きろく（チャレンジ モードの 子ども向け。ひらがなの グラフ） */
export default function RecordsPage() {
  const data = useData();
  const stages = stagesFor(data.viewCourse).filter((s) => isShown(s.id, data));
  const card = "rounded-3xl border-2 border-[var(--card-border)] bg-[var(--card)] p-6";

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <Character mood="happy" message="どれだけ はやく なったかな？" />
      <h1 className="text-center text-3xl font-extrabold">📈 きろく</h1>

      <section className={card}>
        <h2 className="mb-3 text-xl font-bold">🏆 ステージごとの さいこうきろく</h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {stages.map((s) => {
            const best = data.best[s.id];
            const star = data.stars[s.id] ?? 0;
            return (
              <li key={s.id} className="flex items-center justify-between rounded-2xl bg-[var(--background)] px-4 py-3">
                <span className="font-bold">
                  {s.emoji} {s.name}
                  <span className="ml-2 text-[var(--sun)]" aria-label={`ほし ${star} こ`}>
                    {"★".repeat(star)}
                    <span className="text-[var(--card-border)]">{"★".repeat(3 - star)}</span>
                  </span>
                </span>
                <span className="text-right">
                  {best === undefined ? (
                    <span className="text-sm text-[var(--muted)]">まだ</span>
                  ) : (
                    <>
                      <b className="text-2xl text-[var(--accent)]">{best}</b>
                      <span className="text-sm"> もじ/ぷん</span>
                    </>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={card}>
        <h2 className="mb-3 text-xl font-bold">📈 はやさの グラフ</h2>
        <SpeedChart history={historyOf(data)} course={data.viewCourse} kid />
      </section>
    </div>
  );
}
