import { studyMetadata } from "@/lib/seo";
import { caseStudies } from "@/data/case-studies";
import { EngineeringArticle } from "@/components/case-studies/article/EngineeringArticle";
import { CometLab } from "@/components/labs/comet/CometLab";

export const metadata = studyMetadata(caseStudies.find((study) => study.id === "comet-lab")!);
export default function CometPage() {
  const study = caseStudies.find((item) => item.id === "comet-lab")!;
  return (
    <EngineeringArticle study={study}>
      <CometLab />
    </EngineeringArticle>
  );
}
