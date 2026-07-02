> **Runtime CSS (quarantine):** [swiss-noir.css](./swiss-noir.css) — import after `@afenda/shadcn-studio/shadcn-studio.css`. This markdown file is the editorial spec only; do not import it at runtime.

> **TS mirror:** [afenda-brand.preset.ts](../src/styles/afenda-brand.preset.ts) · **Contract:** [presentation-lab.noir.contract.ts](../src/storybook/presentation-lab/presentation-lab.noir.contract.ts)

## Runtime wiring (authoritative)

Per-story import in Storybook — **not** global `preview.css`:

```tsx
import "../../../packages/shadcn-studio/docs/swiss-noir.css";

parameters: { shadcnStudioPreset: "default", layout: "fullscreen" }
```

Shell class: `dark theme-afenda-brand lab-noir-canvas` (see contract).

**ERP workspace dashboard (Tier A v1 grid):** `Presentation Lab/ERP Workspace Dashboard/Swiss Noir` — [`erp-workspace-dashboard-swiss-noir.stories.tsx`](../../../apps/storybook/stories/erp-workspace-dashboard-swiss-noir.stories.tsx)

---
Yes. Let’s switch mode.

No more “nice dashboard.”
We build it like an **editorial control room**.

## Direction: **Swiss Noir Lab**

Not colorful.
Not playful.
Not Storybook default.
Not SaaS card grid.

The screen should feel like:

> **a private verification chamber for enterprise interfaces.**

---

# 1. Drop-in CSS (historical spec — implemented in `docs/swiss-noir.css`)

Original drop-in path (retired):

```txt
packages/shadcn-studio/docs/swiss-noir.css
```

The block below is the **design reference** that informed the quarantine CSS file. Do not copy `@import tailwindcss` or duplicate `@theme inline` shadcn maps — composition lives in `shadcn-studio.css` only.

