import { studyMetadata } from "@/lib/seo";
import { caseStudies } from "@/data/case-studies";
import { EngineeringArticle } from "@/components/case-studies/article/EngineeringArticle";

export const metadata = studyMetadata(
  caseStudies.find((study) => study.id === "vibejournal-offline-sync")!
);
export default function OfflineSyncPage() {
  const study = caseStudies.find((item) => item.id === "vibejournal-offline-sync")!;
  return <EngineeringArticle study={study} />;
}
