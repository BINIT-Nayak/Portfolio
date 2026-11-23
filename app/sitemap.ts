import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/case-studies";
import { absoluteUrl, studyPath } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  return Array.from(
    new Set(["/", "/projects", "/case-studies", ...caseStudies.map(studyPath)])
  ).map((path) => ({ url: absoluteUrl(path) }));
}
