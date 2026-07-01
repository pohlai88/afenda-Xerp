import {
  PRESENTATION_LAB_NOIR_THEME_CLASS,
  labNoirCommandIndexClassName,
  labNoirCommandItemClassName,
  labNoirCommandListClassName,
  labNoirCommandTextClassName,
  labNoirContainerClassName,
  labNoirFooterClassName,
  labNoirFooterMarkClassName,
  labNoirHeroClassName,
  labNoirKickerClassName,
  labNoirMainClassName,
  labNoirPanelLabelClassName,
  labNoirPanelTextClassName,
  labNoirPanelTitleClassName,
  labNoirProofItemClassName,
  labNoirProofLabelClassName,
  labNoirProofStripClassName,
  labNoirProofValueClassName,
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
} from "./presentation-lab.noir.contract.js";

const proof = [
  { id: "surfaces", value: "06", label: "Surfaces" },
  { id: "presets", value: "12", label: "Presets" },
  { id: "gates", value: "05", label: "Gates" },
] as const;

const commands = [
  "pnpm storybook:ui",
  "pnpm check:studio-import-zones",
  "pnpm check:studio-primitive-contracts",
] as const;

export function PresentationLabNoirLanding() {
  return (
    <main
      className={`${PRESENTATION_LAB_NOIR_THEME_CLASS} ${labNoirShellClassName}`}
    >
      <div aria-hidden className="lab-noir-orb" />

      <div className={labNoirContainerClassName}>
        <span className={labNoirVerticalMarkClassName}>
          local verification surface
        </span>

        <header className={labNoirTopbarClassName}>
          <p className={labNoirSystemLineClassName}>
            @afenda/storybook · localhost:6006 · packages/shadcn-studio
          </p>

          <span className={labNoirStatusClassName}>
            <span className="size-1.5 rounded-full bg-primary" />
            PAS-006 / ADR-0027
          </span>
        </header>

        <section className={labNoirMainClassName}>
          <div className={labNoirHeroClassName}>
            <p className={labNoirKickerClassName}>Afenda Shadcn/Studio</p>

            <h1 className={labNoirTitleClassName}>
              <span className={labNoirTitleMutedClassName}>Presentation</span>
              <span className={labNoirTitlePrimaryClassName}>Lab</span>
            </h1>

            <p className={labNoirSubtitleClassName}>
              A quiet proving ground for governed enterprise interfaces. Every
              surface is inspected before it reaches ERP: tokens, blocks,
              accessibility, rhythm, and acceptance.
            </p>

            <div
              aria-label="Presentation Lab proof summary"
              className={labNoirProofStripClassName}
            >
              {proof.map((item) => (
                <article className={labNoirProofItemClassName} key={item.id}>
                  <p className={labNoirProofValueClassName}>{item.value}</p>
                  <p className={labNoirProofLabelClassName}>{item.label}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className={labNoirSidePanelClassName}>
            <p className={labNoirPanelLabelClassName}>Operator sequence</p>

            <h2 className={labNoirPanelTitleClassName}>
              Interface becomes infrastructure only after proof.
            </h2>

            <p className={labNoirPanelTextClassName}>
              This lab is not decoration. It is the final presentation chamber
              before governed components are allowed into ERP surfaces.
            </p>

            <div className={labNoirCommandListClassName}>
              {commands.map((command, index) => (
                <div className={labNoirCommandItemClassName} key={command}>
                  <span className={labNoirCommandIndexClassName}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <code className={labNoirCommandTextClassName}>{command}</code>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <footer className={labNoirFooterClassName}>
          <p className={labNoirFooterMarkClassName}>
            not a demo · not decoration · verification before import
          </p>

          <p className={labNoirFooterMarkClassName}>cwd verified</p>
        </footer>
      </div>
    </main>
  );
}
