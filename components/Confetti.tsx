"use client";

import { useState } from "react";

const COLORS = ["#f6c445", "#6cc35a", "#ff8fab", "#7cc6ff", "#c49bff"];

/** しんきろくのときに降る紙ふぶき（CSS アニメーション、数秒で消える） */
export default function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 1.5,
      color: COLORS[i % COLORS.length],
      rotate: Math.random() * 360,
    })),
  );
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti absolute -top-4 block h-3 w-2 rounded-sm"
          style={{
            left: `${p.left}%`,
            background: p.color,
            rotate: `${p.rotate}deg`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
