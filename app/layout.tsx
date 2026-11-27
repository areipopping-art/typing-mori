import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import Link from "next/link";
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
            <nav className="flex gap-2 text-lg font-bold">
              <Link href="/stages" className="rounded-full px-3 py-1 hover:bg-[var(--background)]">
                🗺 ステージ
              </Link>
              <Link href="/stickers" className="rounded-full px-3 py-1 hover:bg-[var(--background)]">
                📖 ずかん
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
