import { MarkdownArticle } from "@/components/case-studies/article/MarkdownArticle";
import { caseStudies } from "@/data/case-studies";
import { studyMetadata } from "@/lib/seo";
const study = caseStudies.find((study) => study.id === "sneaky-recommendations")!;
export const metadata = studyMetadata(study);
export default function CaseStudyPage() {
  return <MarkdownArticle study={study} source="sneaky-recommendation-system" />;
}
