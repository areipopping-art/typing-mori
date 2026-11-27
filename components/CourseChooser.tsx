"use client";

import { COURSES } from "@/lib/courses";
import { saveData, useData } from "@/lib/storage";

/** F-33 コースを えらぶ（いちばん最初） */
export default function CourseChooser() {
  const data = useData();
  return (
    <div className="w-full max-w-4xl">
      <h2 className="mb-1 text-3xl font-extrabold">コースを えらんでね</h2>
      <p className="mb-4 text-[var(--muted)]">年齢に合わせて、問題の難しさと背景が変わります</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" role="radiogroup" aria-label="コースを選ぶ">
        {COURSES.map((c) => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={data.course === c.id}
            onClick={() => saveData({ ...data, course: c.id })}
            className="rounded-3xl border-4 border-[var(--card-border)] bg-[var(--card)] p-6 text-left shadow-[0_6px_0_var(--card-border)] transition hover:-translate-y-1 hover:border-[var(--accent)] active:translate-y-1 active:shadow-none"
          >
            <span className="block text-6xl" aria-hidden>
              {c.emoji}
            </span>
            <span className="mt-2 block text-2xl font-extrabold">{c.name}</span>
            <span className="mt-1 block text-sm font-bold text-[var(--accent)]">
              {c.appEmoji} {c.appName}
            </span>
            <span className="mt-2 block text-[var(--muted)]">{c.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
