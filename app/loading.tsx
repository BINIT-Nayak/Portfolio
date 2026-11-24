import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import styles from "./recovery.module.css";

export default function Loading() {
  return (
    <main id="main-content" tabIndex={-1} className={styles.panel}>
      <p role="status">Loading page…</p>
      <div aria-busy="true" aria-label="Page content">
        <Skeleton variant="title" />
        <Skeleton variant="line" />
        <Skeleton variant="media" />
      </div>
    </main>
  );
}
