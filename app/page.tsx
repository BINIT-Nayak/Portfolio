import { navItems } from "@/data";

import { Approach } from "@/components/approach/Approach";
import { CaseStudies } from "@/components/case-studies/CaseStudies";
import { Clients } from "@/components/client/Clients";
import { Experience } from "@/components/experience/Experience";
import { Footer } from "@/components/footer/Footer";
import { Grid } from "@/components/grid/Grid";
import { Hero } from "@/components/hero/Hero";
import { RecentProjects } from "@/components/project/RecentProjects";
import { Stats } from "@/components/stats/Stats";
import { FloatingNav } from "@/components/ui/FloatingNavbar/FloatingNavbar";

import style from "./page.module.css";

const Home = () => {
  return (
    <main className={style.page__main}>
      <div className={style.page__container}>
        <FloatingNav navItems={navItems} />
        <Hero />
        <Stats />
        <Grid />
        <Experience />
        <RecentProjects />
        <CaseStudies />
        <Clients />
        <Approach />
        <Footer />
      </div>
    </main>
  );
};

export default Home;
