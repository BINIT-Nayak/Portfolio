import { runPrimeJob } from "@/lib/playground.mjs";

self.onmessage = (event: MessageEvent<number>) => {
  try {
    const start = performance.now();
    const count = runPrimeJob(event.data);
    self.postMessage({ count, duration: performance.now() - start });
  } catch {
    self.postMessage({ error: "The computation could not complete." });
  }
};
