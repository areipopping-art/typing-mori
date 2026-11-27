"use client";

import dynamic from "next/dynamic";

// ことばはランダムに選ぶので、サーバーでは描画せずブラウザだけで作る
const Game = dynamic(() => import("@/components/Game"), { ssr: false });

export default function PlayPage() {
  return <Game />;
}
