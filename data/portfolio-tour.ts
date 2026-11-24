export interface TourStop {
  title: string;
  path: string;
  target: string;
  description: string;
}

/** Reading estimate, not a countdown. Only explicit navigation changes the stop. */
export const portfolioTour: readonly TourStop[] = [
  {
    title: "Who I am",
    path: "/",
    target: "identity",
    description:
      "I’m Binit Nayak, a Frontend / Full-Stack Engineer in Hyderabad. I build React and TypeScript interfaces where real-time events, state, and visual feedback work together.",
  },
  {
    title: "Production experience",
    path: "/",
    target: "experience",
    description:
      "At Arrise Solutions, I progressed from intern to SDE I. Explore the impact bullets: shared frontend systems, production gameplay, and ownership beyond individual screens.",
  },
  {
    title: "Plinko: real-time architecture",
    path: "/case-studies/plinko-ui",
    target: "plinko",
    description:
      "Follow a server event through game state, worker synchronization, and the animation scheduler. Play the pipeline to see why timing and presentation are separate responsibilities.",
  },
  {
    title: "Toast: shared architecture",
    path: "/case-studies/toast-messages",
    target: "toast",
    description:
      "One notification subscriber coordinates messages from many features. Try Stack Multiple or Critical Message to see queueing, priority, and interruption without disconnected popup logic.",
  },
  {
    title: "Sneaky: full-stack architecture",
    path: "/projects",
    target: "sneaky",
    description:
      "Trace a React feed request through a Java/Spring Boot API, Redis, and PostgreSQL. Kafka handles analytics asynchronously; recommendation scoring is separate from cache-hit reads.",
  },
  {
    title: "Open-source work",
    path: "/",
    target: "open-source",
    description:
      "Small TypeScript packages turn recurring frontend problems into reusable tools: CSS Module class composition and friendly error messages. Explore their case studies for the implementation decisions.",
  },
  {
    title: "Let’s solve an interesting problem",
    path: "/",
    target: "contact",
    description:
      "I’m open to Frontend, Product, and Full-Stack Engineer opportunities. Email me, copy my address, or connect on LinkedIn. That’s the tour—stay and explore at your own pace.",
  },
];
