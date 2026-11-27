"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { courseOf } from "@/lib/courses";
import { modeOf } from "@/lib/modes";
import { saveData, useData } from "@/lib/storage";

/** ヘッダーの右がわ（いまの モードの バッジと メニュー） */
export default function HeaderNav() {
  const router = useRouter();
  const data = useData();
  const link = "rounded-full px-3 py-1 hover:bg-[var(--background)]";

  return (
    <nav className="flex flex-wrap items-center justify-end gap-1 text-lg font-bold">
      {data.course && (
        <button
          type="button"
          onClick={() => {
            saveData({ ...data, course: null }); // ホームで えらびなおす
            router.push("/");
          }}
          className="rounded-full border-2 border-[var(--card-border)] px-3 py-0.5 text-base"
          title="コースを かえる"
        >
          {courseOf(data.course).emoji} {courseOf(data.course).name.replace(/（.*）/, "")}
        </button>
      )}
      {data.course && data.mode && (
        <button
          type="button"
          onClick={() => {
            saveData({ ...data, mode: null }); // ホームで えらびなおす
            router.push("/");
          }}
          className="rounded-full border-2 border-[var(--card-border)] px-3 py-0.5 text-base"
          title="モードを かえる"
        >
          {modeOf(data.mode).emoji} {modeOf(data.mode).short}
        </button>
      )}
      <Link href="/stages" className={link}>
        🗺 ステージ
      </Link>
      <Link href="/stickers" className={link}>
        📖 ずかん
      </Link>
      {data.mode === "b" && (
        <Link href="/records" className={link}>
          📈 きろく
        </Link>
      )}
    </nav>
  );
}
