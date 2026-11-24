import { EngineeringPlayground } from "@/components/playground/EngineeringPlayground";
import { pageMetadata } from "@/lib/seo";
import { profileSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { CaseStudies } from "@/components/case-studies/CaseStudies";
import { Clients } from "@/components/client/Clients";
import { Experience } from "@/components/experience/Experience";
import { Footer } from "@/components/footer/Footer";
import { Grid } from "@/components/grid/Grid";
import { Hero } from "@/components/hero/Hero";
import { RecentProjects } from "@/components/project/RecentProjects";
import { Stats } from "@/components/stats/Stats";

import style from "./page.module.css";

export const metadata = pageMetadata({
  title: "Frontend & Full Stack Engineer in Hyderabad",
  description:
    "Binit Nayak builds production React and TypeScript interfaces, real-time UI, and full-stack products with Java and Spring Boot. Explore projects and engineering case studies.",
  path: "/",
});

const Home = () => {
  return (
    <>
      <JsonLd data={profileSchema} />
      <main id="main-content" tabIndex={-1} className={style.page__main}>
        <div className={style.page__container}>
          <Hero />
          <Stats />
          <Grid />
          <Experience />
          <RecentProjects />
          <CaseStudies />
          <EngineeringPlayground />
          <Clients />
        </div>
      </main>
      <div className={style.page__main}>
        <div className={style.page__container}>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
