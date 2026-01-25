"use client";

import { testimonials } from "@/data";
import { InfiniteMovingCards } from "../ui/InfiniteCards";
import style from "./Clients.module.css";

const Clients = () => {
  return (
    <section id="testimonials" className={style.section}>
      <h1 className="heading">
        Kind words from
        <span className="text-purple"> happy colleague</span>
      </h1>

      <div className={style.container}>
        <div className={style.cardsWrapper}>
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>
      </div>
    </section>
  );
};

export default Clients;
