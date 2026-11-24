import { MarkdownArticle } from "@/components/case-studies/article/MarkdownArticle";
import { caseStudies } from "@/data/case-studies";
import { studyMetadata } from "@/lib/seo";
const study = caseStudies.find((study) => study.id === "cache-first-recommendation-api")!;
export const metadata = studyMetadata(study);
export default function CaseStudyPage() {
  return <MarkdownArticle study={study} source="cache-first-recommendation-api" />;
}
