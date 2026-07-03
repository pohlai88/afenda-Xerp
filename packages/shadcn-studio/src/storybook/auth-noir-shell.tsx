import type { ReactNode } from "react";

import type { EditorialLabPresetId } from "../styles/presentation-lab-presets.registry.js";
import { getPresentationLabPresetEntry } from "../styles/presentation-lab-presets.registry.js";
import {
  labNoirContainerClassName,
  labNoirFooterClassName,
  labNoirFooterMarkClassName,
  labNoirHeroClassName,
  labNoirKickerClassName,
  labNoirMainClassName,
  labNoirShellClassName,
  labNoirSidePanelClassName,
  labNoirStatusClassName,
  labNoirSubtitleClassName,
  labNoirSystemLineClassName,
  labNoirTitleClassName,
  labNoirTitleMutedClassName,
  labNoirTitlePrimaryClassName,
  labNoirTopbarClassName,
  labNoirVerticalMarkClassName,
} from "./presentation-lab/presentation-lab.noir.contract.js";

export interface AuthNoirShellProps {
  readonly children: ReactNode;
  readonly eyebrow: string;
  readonly editorialPresetId?: EditorialLabPresetId;
  readonly statusLabel?: string;
  readonly titleMuted?: string;
  readonly titlePrimary: string;
  readonly subtitle?: string;
  readonly variant?: "split" | "floating-jewel";
}

function resolveNoirShellClass(
  editorialPresetId: EditorialLabPresetId = "afenda-brand"
): string {
  const preset = getPresentationLabPresetEntry(editorialPresetId);
  return `dark ${preset.className} ${labNoirShellClassName}`;
}

export function AuthNoirShell({
  children,
  eyebrow,
  editorialPresetId = "afenda-brand",
  statusLabel = "Access Lane",
  titleMuted = "Sign",
  titlePrimary = "In",
  subtitle = "Governance-first ingress for your operator workspace.",
  variant = "split",
}: AuthNoirShellProps) {
  const shellClass = resolveNoirShellClass(editorialPresetId);

  if (variant === "floating-jewel") {
    return (
      <main className={shellClass}>
        <div aria-hidden className="lab-noir-orb" />
        <div className={`${labNoirContainerClassName} place-items-center`}>
          <span className={labNoirVerticalMarkClassName}>auth ingress lab</span>
          <div className="relative z-10 w-full max-w-md">
            <p className={labNoirKickerClassName}>{eyebrow}</p>
            <div className={`${labNoirSidePanelClassName} p-8`}>{children}</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={shellClass}>
      <div aria-hidden className="lab-noir-orb" />
      <div className={labNoirContainerClassName}>
        <span className={labNoirVerticalMarkClassName}>auth ingress lab</span>

        <header className={labNoirTopbarClassName}>
          <p className={labNoirSystemLineClassName}>
            @afenda/shadcn-studio · auth shell · PAS-006
          </p>
          <span className={labNoirStatusClassName}>
            <span className="size-1.5 rounded-full bg-primary" />
            {statusLabel}
          </span>
        </header>

        <section className={labNoirMainClassName}>
          <div className={labNoirHeroClassName}>
            <p className={labNoirKickerClassName}>{eyebrow}</p>
            <h1 className={labNoirTitleClassName}>
              <span className={labNoirTitleMutedClassName}>{titleMuted}</span>
              <span className={labNoirTitlePrimaryClassName}>{titlePrimary}</span>
            </h1>
            {subtitle ? (
              <p className={labNoirSubtitleClassName}>{subtitle}</p>
            ) : null}
          </div>
          <div
            className={`${labNoirSidePanelClassName} min-w-0 overflow-hidden p-0`}
          >
            {children}
          </div>
        </section>

        <footer className={labNoirFooterClassName}>
          <p className={labNoirFooterMarkClassName}>
            Afenda ERP · governed ingress
          </p>
        </footer>
      </div>
    </main>
  );
}
