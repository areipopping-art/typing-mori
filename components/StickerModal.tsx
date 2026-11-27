"use client";

import { useEffect } from "react";
import { stickerOf } from "@/lib/stickers";

/** M-01 シールゲット！（けっか画面の小窓） */
export default function StickerModal({ ids, onClose }: { ids: string[]; onClose: () => void }) {
  // Enter・Esc・Space でも とじられる
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["Enter", "Escape", " "].includes(e.key)) {
        e.preventDefault();
        e.stopImmediatePropagation(); // けっか画面の「Enter で もういっかい」を止める
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal aria-labelledby="sticker-title">
      <div className="w-full max-w-md rounded-3xl border-4 border-[var(--sun)] bg-[var(--card)] p-8 text-center shadow-xl">
        <p id="sticker-title" className="text-3xl font-extrabold text-[var(--accent)]">
          🎁 シールゲット！
        </p>
        <ul className="my-6 flex flex-wrap justify-center gap-6">
          {ids.map((id) => {
            const s = stickerOf(id);
            if (!s) return null;
            return (
              <li key={id} className="animate-bounce">
                <span className="block text-7xl" aria-hidden>
                  {s.emoji}
                </span>
                <span className="font-bold">{s.name}</span>
              </li>
            );
          })}
        </ul>
        <p className="mb-4 text-sm text-[var(--muted)]">📖 ずかんに はったよ</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-[var(--accent)] px-10 py-3 text-xl font-extrabold text-[var(--accent-text)]"
          autoFocus
        >
          やったー！
        </button>
      </div>
    </div>
  );
}
