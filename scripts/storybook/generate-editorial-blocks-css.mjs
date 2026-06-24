import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const srcPath = join(
  root,
  "packages/ui/src/components/_storybook/afenda-docs/afenda-docs-preview.css"
);
const outPath = join(root, "apps/docs/src/app/docs-editorial-blocks.css");

let css = readFileSync(srcPath, "utf8");

css = css
  .replace(
    /\/\*\*[\s\S]*?Copy into apps\/docs[\s\S]*?\*\//,
    "/** Editorial MDX blocks — derived from afenda-docs preview CSS. */"
  )
  .replace(/--docs-preview-/g, "--docs-editorial-block-")
  .replace(
    /var\(--docs-editorial-block-accent\)/g,
    "var(--docs-editorial-prose-accent)"
  )
  .replace(
    /var\(--docs-editorial-block-warning-fg\)/g,
    "var(--docs-editorial-callout-warn)"
  )
  .replace(/var\(--afenda-shadow-sm[^)]*\)/g, "0 1px 2px oklch(0 0 0 / 0.04)")
  .replace(/var\(--afenda-shadow-md[^)]*\)/g, "0 4px 12px oklch(0 0 0 / 0.06)")
  .replace(/var\(--afenda-radius-lg[^)]*\)/g, "0.5rem")
  .replace(/var\(--afenda-radius-xl[^)]*\)/g, "0.75rem")
  .replace(/var\(--afenda-spacing-2[^)]*\)/g, "0.5rem")
  .replace(/var\(--afenda-spacing-3[^)]*\)/g, "0.75rem")
  .replace(/var\(--afenda-spacing-4[^)]*\)/g, "1rem")
  .replace(/var\(--afenda-spacing-6[^)]*\)/g, "1.5rem")
  .replace(/var\(--afenda-spacing-8[^)]*\)/g, "2rem")
  .replace(/var\(--afenda-motion-duration-fast[^)]*\)/g, "150ms")
  .replace(/var\(--afenda-motion-ease-out[^)]*\)/g, "ease-out")
  .replace(
    /var\(--afenda-status-tone-success-foreground\)/g,
    "oklch(0.45 0.12 145)"
  );

const header = `@layer components {
  :where(.nd-page) {
    --docs-editorial-block-canvas: var(--docs-editorial-canvas);
    --docs-editorial-block-paper: var(--docs-editorial-paper);
    --docs-editorial-block-text: var(--docs-editorial-text);
    --docs-editorial-block-text-muted: var(--docs-editorial-text-muted);
    --docs-editorial-block-border: var(--docs-editorial-border);
    --docs-editorial-block-border-subtle: var(--docs-editorial-border-subtle);
    --docs-editorial-block-surface-muted: var(--docs-editorial-surface-muted);
    --docs-editorial-block-surface-hover: var(--docs-editorial-surface-hover);
    --docs-editorial-block-accent: var(--docs-editorial-prose-accent);
    --docs-editorial-block-accent-muted: color-mix(in oklab, var(--docs-editorial-prose-accent) 12%, transparent);
    --docs-editorial-block-success-fg: oklch(0.45 0.12 145);
    --docs-editorial-block-warning-fg: var(--docs-editorial-callout-warn);
    --docs-editorial-block-ring: var(--docs-editorial-ring);
    --docs-editorial-block-shadow-sm: 0 1px 2px oklch(0 0 0 / 0.04);
    --docs-editorial-block-shadow-md: 0 4px 12px oklch(0 0 0 / 0.06);
    --docs-editorial-block-radius-lg: 0.5rem;
    --docs-editorial-block-radius-xl: 0.75rem;
    --docs-editorial-block-space-2: 0.5rem;
    --docs-editorial-block-space-3: 0.75rem;
    --docs-editorial-block-space-4: 1rem;
    --docs-editorial-block-space-6: 1.5rem;
    --docs-editorial-block-space-8: 2rem;
  }
`;

css = css.replace("@layer components {", header);

