import { pageMetadata } from "@/lib/seo";
import { projectsSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { RecentProjects } from "@/components/project/RecentProjects";
import { Footer } from "@/components/footer/Footer";
import style from "../page.module.css";

export const metadata = pageMetadata({
  title: "React & Full Stack Projects",
  description:
    "Explore Sneaky, Snapgram and VibeJournal: React and TypeScript interfaces, Java and Spring Boot APIs, recommendation systems and offline-first workflows.",
  path: "/projects",
});
export default function ProjectsPage() {
  return (
    <>
      <JsonLd data={projectsSchema} />
      <main
        id="main-content"
        tabIndex={-1}
        className={`${style.page__main} ${style.page__listing}`}
      >
        <div className={style.page__container}>
          <RecentProjects standalone />
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
