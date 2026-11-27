"use client";

import dynamic from "next/dynamic";

// 結果はブラウザ（sessionStorage）から読むので、サーバーでは描画しない
const ResultView = dynamic(() => import("@/components/ResultView"), { ssr: false });

export default function ResultPage() {
  return <ResultView />;
}
