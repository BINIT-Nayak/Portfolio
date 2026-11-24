"use client";
import { useEffect, useMemo, useState } from "react";
import { createEventBus } from "@/lib/playground.mjs";
import s from "./Playground.module.css";
const names = ["Cart badge", "Activity log", "Notification"];
export default function EventDemo() {
  const bus = useMemo(createEventBus, []);
  const [enabled, setEnabled] = useState([true, true, true]);
  const [received, setReceived] = useState([0, 0, 0]);
  const [sequence, setSequence] = useState(0);
  const [deliveries, setDeliveries] = useState(0);
  const [last, setLast] = useState([0, 0, 0]);
  useEffect(() => {
    const unsubscribe = enabled.map((active, index) =>
      active
        ? bus.subscribe((event: { id: number }) => {
            setReceived((values) => values.map((n, i) => (i === index ? n + 1 : n)));
            setLast((values) => values.map((n, i) => (i === index ? event.id : n)));
          })
        : () => {}
    );
    return () => unsubscribe.forEach((remove) => remove());
  }, [bus, enabled]);
  return (
    <>
      <h3>One event. Independent subscribers.</h3>
      <p className={s.note}>
        Publish a product-added event. Three subscribers update independently through a local
        Pub/Sub bus. Unsubscribe one and publish again: the others keep working.
      </p>
      <div className={s.controls}>
        <button
          className={s.primary}
          onClick={() => {
            const id = sequence + 1;
            setSequence(id);
            setDeliveries(enabled.filter(Boolean).length);
            bus.publish({ id, type: "product:added", productId: "court-01" });
          }}
        >
          Publish product:added
        </button>
        <button
          className={s.action}
          onClick={() => {
            setSequence(0);
            setReceived([0, 0, 0]);
            setLast([0, 0, 0]);
          }}
        >
          Clear event history
        </button>
      </div>
      <p className={s.code}>
        <code>{'publish({ type: "product:added", productId: "court-01" })'}</code>
      </p>
      <div className={s.controls}>
        {names.map((name, i) => (
          <label key={name}>
            <input
              type="checkbox"
              checked={enabled[i]}
              onChange={() => setEnabled((values) => values.map((v, j) => (i === j ? !v : v)))}
            />
            {name} subscribed
          </label>
        ))}
      </div>
      <div className={s.grid}>
        {names.map((name, i) => (
          <div className={s.cell} key={name}>
            <strong>{name}</strong>
            <p>
              {i === 0
                ? `${received[i]} items added`
                : i === 1
                  ? `${received[i]} events recorded`
                  : last[i]
                    ? `Product added · event ${last[i]}`
                    : "No notification yet"}
            </p>
            <small>{enabled[i] ? "Listening" : "Unsubscribed · state retained"}</small>
          </div>
        ))}
      </div>
      <p className={s.status} role="status">
        {sequence
          ? `Event ${sequence} delivered to ${deliveries} subscribers at publish time.`
          : "Ready to publish."}
      </p>
      <p className={s.note}>
        This bus delivers synchronously in memory: there is no replay or durable queue. Rejoining
        does not recover missed events. The publisher knows the event contract, not the subscriber
        components. This mirrors the separation used in shared notification architecture.
      </p>
    </>
  );
}
