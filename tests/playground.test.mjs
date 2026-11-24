import assert from "node:assert/strict";
import test from "node:test";
import {
  runPrimeJob,
  countPrimes,
  createEventBus,
  cacheRequest,
  recommend,
} from "../lib/playground.mjs";

test("the shared computation has known results and rejects unbounded workloads", () => {
  assert.equal(runPrimeJob(100), 25);
  assert.equal(countPrimes(2), 1);
  assert.equal(countPrimes(100), 25);
  assert.equal(countPrimes(1000), 168);
  for (const limit of [-1, 2000001, Infinity, 2.5]) assert.throws(() => countPrimes(limit));
});
test("event subscribers receive only live events and cleanly unsubscribe", () => {
  const bus = createEventBus();
  const a = [],
    b = [];
  const unsubscribe = bus.subscribe((event) => a.push(event));
  bus.subscribe((event) => b.push(event));
  bus.publish(1);
  unsubscribe();
  bus.publish(2);
  assert.deepEqual(a, [1]);
  assert.deepEqual(b, [1, 2]);
  bus.subscribe((event) => a.push(event));
  assert.deepEqual(a, [1]); // Joining does not replay missed events.
  const other = createEventBus();
  other.publish(3);
  assert.deepEqual(b, [1, 2]);
});
test("cache hits bypass the database and misses do not populate before the write step", () => {
  const cache = new Map();
  const database = { feed: "ids" };
  const miss = cacheRequest(cache, database, "feed");
  assert.equal(miss.hit, false);
  assert.equal(cache.size, 0);
  assert.ok(miss.steps.includes("Database read"));
  cache.set("feed", miss.value);
  const hit = cacheRequest(cache, {}, "feed");
  assert.equal(hit.hit, true);
  assert.equal(hit.value, "ids");
  assert.ok(!hit.steps.includes("Database read"));
  cache.delete("feed");
  assert.equal(cacheRequest(cache, database, "feed").hit, false);
  assert.throws(() => cacheRequest(cache, database, "unknown"));
});
test("ranking excludes unavailable items, caps categories and preserves membership on rerank", () => {
  const base = recommend("Footwear", false),
    reranked = recommend("Footwear", true);
  assert.ok(base.candidates.every((item) => item.available));
  assert.equal(base.scored[0].category, "Footwear");
  assert.equal(recommend("Outerwear", false).scored[0].category, "Outerwear");
  assert.equal(base.feed.length, 4);
  for (const category of ["Footwear", "Outerwear"])
    assert.equal(base.feed.filter((item) => item.category === category).length, 2);
  assert.deepEqual(base.feed.map((i) => i.id).sort(), reranked.feed.map((i) => i.id).sort());
  assert.notDeepEqual(
    base.feed.map((i) => i.id),
    reranked.feed.map((i) => i.id)
  );
  assert.deepEqual(base, recommend("Footwear", false));
});
