import assert from "node:assert/strict";
const base = process.env.AUDIT_URL || "http://127.0.0.1:4188";
const site = "https://binit-nayak.netlify.app";
const decode = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
const attributes = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, decode(value)])
  );
async function get(path) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  return response;
}
const robots = await (await get("/robots.txt")).text();
assert.ok(robots.includes(`Sitemap: ${site}/sitemap.xml`));
const xml = await (await get("/sitemap.xml")).text();
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => decode(match[1]));
assert.equal(urls.length, 15);
assert.equal(new Set(urls).size, urls.length);
const titles = new Set(),
  descriptions = new Set();
for (const url of urls) {
  assert.equal(new URL(url).origin, site);
  assert.equal(new URL(url).hash, "");
  assert.equal(new URL(url).search, "");
  const path = new URL(url).pathname;
  const html = await (await get(path)).text();
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
  assert.ok(head, path);
  const metas = [...head.matchAll(/<meta\s[^>]*>/g)].map((match) => attributes(match[0]));
  const value = (name) =>
    metas.find((item) => item.name === name || item.property === name)?.content;
  const links = [...head.matchAll(/<link\s[^>]*>/g)].map((match) => attributes(match[0]));
  const canonical = links.filter((item) => item.rel === "canonical");
  assert.equal(canonical.length, 1, path);
  assert.equal(new URL(canonical[0].href).href, new URL(url).href);
  const title = decode(head.match(/<title>(.*?)<\/title>/)?.[1] || "");
  assert.ok(title && !titles.has(title), `Unique title: ${path}`);
  titles.add(title);
  const description = value("description");
  assert.ok(description && !descriptions.has(description), `Unique description: ${path}`);
  descriptions.add(description);
  assert.equal(new URL(value("og:url")).href, new URL(url).href);
  assert.equal(value("og:title"), title);
  assert.equal(value("og:description"), description);
  assert.equal(value("twitter:title"), title);
  assert.equal(value("twitter:description"), description);
  assert.equal(value("twitter:card"), "summary_large_image");
  assert.equal(value("og:image:width"), "1200");
  assert.equal(value("og:image:height"), "630");
  assert.ok(!value("robots")?.includes("noindex"));
  assert.ok(links.some((item) => item.rel === "icon"));
  assert.ok(links.some((item) => item.rel === "apple-touch-icon"));
  assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, path);
  const graphs = [
    ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
  ].map((match) => JSON.parse(match[1]));
  const entities = graphs.flatMap((graph) => graph["@graph"] || [graph]);
  assert.ok(entities.some((item) => item["@type"] === "Person"));
  if (path.startsWith("/case-studies/") || path.startsWith("/labs/")) {
    assert.equal(value("og:type"), "article");
    assert.ok(entities.some((item) => item["@type"] === "CreativeWork" && item.url === url));
    assert.ok(entities.some((item) => item["@type"] === "BreadcrumbList"));
  }
  if (path === "/projects")
    assert.equal(entities.find((item) => item["@type"] === "ItemList").itemListElement.length, 3);
  console.log(
    `PASS ${path}: canonical, unique metadata, social tags, JSON-LD, server-rendered heading.`
  );
}
for (const [path, width, height] of [
  ["/opengraph-image", 1200, 630],
  ["/apple-icon", 180, 180],
]) {
  const response = await get(path);
  assert.match(response.headers.get("content-type"), /image\/png/);
  const buffer = Buffer.from(await response.arrayBuffer());
  assert.equal(buffer.readUInt32BE(16), width);
  assert.equal(buffer.readUInt32BE(20), height);
}
assert.match(await (await get("/icon.svg")).text(), /<svg/);
assert.equal((await fetch(base + "/case-studies/not-a-real-study")).status, 404);
const index = await (await get("/case-studies")).text();
for (const url of urls.slice(3))
  assert.ok(index.includes(`href="${new URL(url).pathname}"`), `Crawlable link to ${url}`);
console.log(
  "PASS: 15 canonical pages, crawlable study links, 12 unique study destinations, robots, sitemap, image dimensions, icons and unknown-slug 404."
);
