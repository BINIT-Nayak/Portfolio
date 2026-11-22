import { cn } from "@/lib/utils";

/** Compatibility wrapper: reveal one readable text block, never stagger individual words. */
export const TextGenerateEffect = ({ words, className }: { words: string; className?: string }) => (
  <div className={cn("font-bold", className)} data-motion="section-reveal">
    {words}
  </div>
);
