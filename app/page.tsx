"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Character from "@/components/Character";
import CourseChooser from "@/components/CourseChooser";
import ModeChooser from "@/components/ModeChooser";
import { CHARACTERS, characterOf } from "@/lib/characters";
import { courseOf } from "@/lib/courses";
import { modeOf } from "@/lib/modes";
import { stagesFor } from "@/lib/stages";
import { saveData, useData } from "@/lib/storage";
import { textsFor } from "@/lib/texts";

// スタンプカードは「きょう」の日付を使うので、サーバーでは描画せずブラウザだけで作る
const StampCard = dynamic(() => import("@/components/StampCard"), { ssr: false });

export default function Home() {
  const router = useRouter();
  const data = useData();
  const t = textsFor(data.course);
  const records = stagesFor(data.viewCourse).filter((s) => data.best[s.id] !== undefined);

  // Space キーでも あそべる
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat && data.mode && data.course) {
        e.preventDefault();
        router.push("/stages");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, data.mode, data.course]);

  // いちばん最初は コースえらび → つぎに モードえらび
  if (!data.course) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <Character mood="happy" message="ようこそ！ まずは コースを えらんでね" />
        <CourseChooser />
      </div>
    );
  }
  if (!data.mode) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <Character mood="happy" message={t.welcome} />
        <ModeChooser />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 text-center">
      <Character mood="happy" message={t.greet(characterOf(data.character).name)} />
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold">{courseOf(data.course).appName}</h1>
        <p className="text-[var(--muted)]">{t.homeLead}</p>
      </div>
      <div className="rounded-3xl border-2 border-[var(--card-border)] bg-[var(--card)] px-8 py-4">
        <p className="text-sm text-[var(--muted)]">{t.bestTitle}</p>
        {records.length === 0 ? (
          <p className="text-lg font-bold">{t.bestNone}</p>
        ) : (
          <ul className="mt-1 flex flex-wrap justify-center gap-x-6 gap-y-1">
            {records.map((s) => (
              <li key={s.id} className="font-bold">
                {s.emoji} {s.name.split(" ")[0]}{" "}
                <span className="text-2xl font-extrabold text-[var(--accent)]">{data.best[s.id]}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <StampCard />
      <div>
        <p className="mb-2 text-sm text-[var(--muted)]">{t.chooseCharacter}</p>
        <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="なかまを えらぶ">
          {CHARACTERS.map((c) => {
            const selected = c.id === data.character;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={c.name}
                onClick={() => saveData({ ...data, character: c.id })}
                className={`rounded-2xl border-2 px-3 py-1 text-4xl transition ${
                  selected
                    ? "border-[var(--accent)] bg-[var(--card)] shadow-[0_4px_0_var(--card-border)]"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {c.emoji}
              </button>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        onClick={() => saveData({ ...data, mode: null })}
        className="text-sm text-[var(--muted)] underline"
      >
        {t.nowMode(modeOf(data.mode).emoji, t.modes[data.mode].name)}
      </button>
      <button
        type="button"
        onClick={() => saveData({ ...data, course: null })}
        className="-mt-8 text-sm text-[var(--muted)] underline"
      >
        {t.nowCourse(courseOf(data.course).emoji, courseOf(data.course).name)}
      </button>
      <Link
        href="/stages"
        className="rounded-full bg-[var(--accent)] px-16 py-5 text-3xl font-extrabold text-[var(--accent-text)] shadow-[0_6px_0_rgb(0_0_0/0.15)] transition active:translate-y-1 active:shadow-none"
      >
        {t.play}
      </Link>
      <p className="text-sm text-[var(--muted)]">
        <kbd className="rounded border border-[var(--card-border)] bg-[var(--card)] px-2 py-0.5">{t.spaceKey}</kbd>{" "}
        {t.spaceHint}
      </p>
    </div>
  );
}
