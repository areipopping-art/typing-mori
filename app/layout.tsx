import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import Link from "next/link";
import HeaderNav from "@/components/HeaderNav";
import "./globals.css";

// 丸ゴシック（日本語は文字数が多いため、先読みはせず表示しながら読み込む）
const rounded = M_PLUS_Rounded_1c({
  weight: ["400", "700", "800"],
  preload: false,
  display: "swap",
  variable: "--font-m-plus-rounded",
});

export const metadata: Metadata = {
  title: "タイピングのもり",
  description: "子どもが楽しく遊びながらローマ字入力を練習できるタイピングゲーム",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${rounded.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-[var(--card-border)] bg-[var(--card)]">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="text-xl font-extrabold text-[var(--accent)]">
              🌳 タイピングのもり
            </Link>
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
