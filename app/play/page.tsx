import { Suspense } from "react";
import PlayClient from "@/components/PlayClient";
import { isStageId } from "@/lib/stages";

/** URL の ?stage= を読んで、そのステージで遊ぶ */
async function PlayWithStage({ searchParams }: { searchParams: PageProps<"/play">["searchParams"] }) {
  const { stage } = await searchParams;
  return <PlayClient stage={isStageId(stage) ? stage : "lv1"} />;
}

export default function PlayPage(props: PageProps<"/play">) {
  // searchParams は表示のたびに変わるので Suspense の中で読む（Next.js 16 の決まり）
  return (
    <Suspense fallback={null}>
      <PlayWithStage searchParams={props.searchParams} />
    </Suspense>
  );
}
