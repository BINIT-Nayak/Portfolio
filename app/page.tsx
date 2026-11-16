import { CaseStudies } from "@/components/case-studies/CaseStudies";
import { Clients } from "@/components/client/Clients";
import { Experience } from "@/components/experience/Experience";
import { Footer } from "@/components/footer/Footer";
import { Grid } from "@/components/grid/Grid";
import { Hero } from "@/components/hero/Hero";
import { RecentProjects } from "@/components/project/RecentProjects";
// import { Stats } from "@/components/stats/Stats";

import style from "./page.module.css";

const Home = () => {
  return (
    <main id="main-content" tabIndex={-1} className={style.page__main}>
      <div className={style.page__container}>
        <Hero />
        {/* <Stats /> */}
        <Grid />
        <Experience />
        <RecentProjects />
        <CaseStudies />
        <Clients />
        <Footer />
      </div>
    </main>
  );
};

export default Home;
