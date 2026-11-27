"use client";

import { useState } from "react";
import SpeedChart from "@/components/SpeedChart";
import { modeOf } from "@/lib/modes";
import { stageOf } from "@/lib/stages";
import { STICKERS } from "@/lib/stickers";
import { clearData, saveData, useData } from "@/lib/storage";

const dateFormat = new Intl.DateTimeFormat("ja-JP", {
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** P-06 おうちのひとへ（保護者向け。子ども向けの画面と違い、漢字を使う） */
export default function ParentsPage() {
  const data = useData();
  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);

  const deleteAll = () => {
    if (!confirming) {
      setConfirming(true); // 1回目：確認
      return;
    }
    clearData();
    try {
      sessionStorage.removeItem("typing-mori-last");
    } catch {
      // 何もしない
    }
    setConfirming(false);
    setCleared(true);
  };

  const card = "rounded-3xl border-2 border-[var(--card-border)] bg-[var(--card)] p-6";

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">👪 おうちの方へ</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          練習の記録と設定です。データはこの端末のブラウザの中だけに保存され、外部には送信されません。
        </p>
      </div>

      <section className={card}>
        <h2 className="mb-3 text-xl font-bold">速さのグラフ</h2>
        <SpeedChart history={data.history} />
      </section>

      <section className={card}>
        <h2 className="mb-3 text-xl font-bold">練習の記録</h2>
        <p className="mb-3 text-sm">
          遊んだ回数 <b>{data.history.length}</b> 回 ／ 集めたシール{" "}
          <b>
            {data.stickers.length} / {STICKERS.length}
          </b>{" "}
          枚
        </p>
        {data.history.length === 0 ? (
          <p className="text-[var(--muted)]">まだ記録がありません。</p>
        ) : (
          <div className="max-h-96 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-[var(--card)] text-[var(--muted)]">
                <tr>
                  <th className="py-2 pr-3 font-normal">日時</th>
                  <th className="py-2 pr-3 font-normal">ステージ</th>
                  <th className="py-2 pr-3 font-normal">モード</th>
                  <th className="py-2 pr-3 text-right font-normal">速さ（文字/分）</th>
                  <th className="py-2 pr-3 text-right font-normal">正確さ</th>
                  <th className="py-2 font-normal">評価</th>
                </tr>
              </thead>
              <tbody>
                {data.history.map((h) => (
                  <tr key={h.at} className="border-t border-[var(--card-border)]">
                    <td className="py-2 pr-3 whitespace-nowrap">{dateFormat.format(new Date(h.at))}</td>
                    <td className="py-2 pr-3">{stageOf(h.stage).name}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{h.mode ? modeOf(h.mode).short : "—"}</td>
                    <td className="py-2 pr-3 text-right font-bold">{h.speed}</td>
                    <td className="py-2 pr-3 text-right">{h.acc}%</td>
                    <td className="py-2 text-[var(--sun)]">{"★".repeat(h.stars)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-xs text-[var(--muted)]">新しい順に最大 100 件まで保存します。</p>
      </section>

      <section className={card}>
        <h2 className="mb-3 text-xl font-bold">設定</h2>
        <label className="flex items-center justify-between gap-4">
          <span>
            効果音
            <span className="block text-sm text-[var(--muted)]">正解・ミス・クリアのときに音を鳴らします</span>
          </span>
          <input
            type="checkbox"
            role="switch"
            className="h-6 w-6 accent-[var(--accent)]"
            checked={data.sound}
            onChange={(e) => saveData({ ...data, sound: e.target.checked })}
          />
        </label>
        <label className="mt-4 flex items-center justify-between gap-4 border-t border-[var(--card-border)] pt-4">
          <span>
            指のガイド
            <span className="block text-sm text-[var(--muted)]">
              画面のキーボードを打つ指ごとに色分けし、次に使う指の名前を表示します
            </span>
          </span>
          <input
            type="checkbox"
            role="switch"
            className="h-6 w-6 accent-[var(--accent)]"
            checked={data.fingerGuide}
            onChange={(e) => saveData({ ...data, fingerGuide: e.target.checked })}
          />
        </label>
      </section>

      <section className={card}>
        <h2 className="mb-1 text-xl font-bold">全データの削除</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          最高記録・★・シール・練習の記録をすべて消します。元に戻せません。
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={deleteAll}
            className={`rounded-full px-6 py-2 font-bold ${
              confirming ? "bg-[var(--ng)] text-white" : "border-2 border-[var(--ng)] text-[var(--ng)]"
            }`}
          >
            {confirming ? "本当に削除する" : "全データを削除"}
          </button>
          {confirming && (
            <button type="button" onClick={() => setConfirming(false)} className="rounded-full px-4 py-2 underline">
              やめる
            </button>
          )}
          {cleared && !confirming && <span role="status">削除しました。</span>}
        </div>
      </section>
    </div>
  );
}
