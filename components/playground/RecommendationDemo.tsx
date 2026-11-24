"use client";
import { useState } from "react";
import { catalog, recommend } from "@/lib/playground.mjs";
import s from "./Playground.module.css";
const stages = ["Candidates", "Scoring", "Diversity", "Optional ML reranking", "Feed"];
export default function RecommendationDemo() {
  const [preference, setPreference] = useState("Footwear");
  const [rerank, setRerank] = useState(false);
  const [step, setStep] = useState(0);
  const result = recommend(preference, rerank);
  const items =
    step === 0
      ? result.candidates
      : step === 1
        ? result.scored
        : step === 2
          ? result.diverse
          : result.feed;
  const explanations = [
    `Candidate generation keeps ${result.candidates.length} available items from a ${catalog.length}-item local catalog; the sold-out item is excluded.`,
    `Score = fixture quality (1–3) + 3 if the category matches ${preference}. Sort descending; break ties by product ID.`,
    "Keep at most two products per category. This prevents the highest-scoring category from taking every feed slot.",
    rerank
      ? "Illustrative reranking orders the retained items by a fixed context score (1–3). This is a transparent stand-in for an optional learned model, not an actual ML inference."
      : "ML reranking is skipped. The diversified order passes through unchanged.",
    "Return the four retained items in order. Reranking changes order, not membership, so the category cap remains intact.",
  ];
  return (
    <>
      <h3>Inspect the decisions behind a feed.</h3>
      <p className={s.note}>
        A deterministic, local catalog makes each stage visible. Change the preferred category and
        compare a diversified feed with optional illustrative reranking.
      </p>
      <div className={s.controls}>
        <label>
          Preferred category{" "}
          <select
            value={preference}
            onChange={(e) => {
              setPreference(e.target.value);
              setStep(0);
            }}
          >
            <option>Footwear</option>
            <option>Outerwear</option>
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={rerank}
            onChange={(e) => {
              setRerank(e.target.checked);
              setStep(0);
            }}
          />
          Enable illustrative reranking
        </label>
      </div>
      <ol className={s.flow}>
        {stages.map((name, i) => (
          <li key={name} aria-current={step === i ? "step" : undefined}>
            {i + 1}. {name}
          </li>
        ))}
      </ol>
      <div className={s.controls}>
        <button className={s.action} disabled={!step} onClick={() => setStep((n) => n - 1)}>
          Previous stage
        </button>
        <button className={s.primary} disabled={step === 4} onClick={() => setStep((n) => n + 1)}>
          Next stage
        </button>
        <button className={s.action} onClick={() => setStep(0)}>
          Restart pipeline
        </button>
      </div>
      <p className={s.status} role="status">
        {explanations[step]}
      </p>
      <ol className={s.results} aria-label={`${stages[step]} output`}>
        {items.map((item) => (
          <li key={item.id}>
            {item.name}
            <small>
              {item.category} · quality {item.quality}
              {"score" in item ? ` · score ${item.score}` : ""}
              {step >= 3 && rerank ? ` · context ${item.context}` : ""}
            </small>
          </li>
        ))}
      </ol>
      <p className={s.note}>
        Fixture scores teach ranking mechanics; they are not conversion rates, user analytics or
        production model outputs. This isolates the candidate → score → diversify → optional rerank
        → feed architecture used in Sneaky.
      </p>
    </>
  );
}
