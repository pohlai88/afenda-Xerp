import type { PublicHomeContent } from "../public-home-content";
import styles from "../public-homepage.module.css";
import { LynxPixelReveal } from "./lynx-pixel-reveal.client";

interface PublicHomeShellProps {
  content: PublicHomeContent;
  initialSkip?: boolean;
}

export const PublicHomeShell = ({
  content,
  initialSkip = false,
}: PublicHomeShellProps) => (
  <div className={styles["shell"]}>
    <main className={styles["main"]} id="public-home-main">
      <LynxPixelReveal content={content} initialSkip={initialSkip} />
    </main>
  </div>
);
