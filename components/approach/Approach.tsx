import type { ReactNode } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { CanvasRevealEffect } from "../ui/CanvasRevealEffect";

import style from "./Approach.module.css";

const APPROACH_PHASES = [
  {
    title: "Planning & Strategy",
    description:
      "We'll collaborate to map out your website's goals, target audience, and key functionalities. We'll discuss things like site structure, navigation, and content requirements.",
  },
  {
    title: "Development & Progress Update",
    description:
      "Once we agree on the plan, I cue my lofi playlist and dive into coding. From initial sketches to polished code, I keep you updated every step of the way.",
  },
  {
    title: "Development & Launch",
    description:
      "This is where the magic happens! Based on the approved design, I'll translate everything into functional code, building your website from the ground up.",
  },
];

export const Approach = () => {
  return (
    <section className={style.approach}>
      <h1 className={style.approach__heading}>
        My <span className={style.approach__heading__highlight}>approach</span>
      </h1>
      <div className={style.approach__cards_container}>
        <Card
          title={APPROACH_PHASES[0].title}
          icon={<AceternityIcon phaseText="Phase 1" />}
          des={APPROACH_PHASES[0].description}
        >
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName={style.approach__canvas_emerald}
          />
        </Card>
        <Card
          title={APPROACH_PHASES[1].title}
          icon={<AceternityIcon phaseText="Phase 2" />}
          des={APPROACH_PHASES[1].description}
        >
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName={style.approach__canvas_pink}
            colors={[
              [255, 166, 158],
              [221, 255, 247],
            ]}
            dotSize={2}
          />
        </Card>
        <Card
          title={APPROACH_PHASES[2].title}
          icon={<AceternityIcon phaseText="Phase 3" />}
          des={APPROACH_PHASES[2].description}
        >
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName={style.approach__canvas_sky}
            colors={[[125, 211, 252]]}
          />
        </Card>
      </div>
    </section>
  );
};

const Card = ({
  title,
  icon,
  children,
  des,
}: {
  title: string;
  icon: ReactNode;
  children?: ReactNode;
  des: string;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={style.approach__card}
    >
      <Icon
        className={`${style.approach__corner} ${style.approach__corner_top_left}`}
      />
      <Icon
        className={`${style.approach__corner} ${style.approach__corner_bottom_left}`}
      />
      <Icon
        className={`${style.approach__corner} ${style.approach__corner_top_right}`}
      />
      <Icon
        className={`${style.approach__corner} ${style.approach__corner_bottom_right}`}
      />

      <AnimatePresence>
        {hovered ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={style.approach__animation_overlay}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className={style.approach__card_content}>
        <div className={style.approach__icon_wrapper}>{icon}</div>
        <h2 className={style.approach__title}>{title}</h2>
        <p className={style.approach__description}>{des}</p>
      </div>
    </div>
  );
};

const AceternityIcon = ({ phaseText }: { phaseText: string }) => {
  return (
    <div>
      <div className={style.approach__phase_button}>
        <span className={style.approach__phase_button__gradient} />
        <span className={style.approach__phase_button__inner}>{phaseText}</span>
      </div>
    </div>
  );
};

const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
