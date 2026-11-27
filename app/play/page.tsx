import PlayClient from "@/components/PlayClient";
import { isStageId } from "@/lib/stages";

export default async function PlayPage(props: PageProps<"/play">) {
  const { stage } = await props.searchParams;
  return <PlayClient stage={isStageId(stage) ? stage : "lv1"} />;
}
