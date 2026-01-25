"use client";

import { navItems } from "@/data";

import { Approach } from "@/components/approach/Approach";
import { Clients } from "@/components/client/Clients";
import { Experience } from "@/components/experience/Experience";
import { Footer } from "@/components/footer/Footer";
import { Grid } from "@/components/grid/Grid";
import { Hero } from "@/components/hero/Hero";
import { RecentProjects } from "@/components/project/RecentProjects";
import { FloatingNav } from "@/components/ui/FloatingNavbar";

import style from "./page.module.css";

const Home = () => {
  return (
    <main className={style.page__main}>
      <div className={style.page__container}>
        <FloatingNav navItems={navItems} />
        <Hero />
        <Grid />
        <Experience />
        <RecentProjects />
        <Clients />
        <Approach />
        <Footer />
      </div>
    </main>
  );
};

export default Home;
