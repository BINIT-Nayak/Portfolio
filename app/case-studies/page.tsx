import { pageMetadata } from "@/lib/seo";
import { studyListSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { caseStudies } from "@/data/case-studies";
import { CaseStudies } from "@/components/case-studies/CaseStudies";
import { Footer } from "@/components/footer/Footer";
import style from "../page.module.css";

export const metadata = pageMetadata({
  title: "Engineering Case Studies",
  description:
    "Engineering case studies on React architecture, real-time interfaces, TypeScript, performance, distributed systems and full-stack product development.",
  path: "/case-studies",
});
export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd data={studyListSchema(caseStudies)} />
      <main
        id="main-content"
        tabIndex={-1}
        className={`${style.page__main} ${style.page__listing}`}
      >
        <div className={style.page__container}>
          <CaseStudies standalone />
        </div>
      </main>
      <div className={style.page__main}>
        <div className={style.page__container}>
          <Footer />
        </div>
      </div>
    </>
  );
}
