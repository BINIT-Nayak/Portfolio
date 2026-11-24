import { notFound } from "next/navigation";
import { caseStudies } from "@/data/case-studies";
import { studyMetadata } from "@/lib/seo";
import { EngineeringArticle } from "@/components/case-studies/article/EngineeringArticle";
import { PlinkoPipeline } from "@/components/case-studies/PlinkoPipeline";
import { ToastPlayground } from "@/components/case-studies/ToastPlayground";
import { SneakyArchitecture } from "@/components/project/architecture/SneakyArchitecture";

// Keep unknown slugs as real HTTP 404s rather than streamed 200 not-found responses.
export const dynamicParams = false;
const routedStudies = caseStudies.filter((study) => !study.detailHref);
export function generateStaticParams() {
  return routedStudies.map((study) => ({ slug: study.id }));
}
function getStudy(slug: string) {
  return routedStudies.find((study) => study.id === slug) ?? notFound();
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return studyMetadata(getStudy((await params).slug));
}
export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const study = getStudy((await params).slug);
  return (
    <EngineeringArticle study={study}>
      {study.id === "toast-messages" && <ToastPlayground headingLevel={2} />}
      {study.id === "plinko-ui" && <PlinkoPipeline headingLevel={2} />}
      {study.id === "sneaky-platform" && <SneakyArchitecture headingLevel={2} />}
    </EngineeringArticle>
  );
}
