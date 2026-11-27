"use client";

import dynamic from "next/dynamic";
import type { StageId } from "@/lib/words";

// ことばはランダムに選ぶので、サーバーでは描画せずブラウザだけで作る
const Game = dynamic(() => import("@/components/Game"), { ssr: false });

export default function PlayClient({ stage }: { stage: StageId }) {
  return <Game key={stage} stage={stage} />;
}
