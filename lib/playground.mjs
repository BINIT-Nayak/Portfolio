export const PRIME_PASSES = 8;
/** An explicit fixed-size batch makes blocking observable without fake timer delays. */
export function runPrimeJob(limit) {
  let count = 0;
  for (let pass = 0; pass < PRIME_PASSES; pass++) count = countPrimes(limit);
  return count;
}

/** Bounded, deterministic workload shared by the UI and a real dedicated worker. */
export function countPrimes(limit) {
  if (!Number.isInteger(limit) || limit < 2 || limit > 2000000) throw new Error("Invalid workload");
  let count = 0;
  for (let n = 2; n <= limit; n++) {
    let prime = true;
    for (let divisor = 2; divisor * divisor <= n; divisor++) {
      if (n % divisor === 0) {
        prime = false;
        break;
      }
    }
    if (prime) count++;
  }
  return count;
}

export function createEventBus() {
  const subscribers = new Set();
  return {
    subscribe(listener) {
      subscribers.add(listener);
      return () => subscribers.delete(listener);
    },
    publish(event) {
      for (const listener of [...subscribers]) listener(event);
    },
  };
}

export function cacheRequest(cache, database, key) {
  if (cache.has(key))
    return {
      hit: true,
      value: cache.get(key),
      steps: ["Request", "Cache lookup", "HIT", "Response"],
    };
  const value = database[key];
  if (value === undefined) throw new Error("Unknown database key");
  return {
    hit: false,
    value,
    steps: ["Request", "Cache lookup", "MISS", "Database read", "Populate cache", "Response"],
  };
}

export const catalog = [
  {
    id: "01",
    name: "Court sneaker",
    category: "Footwear",
    quality: 3,
    context: 1,
    available: true,
  },
  { id: "02", name: "Trail runner", category: "Footwear", quality: 2, context: 3, available: true },
  {
    id: "03",
    name: "Canvas low-top",
    category: "Footwear",
    quality: 1,
    context: 2,
    available: true,
  },
  {
    id: "04",
    name: "Utility jacket",
    category: "Outerwear",
    quality: 3,
    context: 2,
    available: true,
  },
  { id: "05", name: "Rain shell", category: "Outerwear", quality: 2, context: 3, available: true },
  { id: "06", name: "Overshirt", category: "Outerwear", quality: 1, context: 1, available: true },
  {
    id: "07",
    name: "Sold-out trainer",
    category: "Footwear",
    quality: 3,
    context: 3,
    available: false,
  },
];
export function recommend(preference, rerank) {
  const candidates = catalog.filter((item) => item.available);
  const scored = candidates
    .map((item) => ({ ...item, score: item.quality + (item.category === preference ? 3 : 0) }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  const counts = new Map();
  const diverse = scored.filter((item) => {
    const count = counts.get(item.category) ?? 0;
    counts.set(item.category, count + 1);
    return count < 2;
  });
  const feed = rerank
    ? [...diverse].sort(
        (a, b) => b.context - a.context || b.score - a.score || a.id.localeCompare(b.id)
      )
    : diverse;
  return { candidates, scored, diverse, feed };
}
