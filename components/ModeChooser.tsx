"use client";

import { MODES } from "@/lib/modes";
import { saveData, useData } from "@/lib/storage";
import { useTexts } from "@/lib/texts";

/** F-29 モードを えらぶ（大きな2まいの カード） */
export default function ModeChooser() {
  const data = useData();
  const t = useTexts();
  return (
    <div className="w-full max-w-3xl">
      <h2 className="mb-4 text-3xl font-extrabold">{t.chooseMode}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" role="radiogroup" aria-label="モードを えらぶ">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={data.mode === m.id}
            onClick={() => saveData({ ...data, mode: m.id })}
            className="rounded-3xl border-4 border-[var(--card-border)] bg-[var(--card)] p-6 text-left shadow-[0_6px_0_var(--card-border)] transition hover:-translate-y-1 hover:border-[var(--accent)] active:translate-y-1 active:shadow-none"
          >
            <span className="block text-6xl" aria-hidden>
              {m.emoji}
            </span>
            <span className="mt-2 block text-2xl font-extrabold">{t.modes[m.id].name}</span>
            <ul className="mt-3 space-y-1 text-[var(--muted)]">
              {t.modes[m.id].desc.map((d) => (
                <li key={d}>・{d}</li>
              ))}
            </ul>
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-[var(--muted)]">{t.modeNote}</p>
    </div>
  );
}
