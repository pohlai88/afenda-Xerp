import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import type { ApplicationShellResolvedChrome } from "./app-shell.types";
import { joinAppShellGovernedClassName } from "./wiring/governance";

/**
 * Social icon primitives (FacebookIcon, InstagramIcon, etc.) are not in
 * GOVERNED_UI_TAGS — no className restriction applies. The governance import
 * satisfies the Governed UI consumer-layer policy for all @afenda/ui consumers.
 */
export type AppShellFooterGovernedComponents = Extract<
  GovernedUiComponentName,
  never
>;

interface AppShellFooterProps {
  readonly chrome: ApplicationShellResolvedChrome;
}

export function AppShellFooter({ chrome }: AppShellFooterProps) {
  return (
    <footer
      className={joinAppShellGovernedClassName(
        "app-shell-footer",
        "utility-bar",
        { density: chrome.density }
      )}
    >
      <div className="app-shell-footer-inner">
        <p className="app-shell-footer-copy">
          {`©${new Date().getFullYear()}`}{" "}
          {chrome.footerBrand === "" ? null : (
            <a
              className="app-shell-footer-brand-link"
              href={chrome.footerBrandHref}
            >
              {chrome.footerBrand}
            </a>
          )}
          . All rights reserved.
        </p>
        <div className="app-shell-footer-social">
          <a
            aria-label="Facebook"
            className="app-shell-footer-social-link"
            href="#"
          >
            <FacebookIcon className="app-shell-footer-social-icon" />
          </a>
          <a
            aria-label="Instagram"
            className="app-shell-footer-social-link"
            href="#"
          >
            <InstagramIcon className="app-shell-footer-social-icon" />
          </a>
          <a
            aria-label="LinkedIn"
            className="app-shell-footer-social-link"
            href="#"
          >
            <LinkedinIcon className="app-shell-footer-social-icon" />
          </a>
          <a
            aria-label="Twitter"
            className="app-shell-footer-social-link"
            href="#"
          >
            <TwitterIcon className="app-shell-footer-social-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
}
