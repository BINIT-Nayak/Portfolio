import { notFound } from "next/navigation";
import { caseStudies } from "@/data/case-studies";
import { studyMetadata } from "@/lib/seo";
import { EngineeringArticle } from "@/components/case-studies/article/EngineeringArticle";
import { PlinkoPipeline } from "@/components/case-studies/PlinkoPipeline";
import { ToastPlayground } from "@/components/case-studies/ToastPlayground";
import { SneakyArchitecture } from "@/components/project/architecture/SneakyArchitecture";

export const dynamicParams = false;
const routedStudies = caseStudies.filter((study) => !study.detailHref);
export function generateStaticParams() {
  return routedStudies.map((study) => ({ slug: study.id }));
}
function getStudy(slug: string) {
  return routedStudies.find((study) => study.id === slug) ?? notFound();
}
export function generateMetadata({ params }: { params: { slug: string } }) {
  return studyMetadata(getStudy(params.slug));
}
export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const study = getStudy(params.slug);
  return (
    <EngineeringArticle study={study}>
      {study.id === "toast-messages" && <ToastPlayground headingLevel={2} />}
      {study.id === "plinko-ui" && <PlinkoPipeline headingLevel={2} />}
      {study.id === "sneaky-platform" && <SneakyArchitecture headingLevel={2} />}
    </EngineeringArticle>
  );
}
