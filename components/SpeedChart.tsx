"use client";

import { useState } from "react";
import { STAGES, stageOf } from "@/lib/stages";
import type { HistoryItem } from "@/lib/storage";
import type { StageId } from "@/lib/words";

const MAX_POINTS = 30;
const W = 600;
const H = 220;
const PAD = { top: 16, right: 16, bottom: 28, left: 40 };

const dateFormat = new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric" });
const dateTimeFormat = new Intl.DateTimeFormat("ja-JP", {
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** 目盛り（4等分）が きりのよい数になるよう、上限を決める（例：84 → 100、0・25・50・75・100） */
function niceMax(v: number): number {
  const steps = [5, 10, 20, 25, 50, 100, 200, 250, 500];
  const step = steps.find((st) => st * 4 >= v) ?? Math.ceil(v / 4 / 100) * 100;
  return step * 4;
}

/** 見出しなどの言葉（保護者向けと 子ども向けで かえる） */
const TEXT = {
  parent: {
    empty: "まだ記録がありません。",
    title: (name: string) => `${name} の速さ（文字/分）`,
    recent: (n: number) => `直近 ${n} 回`,
    aria: (name: string, v: number) => `${name}の速さの推移。最新は 1分あたり ${v} 文字`,
    speed: "速さ",
    unit: "文字/分",
    acc: "正確さ",
    showTable: "表で見る",
    hideTable: "表を閉じる",
    when: "日時",
  },
  kid: {
    empty: "まだ きろくが ないよ。あそんでみよう！",
    title: (name: string) => `${name} の はやさ（1ぷんで なんもじ）`,
    recent: (n: number) => `さいきんの ${n}かい`,
    aria: (name: string, v: number) => `${name}の はやさの グラフ。さいごは 1ぷんで ${v}もじ`,
    speed: "はやさ",
    unit: "もじ/ぷん",
    acc: "せいかくさ",
    showTable: "ひょうで みる",
    hideTable: "ひょうを とじる",
    when: "ひにち",
  },
};

/**
 * F-26 はやさのグラフ（保護者向け。kid を つけると 子ども向けの 言葉に なる：F-32）
 * ステージを1つ選んで、そのステージの はやさ（文字/分）の推移を 1本の折れ線で表示する（直近 30 回）
 */
export default function SpeedChart({ history, kid = false }: { history: HistoryItem[]; kid?: boolean }) {
  const t = kid ? TEXT.kid : TEXT.parent;
  const stagesWithData = STAGES.filter((s) => history.some((h) => h.stage === s.id));
  const [picked, setPicked] = useState<StageId | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  if (stagesWithData.length === 0) return <p className="text-[var(--muted)]">{t.empty}</p>;

  // 選ばれていなければ、いちばん多く遊んだステージ
  const stage =
    picked && stagesWithData.some((s) => s.id === picked)
      ? picked
      : stagesWithData
          .map((s) => ({ id: s.id, n: history.filter((h) => h.stage === s.id).length }))
          .sort((a, b) => b.n - a.n)[0].id;

  // history は新しい順なので、古い順に並べ直す
  const points = history
    .filter((h) => h.stage === stage)
    .slice(0, MAX_POINTS)
    .reverse();

  const yMax = niceMax(Math.max(...points.map((p) => p.speed)));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
  const y = (v: number) => PAD.top + innerH - (v / yMax) * innerH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(yMax * t));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.speed)}`).join(" ");
  const slot = points.length > 1 ? innerW / (points.length - 1) : innerW;
  const hp = hover !== null ? points[hover] : null;

  return (
    <div className="viz-root">
      <style>{`
        .viz-root { --viz-series: #257de0; --viz-surface: var(--card); --viz-grid: var(--card-border); }
        @media (prefers-color-scheme: dark) { .viz-root { --viz-series: #338ced; } }
      `}</style>

      {/* ステージの切り替え（1列） */}
      <div className="mb-3 flex flex-wrap gap-2" role="tablist" aria-label="ステージ">
        {stagesWithData.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={s.id === stage}
            onClick={() => {
              setPicked(s.id);
              setHover(null);
            }}
            className={`rounded-full border-2 px-3 py-1 text-sm font-bold ${
              s.id === stage
                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-text)]"
                : "border-[var(--card-border)]"
            }`}
          >
            {s.emoji} {s.name}
          </button>
        ))}
      </div>

      <p className="mb-1 text-sm font-bold">
        {t.title(stageOf(stage).name)}
        <span className="ml-2 font-normal text-[var(--muted)]">{t.recent(points.length)}</span>
      </p>

      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label={t.aria(stageOf(stage).name, points[points.length - 1].speed)}
          onMouseLeave={() => setHover(null)}
        >
          {/* 目盛り線（細く・控えめに） */}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--viz-grid)" strokeWidth={1} />
              <text x={PAD.left - 6} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill="var(--muted)">
                {t}
              </text>
            </g>
          ))}
          {/* 横軸：最初と最後の日付 */}
          <text x={x(0)} y={H - 8} textAnchor={points.length === 1 ? "middle" : "start"} fontSize={11} fill="var(--muted)">
            {dateFormat.format(new Date(points[0].at))}
          </text>
          {points.length > 1 && (
            <text x={x(points.length - 1)} y={H - 8} textAnchor="end" fontSize={11} fill="var(--muted)">
              {dateFormat.format(new Date(points[points.length - 1].at))}
            </text>
          )}

          {/* カーソルの縦線 */}
          {hover !== null && (
            <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + innerH} stroke="var(--muted)" strokeWidth={1} />
          )}

          <path d={path} fill="none" stroke="var(--viz-series)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {points.map((p, i) => (
            <circle
              key={p.at}
              cx={x(i)}
              cy={y(p.speed)}
              r={hover === i ? 6 : 4}
              fill="var(--viz-series)"
              stroke="var(--viz-surface)"
              strokeWidth={2}
            />
          ))}

          {/* 最新の値だけ 数字を添える */}
          <text
            x={x(points.length - 1)}
            y={y(points[points.length - 1].speed) - 10}
            textAnchor={points.length === 1 ? "middle" : "end"}
            fontSize={12}
            fontWeight={700}
            fill="var(--foreground)"
          >
            {points[points.length - 1].speed}
          </text>

          {/* カーソルを合わせる範囲（点より広く） */}
          {points.map((p, i) => (
            <rect
              key={`hit-${p.at}`}
              x={x(i) - slot / 2}
              y={PAD.top}
              width={slot}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          ))}
        </svg>

        {hp && hover !== null && (
          <div
            className="pointer-events-none absolute top-0 z-10 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-xs shadow-lg"
            style={{
              left: `${(x(hover) / W) * 100}%`,
              transform: `translateX(${x(hover) > W / 2 ? "-105%" : "5%"})`,
            }}
          >
            <p className="text-[var(--muted)]">{dateTimeFormat.format(new Date(hp.at))}</p>
            <p>
              <span
                className="mr-1 inline-block h-2 w-2 rounded-full align-middle"
                style={{ background: "var(--viz-series)" }}
              />
              {t.speed} <b className="text-sm">{hp.speed}</b> {t.unit}
            </p>
            <p>
              {t.acc} {hp.acc}%　<span className="text-[var(--sun)]">{"★".repeat(hp.stars)}</span>
            </p>
          </div>
        )}
      </div>

      <button type="button" onClick={() => setShowTable((v) => !v)} className="mt-2 text-sm underline">
        {showTable ? t.hideTable : t.showTable}
      </button>
      {showTable && (
        <table className="mt-2 w-full text-left text-sm">
          <thead className="text-[var(--muted)]">
            <tr>
              <th className="py-1 pr-3 font-normal">{t.when}</th>
              <th className="py-1 pr-3 text-right font-normal">
                {t.speed}（{t.unit}）
              </th>
              <th className="py-1 text-right font-normal">{t.acc}</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.at} className="border-t border-[var(--card-border)]">
                <td className="py-1 pr-3">{dateTimeFormat.format(new Date(p.at))}</td>
                <td className="py-1 pr-3 text-right">{p.speed}</td>
                <td className="py-1 text-right">{p.acc}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