const extra = `
  .afenda-docs-guide-grid__card {
    display: flex;
    flex-direction: column;
    gap: var(--docs-editorial-block-space-3);
    padding: var(--docs-editorial-block-space-6);
    background-color: var(--docs-editorial-block-paper);
    border: 1px solid var(--docs-editorial-block-border-subtle);
    border-radius: var(--docs-editorial-block-radius-xl);
    box-shadow: var(--docs-editorial-block-shadow-sm);
  }

  .afenda-docs-guide-grid__card-header {
    display: flex;
    flex-direction: column;
    gap: var(--docs-editorial-block-space-2);
  }

  .afenda-docs-guide-grid__card-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  .afenda-docs-guide-grid__card-description {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.55;
    color: var(--docs-editorial-block-text-muted);
  }

  .afenda-docs-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    font-size: 0.6875rem;
    font-weight: 600;
    line-height: 1.4;
    border-radius: var(--docs-editorial-block-radius-lg);
  }

  .afenda-docs-badge[data-tone="info"] {
    color: var(--docs-editorial-prose-accent);
    background-color: var(--docs-editorial-block-accent-muted);
  }

  .afenda-docs-badge[data-tone="success"] {
    color: var(--docs-editorial-block-success-fg);
    background-color: color-mix(
      in oklab,
      var(--docs-editorial-block-success-fg) 12%,
      transparent
    );
  }

  .afenda-docs-accordion-panel__item {
    border-bottom: 1px solid var(--docs-editorial-block-border-subtle);
  }

  .afenda-docs-accordion-panel__item:last-child {
    border-bottom: none;
  }

  .afenda-docs-accordion-panel__trigger {
    display: flex;
    gap: var(--docs-editorial-block-space-3);
    align-items: center;
    width: 100%;
    padding: var(--docs-editorial-block-space-3) var(--docs-editorial-block-space-4);
    font-size: 0.9375rem;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    list-style: none;
    background: transparent;
    border: none;
    transition: background-color 120ms ease;
  }

  .afenda-docs-accordion-panel__trigger::-webkit-details-marker {
    display: none;
  }

  .afenda-docs-accordion-panel__trigger:hover,
  .afenda-docs-accordion-panel__item[open] .afenda-docs-accordion-panel__trigger {
    background-color: color-mix(
      in oklab,
      var(--docs-editorial-prose-accent) 5%,
      transparent
    );
  }

  .afenda-docs-accordion-panel__content {
    padding: 0 var(--docs-editorial-block-space-4) var(--docs-editorial-block-space-4);
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--docs-editorial-block-text-muted);
  }

  .afenda-docs-tabbed-panel__list {
    display: flex;
    gap: var(--docs-editorial-block-space-4);
    padding: 0;
    margin: 0 0 var(--docs-editorial-block-space-4);
    list-style: none;
    border-bottom: 1px solid var(--docs-editorial-block-border-subtle);
  }

  .afenda-docs-tabbed-panel__trigger {
    padding: var(--docs-editorial-block-space-2) 0;
    margin-bottom: -1px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--docs-editorial-block-text-muted);
    cursor: pointer;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
  }

  .afenda-docs-tabbed-panel__trigger[aria-selected="true"] {
    color: var(--docs-editorial-block-text);
    border-bottom-color: var(--docs-editorial-prose-accent);
  }

  .afenda-docs-tabbed-panel__panel {
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--docs-editorial-block-text-muted);
  }

  .afenda-docs-announcement-bar__dismiss {
    flex-shrink: 0;
    padding: 0.25rem 0.625rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--docs-editorial-block-text-muted);
    cursor: pointer;
    background: transparent;
    border: 1px solid var(--docs-editorial-block-border-subtle);
    border-radius: var(--docs-editorial-block-radius-lg);
  }

  .afenda-docs-announcement-bar__dismiss:hover {
    background-color: var(--docs-editorial-block-surface-muted);
  }

  .afenda-docs-announcement-bar__dismiss:focus-visible {
    outline: 2px solid var(--docs-editorial-block-ring);
    outline-offset: 2px;
  }
`;

css = css.replace(/\}\s*$/, `${extra}\n}`);

writeFileSync(outPath, css);
console.log(
  `storybook:generate editorial-blocks-css → ${outPath} (${css.length} bytes)`
);