```css
@import "tailwindcss";
@import "tw-animate-css";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
}

.theme-afenda-swiss-noir {
  --background: oklch(0.108 0.006 260);
  --foreground: oklch(0.91 0.012 82);

  --card: oklch(0.145 0.008 260);
  --card-foreground: oklch(0.91 0.012 82);

  --muted: oklch(0.19 0.008 260);
  --muted-foreground: oklch(0.64 0.012 82);

  --primary: oklch(0.74 0.08 78);
  --primary-foreground: oklch(0.11 0.006 260);

  --border: oklch(0.31 0.008 260 / 0.62);
  --ring: oklch(0.74 0.08 78);

  --lab-paper: oklch(0.91 0.012 82);
  --lab-paper-soft: oklch(0.74 0.012 82);
  --lab-ink: oklch(0.108 0.006 260);
  --lab-gold: oklch(0.74 0.08 78);
  --lab-blueprint: oklch(0.58 0.07 250);
  --lab-danger: oklch(0.58 0.12 28);
  --lab-line: oklch(0.42 0.008 260 / 0.48);
  --lab-panel: oklch(0.135 0.008 260 / 0.86);
  --lab-glass: oklch(0.18 0.008 260 / 0.42);
  --lab-shadow: 0 40px 120px oklch(0 0 0 / 0.45);
}

@layer base {
  body {
    background: var(--background);
    color: var(--foreground);
    font-feature-settings:
      "kern" 1,
      "liga" 1,
      "calt" 1;
  }

  ::selection {
    background: oklch(0.74 0.08 78 / 0.22);
    color: var(--lab-paper);
  }
}

@layer utilities {
  .lab-noir-canvas {
    position: relative;
    min-height: 100dvh;
    overflow: hidden;
    isolation: isolate;
    background:
      radial-gradient(circle at 78% 14%, oklch(0.36 0.04 78 / 0.16), transparent 31rem),
      radial-gradient(circle at 14% 8%, oklch(0.27 0.035 250 / 0.25), transparent 34rem),
      radial-gradient(circle at 52% 68%, oklch(0.23 0.015 260 / 0.32), transparent 38rem),
      linear-gradient(180deg, oklch(0.13 0.007 260), oklch(0.085 0.006 260));
  }

  .lab-noir-canvas::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -2;
    pointer-events: none;
    background-image:
      linear-gradient(to right, oklch(1 0 0 / 0.035) 1px, transparent 1px),
      linear-gradient(to bottom, oklch(1 0 0 / 0.026) 1px, transparent 1px);
    background-size: 72px 72px;
    mask-image: linear-gradient(to bottom, transparent, black 14%, black 72%, transparent);
  }

  .lab-noir-canvas::after {
    content: "";
    position: absolute;
    inset: -80px;
    z-index: -1;
    pointer-events: none;
    opacity: 0.42;
    background:
      radial-gradient(circle at 30% 20%, oklch(1 0 0 / 0.055), transparent 9rem),
      radial-gradient(circle at 70% 80%, oklch(1 0 0 / 0.035), transparent 12rem);
    filter: blur(18px);
  }

  .lab-noir-title {
    font-family:
      "Helvetica Neue",
      Helvetica,
      Arial,
      ui-sans-serif,
      system-ui,
      sans-serif;
    font-weight: 760;
    letter-spacing: -0.085em;
    line-height: 0.79;
  }

  .lab-noir-serif {
    font-family:
      "Iowan Old Style",
      "Palatino Linotype",
      "Book Antiqua",
      Georgia,
      serif;
  }

  .lab-noir-mono {
    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      "Liberation Mono",
      monospace;
  }

  .lab-noir-panel {
    background:
      linear-gradient(180deg, oklch(1 0 0 / 0.055), transparent 42%),
      var(--lab-panel);
    border: 1px solid var(--lab-line);
    box-shadow: var(--lab-shadow);
    backdrop-filter: blur(20px);
  }

  .lab-noir-hairline {
    background: linear-gradient(
      90deg,
      transparent,
      var(--lab-line),
      transparent
    );
    height: 1px;
  }

  .lab-noir-orb {
    position: absolute;
    right: clamp(2rem, 8vw, 8rem);
    top: clamp(9rem, 20vw, 16rem);
    width: clamp(13rem, 26vw, 25rem);
    aspect-ratio: 1;
    border-radius: 9999px;
    background:
      radial-gradient(circle at 38% 28%, oklch(0.78 0.04 82 / 0.9), transparent 0 16%),
      radial-gradient(circle at 48% 44%, oklch(0.43 0.04 260), oklch(0.16 0.012 260) 58%, oklch(0.07 0.008 260) 100%);
    box-shadow:
      inset -28px -36px 60px oklch(0 0 0 / 0.42),
      inset 18px 14px 40px oklch(1 0 0 / 0.08),
      0 50px 120px oklch(0 0 0 / 0.48);
    opacity: 0.48;
    filter: saturate(0.8);
  }

  .lab-noir-orb::after {
    content: "";
    position: absolute;
    inset: -38%;
    border-radius: inherit;
    background: radial-gradient(circle, oklch(0.58 0.07 250 / 0.16), transparent 58%);
    z-index: -1;
  }

  .lab-noir-vertical-word {
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
}
```

---

# 2. Drop-in contract

Create:

```txt
packages/shadcn-studio/src/_storybook/presentation-lab/presentation-lab.noir.contract.ts
```

