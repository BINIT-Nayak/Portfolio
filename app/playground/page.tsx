import { EngineeringPlayground } from "@/components/playground/EngineeringPlayground";
import { Footer } from "@/components/footer/Footer";
import { pageMetadata } from "@/lib/seo";
import s from "../page.module.css";
export const metadata = pageMetadata({
  title: "Engineering Playground",
  description:
    "Explore interactive Web Worker, event-driven UI, Redis cache-aside, animation scheduling and recommendation pipeline experiments by Binit Nayak.",
  path: "/playground",
});
export default function PlaygroundPage() {
  return (
    <>
      <main id="main-content" tabIndex={-1} className={s.page__main}>
        <div className={s.page__container}>
          <EngineeringPlayground standalone />
        </div>
      </main>
      <div className={s.page__main}>
        <div className={s.page__container}>
          <Footer />
        </div>
      </div>
    </>
  );
}
