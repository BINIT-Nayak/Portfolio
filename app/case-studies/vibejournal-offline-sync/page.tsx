import type { Metadata } from "next";
import { caseStudies } from "@/data/case-studies";
import { EngineeringArticle } from "@/components/case-studies/article/EngineeringArticle";

export const metadata: Metadata = {
  title: "VibeJournal — Offline Edits Without Silent Data Loss",
  description:
    "How IndexedDB queues, cross-tab leases, PostgreSQL receipts, and explicit conflict resolution protect VibeJournal edits through interrupted delivery.",
};
export default function OfflineSyncPage() {
  const study = caseStudies.find((item) => item.id === "vibejournal-offline-sync")!;
  return <EngineeringArticle study={study} />;
}
