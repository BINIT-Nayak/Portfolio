import type { Metadata } from "next";
import type { CaseStudy } from "@/data/case-studies";

/** The public deployment recorded in README. Change here when the domain changes. */
export const SITE_URL = "https://binit-nayak.netlify.app";
export const SITE_NAME = "Binit Nayak — Engineering Portfolio";
export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();
export const studyPath = (study: CaseStudy) => study.detailHref ?? `/case-studies/${study.id}`;

export function pageMetadata({
  title,
  description,
  path,
  article = false,
}: {
  title: string;
  description: string;
  path: string;
  article?: boolean;
}): Metadata {
  const fullTitle = `${title} | Binit Nayak`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: "en_IN",
      type: article ? "article" : "website",
      ...(article ? { authors: [absoluteUrl("/")] } : {}),
      images: [
        {
          url: absoluteUrl("/opengraph-image"),
          width: 1200,
          height: 630,
          alt: "Binit Nayak — Frontend and Full Stack Engineer, Hyderabad",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl("/opengraph-image")],
    },
  };
}
export const studyMetadata = (study: CaseStudy) =>
  pageMetadata({
    title: study.cardTitle,
    description: study.problem,
    path: studyPath(study),
    article: true,
  });
