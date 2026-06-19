import styles from "./app-shell.module.css";
import type { AppShellMainProps } from "./app-shell.types";

export function AppShellMain({
  title,
  description,
  children,
}: AppShellMainProps) {
  return (
    <section aria-labelledby="app-shell-page-title" className={styles.main}>
      <h1 className={styles.pageTitle} id="app-shell-page-title">
        {title}
      </h1>
      <p className={styles.pageDescription}>{description}</p>
      <div className={styles.pageContent}>{children}</div>
    </section>
  );
}
