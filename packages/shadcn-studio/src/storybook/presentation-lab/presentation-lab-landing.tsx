import {
  PRESENTATION_LAB_THEME_CLASS,
  presentationLabAuthorityDotClassName,
  presentationLabAuthorityPillClassName,
  presentationLabCommandIndexClassName,
  presentationLabCommandItemClassName,
  presentationLabCommandListClassName,
  presentationLabCommandTextClassName,
  presentationLabContainerClassName,
  presentationLabFloatBoxClassName,
  presentationLabFloatBoxHairlineClassName,
  presentationLabFloatBoxTextClassName,
  presentationLabFloatBoxTitleClassName,
  presentationLabFooterClassName,
  presentationLabFooterTextClassName,
  presentationLabGridClassName,
  presentationLabHeroClassName,
  presentationLabKickerClassName,
  presentationLabMainClassName,
  presentationLabProofItemClassName,
  presentationLabProofLabelClassName,
  presentationLabProofStripClassName,
  presentationLabProofValueClassName,
  presentationLabShellClassName,
  presentationLabSubtitleClassName,
  presentationLabSystemTextClassName,
  presentationLabTitleClassName,
  presentationLabTitleGhostClassName,
  presentationLabTitleMilkClassName,
  presentationLabTopbarClassName,
  presentationLabVerticalMarkClassName,
  presentationLabVignetteClassName,
} from "./presentation-lab.contract.js";

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

export function PresentationLabLanding() {
  return (
    <main
      className={`${PRESENTATION_LAB_THEME_CLASS} ${presentationLabShellClassName}`}
    >
      <div aria-hidden className={presentationLabGridClassName} />
      <div aria-hidden className={presentationLabVignetteClassName} />

      <div className={presentationLabContainerClassName}>
        <span className={presentationLabVerticalMarkClassName}>
          local verification surface
        </span>

        <header className={presentationLabTopbarClassName}>
          <p className={presentationLabSystemTextClassName}>
            @afenda/storybook · localhost:6006 · packages/shadcn-studio
          </p>

          <span className={presentationLabAuthorityPillClassName}>
            <span className={presentationLabAuthorityDotClassName} />
            PAS-006 / ADR-0027
          </span>
        </header>

        <section className={presentationLabMainClassName}>
          <div className={presentationLabHeroClassName}>
            <p className={presentationLabKickerClassName}>
              Afenda Shadcn/Studio
            </p>

            <h1 className={presentationLabTitleClassName}>
              <span className={presentationLabTitleGhostClassName}>
                Presentation
              </span>
              <span className={presentationLabTitleMilkClassName}>Lab</span>
            </h1>

            <p className={presentationLabSubtitleClassName}>
              A quiet proving ground for governed enterprise interfaces. Every
              surface is inspected before it reaches ERP: tokens, blocks,
              accessibility, rhythm, and acceptance.
            </p>

            <div
              aria-label="Presentation Lab proof summary"
              className={presentationLabProofStripClassName}
            >
              {proof.map((item) => (
                <article
                  className={presentationLabProofItemClassName}
                  key={item.id}
                >
                  <p className={presentationLabProofValueClassName}>
                    {item.value}
                  </p>
                  <p className={presentationLabProofLabelClassName}>
                    {item.label}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className={presentationLabFloatBoxClassName}>
            <p className={presentationLabKickerClassName}>Operator Sequence</p>

            <div className={presentationLabFloatBoxHairlineClassName} />

            <h2 className={presentationLabFloatBoxTitleClassName}>
              Interface becomes infrastructure only after proof.
            </h2>

            <p className={presentationLabFloatBoxTextClassName}>
              This lab is not decoration. It is the final presentation chamber
              before governed components are allowed into ERP surfaces.
            </p>

            <div className={presentationLabCommandListClassName}>
              {commands.map((command, index) => (
                <div
                  className={presentationLabCommandItemClassName}
                  key={command}
                >
                  <span className={presentationLabCommandIndexClassName}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <code className={presentationLabCommandTextClassName}>
                    {command}
                  </code>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <footer className={presentationLabFooterClassName}>
          <p className={presentationLabFooterTextClassName}>
            not a demo · not decoration · verification before import
          </p>

          <p className={presentationLabFooterTextClassName}>cwd verified</p>
        </footer>
      </div>
    </main>
  );
}
