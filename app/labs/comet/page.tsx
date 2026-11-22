import type { Metadata } from "next";
import { caseStudies } from "@/data/case-studies";
import { EngineeringArticle } from "@/components/case-studies/article/EngineeringArticle";
import { CometLab } from "@/components/labs/comet/CometLab";

export const metadata: Metadata = {
  title: "Comet — Interactive Animation Engineering Lab",
  description:
    "An interactive Canvas 2D lab for trajectories, concurrent effects, shared frame scheduling, pause/resume, and lifecycle cleanup.",
};
export default function CometPage() {
  const study = caseStudies.find((item) => item.id === "comet-lab")!;
  return (
    <EngineeringArticle study={study}>
      <CometLab />
    </EngineeringArticle>
  );
}
