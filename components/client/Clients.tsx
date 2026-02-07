"use client";

import { testimonials } from "@/data";
import { InfiniteMovingCards } from "../ui/InfiniteCards/InfiniteCards";

import style from "./Clients.module.css";

export const Clients = () => {
  return (
    <section id="testimonials" className={style.clients}>
      <h1 className={style.clients__heading}>
        Kind words from
        <span className={style.clients__heading__highlight}>
          {" "}
          happy colleague
        </span>
      </h1>

      <div className={style.clients__container}>
        <div className={style.clients__cards_wrapper}>
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