```ts
export const PRESENTATION_LAB_NOIR_THEME_CLASS =
  "theme-afenda-swiss-noir" as const;

export const labNoirShellClassName =
  "lab-noir-canvas bg-background text-foreground" as const;

export const labNoirContainerClassName =
  "relative mx-auto grid min-h-dvh w-full max-w-[1440px] grid-rows-[auto_1fr_auto] px-6 py-7 sm:px-10 lg:px-14" as const;

export const labNoirTopbarClassName =
  "grid grid-cols-[1fr_auto] items-center gap-6 border-b border-border/60 pb-5" as const;

export const labNoirSystemLineClassName =
  "lab-noir-mono text-[0.68rem] uppercase tracking-[0.28em] text-muted-foreground" as const;

export const labNoirStatusClassName =
  "inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-3 py-1.5 lab-noir-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground" as const;

export const labNoirMainClassName =
  "relative grid items-center py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16" as const;

export const labNoirHeroClassName =
  "relative z-10 max-w-5xl" as const;

export const labNoirKickerClassName =
  "lab-noir-mono mb-8 text-[0.68rem] uppercase tracking-[0.36em] text-muted-foreground" as const;

export const labNoirTitleClassName =
  "lab-noir-title text-[clamp(5.5rem,15vw,15.5rem)] uppercase text-foreground" as const;

export const labNoirTitleMutedClassName =
  "block text-muted-foreground/35" as const;

export const labNoirTitlePrimaryClassName =
  "block text-foreground" as const;

export const labNoirSubtitleClassName =
  "mt-8 max-w-2xl lab-noir-serif text-xl leading-9 text-muted-foreground sm:text-2xl sm:leading-10" as const;

export const labNoirProofStripClassName =
  "mt-12 grid max-w-4xl grid-cols-3 border-y border-border/60" as const;

export const labNoirProofItemClassName =
  "border-r border-border/60 py-5 pr-5 last:border-r-0" as const;

export const labNoirProofValueClassName =
  "lab-noir-title text-5xl tracking-[-0.08em] text-primary sm:text-6xl" as const;

export const labNoirProofLabelClassName =
  "lab-noir-mono mt-2 text-[0.62rem] uppercase tracking-[0.26em] text-muted-foreground" as const;

export const labNoirSidePanelClassName =
  "lab-noir-panel relative z-10 mt-12 rounded-[2rem] p-6 lg:mt-0" as const;

export const labNoirPanelLabelClassName =
  "lab-noir-mono text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground" as const;

export const labNoirPanelTitleClassName =
  "mt-8 lab-noir-serif text-3xl leading-tight text-foreground" as const;

export const labNoirPanelTextClassName =
  "mt-4 text-sm leading-7 text-muted-foreground" as const;

export const labNoirCommandListClassName =
  "mt-8 grid gap-3" as const;

export const labNoirCommandItemClassName =
  "grid grid-cols-[auto_1fr] gap-3 rounded-2xl border border-border/55 bg-background/35 p-4" as const;

export const labNoirCommandIndexClassName =
  "lab-noir-mono text-[0.62rem] text-primary" as const;

export const labNoirCommandTextClassName =
  "lab-noir-mono text-xs leading-6 text-muted-foreground" as const;

export const labNoirFooterClassName =
  "grid grid-cols-[1fr_auto] items-end gap-6 border-t border-border/60 pt-5" as const;

export const labNoirFooterMarkClassName =
  "lab-noir-mono text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground" as const;

export const labNoirVerticalMarkClassName =
  "lab-noir-vertical-word pointer-events-none absolute left-0 top-1/2 hidden -translate-y-1/2 lab-noir-mono text-[0.62rem] uppercase tracking-[0.34em] text-muted-foreground/45 lg:block" as const;
```

---

# 3. Drop-in TSX

Create:

```txt
packages/shadcn-studio/src/_storybook/presentation-lab/presentation-lab-noir-landing.tsx
```

```tsx
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
} from "./presentation-lab.noir.contract";

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
      <div className="lab-noir-orb" aria-hidden="true" />

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
```

---

# 4. Import CSS (per-story — not preview global)

In the Storybook story file for this lab surface:

```tsx
import "../../../packages/shadcn-studio/docs/swiss-noir.css";
```

Do **not** import in `apps/storybook/.storybook/preview.css` or ERP/developer `globals.css`.

---

# What changed

This is no longer a “theme page.”

It now has:

| Element       | Direction                            |
| ------------- | ------------------------------------ |
| Typography    | brutal Swiss scale                   |
| Color         | almost monochrome                    |
| Mood          | private lab / cinematic control room |
| Cards         | reduced to proof strip               |
| Panel         | one expensive glass instrument       |
| Background    | grid, vignette, orb, atmosphere      |
| Product story | interface becomes infrastructure     |

This is the kind of direction humans respond to because it has **taste, silence, proportion, and tension**.

Now it is starting to look like **Afenda has a point of view**, not just a UI kit.
