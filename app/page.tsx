"use client";

import { navItems } from "@/data";

import Approach from "@/components/approach/Approach";
import Clients from "@/components/client/Clients";
import Experience from "@/components/experience/Experience";
import Footer from "@/components/footer/Footer";
import Grid from "@/components/grid/Grid";
import Hero from "@/components/hero/Hero";
import RecentProjects from "@/components/project/RecentProjects";
import { FloatingNav } from "@/components/ui/FloatingNavbar";

const Home = () => {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
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
