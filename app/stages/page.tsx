"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Character from "@/components/Character";
import { isShown, isUnlocked, stagesFor } from "@/lib/stages";
import { useData } from "@/lib/storage";

export default function StagesPage() {
  const router = useRouter();
  const data = useData();

  // 数字キー 1〜4 でも えらべる
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const stage = stagesFor(data.viewCourse).find((s) => s.key === e.key);
      if (stage && !e.repeat && isUnlocked(stage.id, data)) router.push(`/play?stage=${stage.id}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, data]);

  return (
    <div className="flex flex-1 flex-col items-center gap-8">
      <Character message="どの ステージで あそぶ？" />
      <ul className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {stagesFor(data.viewCourse).filter((s) => isShown(s.id, data)).map((s) => {
          const open = isUnlocked(s.id, data);
          const star = data.stars[s.id] ?? 0;
          const best = data.best[s.id];
          const body = (
            <>
              <div className="flex items-center justify-between">
                <span className="text-4xl" aria-hidden>
                  {open ? s.emoji : "🔒"}
                </span>
                <kbd className="rounded border border-[var(--card-border)] px-2 text-sm text-[var(--muted)]">{s.key}</kbd>
              </div>
              <p className="mt-2 text-2xl font-extrabold">{s.name}</p>
              <p className="text-sm text-[var(--muted)]">
                {open ? s.desc : s.lockHint}
              </p>
              {open && (
                <p className="mt-3 flex items-center justify-between">
                  <span className="text-2xl tracking-wider" aria-label={`ほし ${star} こ`}>
                    {[1, 2, 3].map((n) => (
                      <span key={n} className={n <= star ? "text-[var(--sun)]" : "text-[var(--card-border)]"}>
                        ★
                      </span>
                    ))}
                  </span>
                  <span className="text-sm">
                    {best === undefined ? "きろく なし" : <>🏆 1ぷんで <b className="text-lg">{best}</b> もじ</>}
                  </span>
                </p>
              )}
            </>
          );
          const base = "block h-full rounded-3xl border-2 p-5 text-left";
          return (
            <li key={s.id}>
              {open ? (
                <Link
                  href={`/play?stage=${s.id}`}
                  className={`${base} border-[var(--card-border)] bg-[var(--card)] shadow-[0_5px_0_var(--card-border)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none`}
                >
                  {body}
                </Link>
              ) : (
                <div className={`${base} border-dashed border-[var(--card-border)] bg-[var(--card)] text-[var(--muted)]`} aria-disabled>
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
