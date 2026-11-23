"use client";

import Link from "next/link";
import { layoutKeyframes, motionSettings } from "@/lib/motion.mjs";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  caseStudies,
  caseStudyFilters,
  type CaseStudy,
  type CaseStudyFilter,
} from "@/data/case-studies";
import { FaArrowRight, FaCalendarDays, FaClock, FaXmark } from "react-icons/fa6";

import style from "./CaseStudies.module.css";
import { PlinkoPipeline } from "./PlinkoPipeline";
import { ToastPlayground } from "./ToastPlayground";

const getCaseStudyById = (id: string) => caseStudies.find((caseStudy) => caseStudy.id === id);

export const CaseStudies = ({ standalone = false }: { standalone?: boolean }) => {
  const Heading = standalone ? "h1" : "h2";
  const CardHeading = standalone ? "h2" : "h3";
  const [filter, setFilter] = useState<CaseStudyFilter>("All");
  const gridRef = useRef<HTMLUListElement>(null);
  const previousPositions = useRef<Map<string, DOMRect> | null>(null);
  const animations = useRef<Animation[]>([]);
  const selectFilter = (next: CaseStudyFilter) => {
    if (next === filter) return;
    const cards = Array.from(gridRef.current?.querySelectorAll<HTMLElement>("[data-study]") ?? []);
    previousPositions.current = new Map(
      cards.map((card) => [card.dataset.study!, card.getBoundingClientRect()])
    );
    animations.current.forEach((animation) => animation.cancel());
    setFilter(next);
  };

  useLayoutEffect(() => {
    const previous = previousPositions.current;
    previousPositions.current = null;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!previous || preference.matches) return;
    const grid = gridRef.current;
    if (!grid) return;
    // Read all geometry before starting compositor-only position/opacity animations.
    const positions = Array.from(grid.querySelectorAll<HTMLElement>("[data-study]")).map(
      (card) => ({ card, rect: card.getBoundingClientRect() })
    );
    const timing = motionSettings(grid);
    const compact = window.matchMedia("(max-width: 767px)").matches;
    animations.current = positions.map(({ card, rect }) =>
      card.animate(layoutKeyframes(previous.get(card.dataset.study!), rect, compact), timing)
    );
    const stop = () => {
      if (preference.matches) animations.current.forEach((animation) => animation.cancel());
    };
    preference.addEventListener("change", stop);
    return () => {
      preference.removeEventListener("change", stop);
      animations.current.forEach((animation) => animation.cancel());
    };
  }, [filter]);
  const filterRef = useRef<HTMLDivElement>(null);
  const visibleStudies = caseStudies.filter(
    (study) => filter === "All" || study.categories.some((category) => category === filter)
  );
  const showOpenSource = () => {
    selectFilter("Open Source");
    filterRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "center",
    });
    filterRef.current
      ?.querySelector<HTMLButtonElement>('[data-filter="Open Source"]')
      ?.focus({ preventScroll: true });
  };
  const [activeCaseStudyId, setActiveCaseStudyId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const activeCaseStudy = useMemo(
    () => caseStudies.find((caseStudy) => caseStudy.id === activeCaseStudyId),
    [activeCaseStudyId]
  );

  useEffect(() => {
    if (!activeCaseStudy) {
      return;
    }

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;
    dialog?.showModal();
    dialog?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveCaseStudyId(null);
      }
      if (event.key === "Tab") {
        const targets = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex="0"]'
          ) ?? []
        ).filter((element) => element.getClientRects().length > 0);
        const first = targets[0];
        const last = targets[targets.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === dialogRef.current)
        ) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [activeCaseStudy]);

  useEffect(() => {
    const handleOpenCaseStudy = (event: Event) => {
      const caseStudyId = (event as CustomEvent<string>).detail;

      if (caseStudyId && getCaseStudyById(caseStudyId)) {
        setActiveCaseStudyId(caseStudyId);
      }
    };

    const linkedStudy = new URLSearchParams(window.location.search).get("case-study");
    if (linkedStudy && getCaseStudyById(linkedStudy)) setActiveCaseStudyId(linkedStudy);

    window.addEventListener("open-case-study", handleOpenCaseStudy);

    return () => {
      window.removeEventListener("open-case-study", handleOpenCaseStudy);
    };
  }, []);

  const renderCard = (caseStudy: CaseStudy) => (
    <li key={caseStudy.id} data-study={caseStudy.id} className={style.caseStudies__item}>
      <article
        className={style.caseStudies__card}
        data-interactive-surface="highlight"
        id={`case-study-${caseStudy.id}`}
      >
        <div className={style.caseStudies__card_body}>
          <div className={style.caseStudies__card_topline}>
            <p className={style.caseStudies__eyebrow}>{caseStudy.categories[0]}</p>
            <span className={style.caseStudies__meta_item}>
              <FaClock aria-hidden="true" />
              {caseStudy.readTime}
            </span>
          </div>
          <CardHeading className={style.caseStudies__title}>
            {caseStudy.detailHref ? (
              <Link href={caseStudy.detailHref} className={style.caseStudies__card_trigger}>
                {caseStudy.cardTitle}
              </Link>
            ) : (
              <button
                type="button"
                className={style.caseStudies__card_trigger}
                onClick={() => setActiveCaseStudyId(caseStudy.id)}
                aria-haspopup="dialog"
              >
                {caseStudy.cardTitle}
              </button>
            )}
          </CardHeading>
          <p className={style.caseStudies__summary}>{caseStudy.problem}</p>
          <ul className={style.caseStudies__tags} aria-label="Main technologies">
            {caseStudy.technologies.map((tag) => (
              <li className={style.caseStudies__tag} key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <span className={style.caseStudies__link} aria-hidden="true">
          {caseStudy.id === "comet-lab" ? "Open interactive lab" : "Explore case study"}{" "}
          <FaArrowRight className={style.caseStudies__link_icon} />
        </span>
      </article>
    </li>
  );

  return (
    <>
      <section className={style.caseStudies} id="case-studies">
        <div className={style.caseStudies__header} data-motion="section-reveal">
          <Heading className={style.caseStudies__heading}>
            Engineering <span className={style.caseStudies__heading_highlight}>Case Studies</span>
          </Heading>
          <p className={style.caseStudies__intro}>
            A deeper look into real production and full-stack problems I worked on.
          </p>
        </div>

        <div
          className={style.caseStudies__filters}
          ref={filterRef}
          role="group"
          aria-label="Filter case studies by engineering discipline"
        >
          {caseStudyFilters.map((category) => (
            <button
              key={category}
              type="button"
              className={style.caseStudies__filter}
              data-filter={category}
              aria-pressed={filter === category}
              aria-controls="case-study-results"
              onClick={() => selectFilter(category)}
            >
              {category}
              <span aria-hidden="true">
                {category === "All"
                  ? caseStudies.length
                  : caseStudies.filter((study) =>
                      study.categories.some((value) => value === category)
                    ).length}
              </span>
            </button>
          ))}
        </div>
        <p
          className={style.caseStudies__result_count}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {visibleStudies.length} case {visibleStudies.length === 1 ? "study" : "studies"} ·{" "}
          {filter}
        </p>
        <ul
          ref={gridRef}
          className={style.caseStudies__grid}
          id="case-study-results"
          aria-label={`${filter} case studies`}
        >
          {visibleStudies.map(renderCard)}
        </ul>
      </section>
      <section
        className={style.caseStudies__open_source}
        id="open-source"
        aria-labelledby="open-source-title"
      >
        <div>
          <h2 className={style.caseStudies__heading} id="open-source-title">
            Open Source
          </h2>
          <p className={style.caseStudies__intro}>
            Small, focused TypeScript packages for CSS Module composition and friendly error
            handling.
          </p>
        </div>
        <button type="button" className={style.caseStudies__detail_link} onClick={showOpenSource}>
          Explore open-source case studies <FaArrowRight aria-hidden="true" />
        </button>
      </section>

      {activeCaseStudy && (
        <dialog
          ref={dialogRef}
          tabIndex={-1}
          aria-labelledby="case-study-modal-title"
          className={style.caseStudies__modal_overlay}
          onCancel={(event) => {
            event.preventDefault();
            setActiveCaseStudyId(null);
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveCaseStudyId(null);
          }}
        >
          <article
            data-motion-enter="scale-in"
            className={style.caseStudies__modal}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className={style.caseStudies__modal_close}
              type="button"
              onClick={() => setActiveCaseStudyId(null)}
              aria-label="Close case study"
            >
              <FaXmark aria-hidden="true" />
            </button>

            <div className={style.caseStudies__modal_header}>
              <p className={style.caseStudies__modal_eyebrow}>Engineering Case Study</p>
              <div className={style.caseStudies__modal_meta}>
                <span className={style.caseStudies__meta_item}>
                  <FaCalendarDays aria-hidden="true" />
                  {activeCaseStudy.date}
                </span>
                <span className={style.caseStudies__meta_item}>
                  <FaClock aria-hidden="true" />
                  {activeCaseStudy.readTime}
                </span>
              </div>
              <h2 className={style.caseStudies__modal_title} id="case-study-modal-title">
                {activeCaseStudy.title}
              </h2>
              <p className={style.caseStudies__modal_summary}>{activeCaseStudy.summary}</p>
              <div className={style.caseStudies__modal_tags}>
                {activeCaseStudy.tags.map((tag) => (
                  <span className={style.caseStudies__tag} key={tag}>
                    {tag}
                  </span>
                ))}
              </div>

              {activeCaseStudy.externalLinks && (
                <div className={style.caseStudies__modal_actions}>
                  {activeCaseStudy.externalLinks.map((link) => (
                    <Link
                      className={style.caseStudies__detail_link}
                      href={link.href}
                      key={link.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {link.label}
                      <FaArrowRight className={style.caseStudies__link_icon} />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {activeCaseStudy.id === "plinko-ui" && <PlinkoPipeline />}
            {activeCaseStudy.id === "toast-messages" && <ToastPlayground />}

            <div className={style.caseStudies__modal_body}>
              <div className={style.caseStudies__modal_panel}>
                <p className={style.caseStudies__modal_label}>Context</p>
                <p className={style.caseStudies__modal_text}>{activeCaseStudy.description}</p>
              </div>

              <div className={style.caseStudies__modal_panel}>
                <p className={style.caseStudies__modal_label}>My Role</p>
                <p className={style.caseStudies__modal_text}>{activeCaseStudy.role}</p>
              </div>

              <div className={style.caseStudies__modal_panel}>
                <p className={style.caseStudies__modal_label}>Outcome</p>
                <p className={style.caseStudies__modal_text}>{activeCaseStudy.outcome}</p>
              </div>
            </div>

            {activeCaseStudy.metrics && (
              <div className={style.caseStudies__metric_grid}>
                {activeCaseStudy.metrics.map((metric) => (
                  <div className={style.caseStudies__metric} key={metric.label}>
                    <p className={style.caseStudies__metric_value}>{metric.value}</p>
                    <p className={style.caseStudies__metric_label}>{metric.label}</p>
                    <p className={style.caseStudies__metric_detail}>{metric.detail}</p>
                  </div>
                ))}
              </div>
            )}

            {activeCaseStudy.architecture && (
              <div className={style.caseStudies__modal_details}>
                <p className={style.caseStudies__modal_label}>Architecture</p>
                <ul className={style.caseStudies__detail_list}>
                  {activeCaseStudy.architecture.map((detail) => (
                    <li className={style.caseStudies__detail_item} key={detail}>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeCaseStudy.challengesSolved && (
              <div className={style.caseStudies__modal_details}>
                <p className={style.caseStudies__modal_label}>Challenges Solved</p>
                <ul className={style.caseStudies__detail_list}>
                  {activeCaseStudy.challengesSolved.map((detail) => (
                    <li className={style.caseStudies__detail_item} key={detail}>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={style.caseStudies__modal_details}>
              <p className={style.caseStudies__modal_label}>Key Work</p>
              <ul className={style.caseStudies__detail_list}>
                {activeCaseStudy.details.map((detail) => (
                  <li className={style.caseStudies__detail_item} key={detail}>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {activeCaseStudy.detailHref && (
              <div className={style.caseStudies__modal_actions}>
                <Link className={style.caseStudies__detail_link} href={activeCaseStudy.detailHref}>
                  Read in Detail
                  <FaArrowRight className={style.caseStudies__link_icon} />
                </Link>
              </div>
            )}
          </article>
        </dialog>
      )}
    </>
  );
};
