import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import Link from "next/link";
import AppTitle from "@/components/AppTitle";
import Background from "@/components/Background";
import HeaderNav from "@/components/HeaderNav";
import "./globals.css";

// 丸ゴシック（日本語は文字数が多いため、先読みはせず表示しながら読み込む）
const rounded = M_PLUS_Rounded_1c({
  weight: ["400", "700", "800"],
  preload: false,
  display: "swap",
  variable: "--font-m-plus-rounded",
});

/** 保存データの コースを <html data-course> に つける（データは端末の外に出ない） */
const COURSE_SCRIPT = `try{var d=JSON.parse(localStorage.getItem("typing-mori")||"{}");document.documentElement.dataset.course=d.course||"kids"}catch(e){}`;

export const metadata: Metadata = {
  title: "タイピングのもり",
  description: "子どもが楽しく遊びながらローマ字入力を練習できるタイピングゲーム",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${rounded.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* 読み込み直後に 子どもコースの色が 一瞬 見えないよう、描画前に コースを つける */}
        <script dangerouslySetInnerHTML={{ __html: COURSE_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Background />
        <header className="border-b border-[var(--card-border)] bg-[var(--card)]/90 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
            <AppTitle />
            <HeaderNav />
          </div>
        </header>
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8">{children}</main>
        <footer className="py-4 text-center text-xs text-[var(--muted)]">
          <Link href="/parents" className="underline">
            おうちの方へ（記録・設定）
          </Link>
        </footer>
      </body>
    </html>
  );
}
