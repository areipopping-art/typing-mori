"use client";

import { useEffect } from "react";
import { courseOf } from "@/lib/courses";
import { useData } from "@/lib/storage";

/** コースの 背景の絵（画面いっぱいに うすく しく）。色は globals.css の --scene-* */
export default function Background() {
  const { course } = useData();
  const c = course ?? "kids";

  // <html data-course> と タブの タイトルを コースに合わせる
  useEffect(() => {
    document.documentElement.dataset.course = c;
    document.title = courseOf(c).appName;
  }, [c]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMax slice"
        className="h-full w-full"
        style={{ opacity: "var(--scene-opacity)" }}
      >
        {c === "student" ? <Classroom /> : c === "adult" ? <Office /> : <Forest />}
      </svg>
    </div>
  );
}

/** 子ども：森（おか と 木） */
function Forest() {
  const trees = [80, 230, 980, 1120];
  return (
    <g>
      <rect width="1200" height="800" fill="var(--scene-sky)" />
      <ellipse cx="300" cy="820" rx="520" ry="200" fill="var(--scene-a)" />
      <ellipse cx="950" cy="840" rx="560" ry="220" fill="var(--scene-b)" />
      {trees.map((x, i) => (
        <g key={x} transform={`translate(${x} ${560 + (i % 2) * 40})`}>
          <rect x="-12" y="40" width="24" height="90" rx="6" fill="var(--scene-d)" />
          <circle r="70" fill="var(--scene-c)" />
          <circle cx="-40" cy="30" r="45" fill="var(--scene-b)" />
          <circle cx="40" cy="30" r="45" fill="var(--scene-b)" />
        </g>
      ))}
    </g>
  );
}

/** 学生：教室（黒板・時計・窓・机） */
function Classroom() {
  const desks = [140, 400, 660, 920];
  return (
    <g>
      <rect width="1200" height="800" fill="var(--scene-sky)" />
      {/* 黒板 */}
      <rect x="190" y="70" width="820" height="300" rx="10" fill="var(--scene-b)" />
      <rect x="205" y="85" width="790" height="270" rx="6" fill="var(--scene-a)" />
      <rect x="230" y="355" width="740" height="14" rx="4" fill="var(--scene-b)" />
      {/* チョークの線 */}
      <g stroke="var(--scene-sky)" strokeWidth="6" strokeLinecap="round" opacity="0.7">
        <line x1="260" y1="140" x2="520" y2="140" />
        <line x1="260" y1="190" x2="460" y2="190" />
        <line x1="260" y1="240" x2="580" y2="240" />
        <line x1="820" y1="130" x2="940" y2="130" />
      </g>
      {/* 時計 */}
      <circle cx="1100" cy="110" r="44" fill="var(--scene-c)" stroke="var(--scene-b)" strokeWidth="8" />
      <line x1="1100" y1="110" x2="1100" y2="82" stroke="var(--scene-b)" strokeWidth="6" strokeLinecap="round" />
      <line x1="1100" y1="110" x2="1122" y2="118" stroke="var(--scene-b)" strokeWidth="6" strokeLinecap="round" />
      {/* 窓 */}
      <g fill="var(--scene-c)">
        <rect x="30" y="90" width="120" height="220" rx="6" />
        <rect x="1050" y="200" width="120" height="200" rx="6" />
      </g>
      {/* 床 */}
      <rect y="600" width="1200" height="200" fill="var(--scene-c)" />
      {[640, 700, 760].map((y) => (
        <line key={y} x1="0" y1={y} x2="1200" y2={y} stroke="var(--scene-d)" strokeWidth="3" opacity="0.5" />
      ))}
      {/* 机と いす */}
      {desks.map((x) => (
        <g key={x} transform={`translate(${x} 560)`}>
          <rect x="10" y="-40" width="120" height="70" rx="8" fill="var(--scene-d)" />
          <rect x="0" y="0" width="140" height="22" rx="6" fill="var(--scene-b)" />
          <rect x="14" y="22" width="10" height="110" fill="var(--scene-b)" />
          <rect x="116" y="22" width="10" height="110" fill="var(--scene-b)" />
        </g>
      ))}
    </g>
  );
}

/** 社会人：会社の社内（窓の外のビル・デスクとモニター・観葉植物） */
function Office() {
  const buildings = [
    [40, 180, 110], [170, 120, 90], [280, 210, 130], [430, 90, 100], [550, 160, 140],
    [710, 110, 90], [820, 190, 120], [960, 130, 100], [1080, 170, 110],
  ];
  return (
    <g>
      <rect width="1200" height="800" fill="var(--scene-c)" />
      {/* 大きな窓と 外の ビル */}
      <rect x="0" y="40" width="1200" height="360" fill="var(--scene-sky)" />
      {buildings.map(([x, top, w]) => (
        <g key={x}>
          <rect x={x} y={top + 40} width={w} height={400 - top} fill="var(--scene-a)" />
          {Array.from({ length: Math.floor((360 - top) / 40) }, (_, r) => (
            <rect key={r} x={x + 15} y={top + 60 + r * 40} width={w - 30} height="10" fill="var(--scene-sky)" opacity="0.6" />
          ))}
        </g>
      ))}
      {/* 窓わく */}
      {[0, 300, 600, 900, 1200].map((x) => (
        <rect key={x} x={x - 6} y="40" width="12" height="360" fill="var(--scene-b)" />
      ))}
      <rect y="394" width="1200" height="14" fill="var(--scene-b)" />
      {/* デスクと モニター */}
      {[120, 520, 920].map((x) => (
        <g key={x} transform={`translate(${x} 540)`}>
          <rect x="40" y="-90" width="120" height="78" rx="6" fill="var(--scene-b)" />
          <rect x="94" y="-12" width="12" height="22" fill="var(--scene-b)" />
          <rect x="0" y="10" width="200" height="18" rx="4" fill="var(--scene-b)" />
          <rect x="16" y="28" width="12" height="140" fill="var(--scene-b)" />
          <rect x="172" y="28" width="12" height="140" fill="var(--scene-b)" />
        </g>
      ))}
      {/* 観葉植物 */}
      {[60, 1130].map((x) => (
        <g key={x} transform={`translate(${x} 640)`}>
          <rect x="-28" y="20" width="56" height="70" rx="8" fill="var(--scene-b)" />
          <ellipse cx="-22" cy="-10" rx="22" ry="48" fill="var(--scene-d)" transform="rotate(-20 -22 -10)" />
          <ellipse cx="22" cy="-10" rx="22" ry="48" fill="var(--scene-d)" transform="rotate(20 22 -10)" />
          <ellipse cx="0" cy="-30" rx="20" ry="52" fill="var(--scene-d)" />
        </g>
      ))}
    </g>
  );
}
