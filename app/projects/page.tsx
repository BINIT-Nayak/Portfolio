import type { Metadata } from "next";
import { RecentProjects } from "@/components/project/RecentProjects";
import { Footer } from "@/components/footer/Footer";
import style from "../page.module.css";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore Sneaky, Snapgram, and VibeJournal through product capabilities and engineering decisions.",
};
export default function ProjectsPage() {
  return (
    <>
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
