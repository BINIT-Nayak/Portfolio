import type { CaseStudy } from "@/data/case-studies";
import { projects } from "@/data/projects";
import { absoluteUrl, SITE_NAME, studyPath } from "./seo";

export const personId = absoluteUrl("/#person");
export const identitySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: "Binit Nayak",
      url: absoluteUrl("/"),
      image: absoluteUrl("/assests/myPhoto.jpg"),
      jobTitle: "Frontend / Full Stack Engineer",
      description:
        "Frontend and React engineer building interactive applications and full-stack products.",
      address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
      knowsAbout: [
        "React",
        "TypeScript",
        "Frontend architecture",
        "Real-time interfaces",
        "Java",
        "Spring Boot",
      ],
      sameAs: ["https://github.com/BINIT-Nayak", "https://www.linkedin.com/in/binitnayak2002/"],
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      name: SITE_NAME,
      url: absoluteUrl("/"),
      publisher: { "@id": personId },
      inLanguage: "en",
    },
  ],
};
export const profileSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": absoluteUrl("/#profile"),
  url: absoluteUrl("/"),
  mainEntity: { "@id": personId },
  isPartOf: { "@id": absoluteUrl("/#website") },
};
export const projectsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Software projects by Binit Nayak",
  url: absoluteUrl("/projects"),
  numberOfItems: projects.length,
  itemListElement: projects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "SoftwareApplication",
      "@id": absoluteUrl(`/projects#project-${project.id}`),
      name: project.title,
      description: `${project.subtitle}. ${project.statement}`,
      url: absoluteUrl(`/projects#project-${project.id}`),
      applicationCategory:
        project.id === "sneaky"
          ? "ShoppingApplication"
          : project.id === "snapgram"
            ? "SocialNetworkingApplication"
            : "LifestyleApplication",
      operatingSystem: "Web browser",
      image: absoluteUrl(project.img),
      creator: { "@id": personId },
      featureList: project.capabilities.map((item) => `${item.value}: ${item.label}`),
    },
  })),
};
export function studySchema(study: CaseStudy) {
  const url = absoluteUrl(studyPath(study));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#case-study`,
        name: study.title,
        description: study.summary,
        url,
        mainEntityOfPage: url,
        creator: { "@id": personId },
        inLanguage: "en",
        genre: "Engineering case study",
        about: study.technologies.map((name) => ({ "@type": "Thing", name })),
        image: absoluteUrl("/opengraph-image"),
        isPartOf: { "@id": absoluteUrl("/#website") },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          {
            "@type": "ListItem",
            position: 2,
            name: "Case Studies",
            item: absoluteUrl("/case-studies"),
          },
          { "@type": "ListItem", position: 3, name: study.cardTitle, item: url },
        ],
      },
    ],
  };
}
export function studyListSchema(studies: CaseStudy[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Engineering case studies",
    url: absoluteUrl("/case-studies"),
    numberOfItems: studies.length,
    itemListElement: studies.map((study, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: study.cardTitle,
      url: absoluteUrl(studyPath(study)),
    })),
  };
}
