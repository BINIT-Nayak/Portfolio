import type { Metadata } from "next";
import { CaseStudies } from "@/components/case-studies/CaseStudies";
import { Footer } from "@/components/footer/Footer";
import style from "../page.module.css";

export const metadata: Metadata = {
  title: "Engineering Case Studies",
  description:
    "Explore frontend architecture, real-time systems, performance, and full-stack engineering case studies.",
};
export default function CaseStudiesPage() {
  return (
    <main id="main-content" tabIndex={-1} className={`${style.page__main} ${style.page__listing}`}>
      <div className={style.page__container}>
        <CaseStudies standalone />
        <Footer />
      </div>
    </main>
  );
}
