"use client";
import { useRef, useState } from "react";
import { cacheRequest } from "@/lib/playground.mjs";
import s from "./Playground.module.css";
const database = { "feed:alex": "court-01, jacket-04", "feed:sam": "runner-02, shell-05" };
type Key = keyof typeof database;
type Request = { hit: boolean; value: string; steps: string[] };
export default function CacheDemo() {
  const cache = useRef(new Map<string, string>());
  const [key, setKey] = useState<Key>("feed:alex");
  const [request, setRequest] = useState<Request | null>(null);
  const [step, setStep] = useState(0);
  const [revision, setRevision] = useState(0);
  const busy = !!request && step < request.steps.length - 1;
  const advance = () => {
    if (!request) return;
    const next = step + 1;
    if (request.steps[next] === "Populate cache") {
      cache.current.set(key, request.value);
      setRevision((n) => n + 1);
    }
    setStep(next);
  };
  return (
    <>
      <h3>Read through the cache. Populate on a miss.</h3>
      <p className={s.note}>
        Browser simulation of Redis cache-aside, using an in-memory Map and a fixed database
        fixture. Send a request, step through it, then request the same key again to see a hit.
      </p>
      <div className={s.controls}>
        <label>
          Cache key{" "}
          <select
            disabled={busy}
            value={key}
            onChange={(e) => {
              setKey(e.target.value as Key);
              setRequest(null);
              setStep(0);
            }}
          >
            <option>feed:alex</option>
            <option>feed:sam</option>
          </select>
        </label>
        <button
          className={s.primary}
          disabled={busy}
          onClick={() => {
            setRequest(cacheRequest(cache.current, database, key));
            setStep(0);
          }}
        >
          Send request
        </button>
        <button className={s.action} disabled={!busy} onClick={advance}>
          Next step
        </button>
        <button
          className={s.action}
          disabled={busy || !cache.current.has(key)}
          onClick={() => {
            cache.current.delete(key);
            setRequest(null);
            setRevision(revision + 1);
          }}
        >
          Evict selected key
        </button>
        <button
          className={s.action}
          onClick={() => {
            cache.current.clear();
            setRequest(null);
            setStep(0);
            setRevision((n) => n + 1);
          }}
        >
          Reset cache
        </button>
      </div>
      <ol className={s.flow} aria-label="Request path">
        {(request?.steps ?? ["Request", "Cache lookup", "HIT or MISS"]).map((label, i) => (
          <li key={label} aria-current={request && i === step ? "step" : undefined}>
            {i + 1}. {label}
          </li>
        ))}
      </ol>
      <div className={s.grid}>
        <div className={s.cell}>
          <strong>Cache entry</strong>
          {cache.current.get(key) ?? "Empty"}
        </div>
        <div className={s.cell}>
          <strong>Database fixture</strong>
          {database[key]}
        </div>
        <div className={s.cell}>
          <strong>Response</strong>
          {request && !busy ? request.value : "Not returned yet"}
        </div>
      </div>
      <p className={s.status} role="status">
        {request
          ? `${request.steps[step]}. ${!busy ? (request.hit ? "Cache hit: no database read." : "Miss resolved: the next request can use the populated cache.") : "Use Next step to continue."}`
          : "Cache ready. Send a request to begin."}
      </p>
      <p className={s.note}>
        On a miss, the API reads the database and explicitly writes the result to Redis. A hit
        bypasses that read. Real systems also need TTLs, invalidation and failure handling; this
        walkthrough isolates the read path and does not measure network latency.
      </p>
    </>
  );
}
