"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { courseOf } from "@/lib/courses";
import { modeOf } from "@/lib/modes";
import { saveData, useData } from "@/lib/storage";
import { textsFor } from "@/lib/texts";

/** ヘッダーの右がわ（いまの モードの バッジと メニュー） */
export default function HeaderNav() {
  const router = useRouter();
  const data = useData();
  const t = textsFor(data.course);
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
          title={t.changeCourse}
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
          title={t.changeMode}
        >
          {modeOf(data.mode).emoji} {t.modes[data.mode].short}
        </button>
      )}
      <Link href="/stages" className={link}>
        {t.navStages}
      </Link>
      <Link href="/stickers" className={link}>
        {t.navCollection}
      </Link>
      {data.mode === "b" && (
        <Link href="/records" className={link}>
          {t.navRecords}
        </Link>
      )}
    </nav>
  );
}
