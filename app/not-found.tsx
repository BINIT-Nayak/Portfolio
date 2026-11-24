import Link from "next/link";
import styles from "./recovery.module.css";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className={styles.panel}>
      <p>404 · Page not found</p>
      <h1>That page isn’t here.</h1>
      <p>Explore the projects or return to the portfolio.</p>
      <div className={styles.actions}>
        <Link href="/">Back to home</Link>
        <Link href="/projects">View projects</Link>
      </div>
    </main>
  );
}
