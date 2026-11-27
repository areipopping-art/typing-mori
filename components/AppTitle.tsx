"use client";

import Link from "next/link";
import { courseOf } from "@/lib/courses";
import { useData } from "@/lib/storage";

/** ヘッダーの アプリ名（コースで かわる） */
export default function AppTitle() {
  const { course } = useData();
  const c = courseOf(course);
  return (
    <Link href="/" className="text-xl font-extrabold text-[var(--accent)]">
      {c.appEmoji} {c.appName}
    </Link>
  );
}
