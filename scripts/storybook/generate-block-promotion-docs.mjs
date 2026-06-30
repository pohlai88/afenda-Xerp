/**
 * Emits PAS-006C promotion checklist MDX pages for each block in the codegen manifest.
 * Regenerate: pnpm storybook generate
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(scriptDir, "../..");
const manifestPath = join(
  repoRoot,
  "packages/shadcn-studio/src/_storybook/block-story-manifest.generated.json"
);
const docsRoot = join(
  repoRoot,
  "packages/shadcn-studio/src/_storybook/docs/blocks"
);
const indexPath = join(
  repoRoot,
  "packages/shadcn-studio/src/_storybook/docs/promotion-index.mdx"
);

const AUTH_ADJACENT_SLUG_PATTERN =
  /login|auth|error-page|verify|mfa|session-expir|access-denied/i;

/** Curated presentation-lab proof overrides (auto blocks with dedicated CSF stories). */
const CURATED_STORY_PROOF_BY_SLUG = {
  "account-settings-01": "Shadcn Studio/Blocks/AccountSettings01InShell",
};

/**
 * @param {string} slug
 * @param {"auto" | "manual"} storyKind
 * @returns {string}
 */
function resolveStoryRef(slug, storyKind) {
  if (Object.hasOwn(CURATED_STORY_PROOF_BY_SLUG, slug)) {
    return CURATED_STORY_PROOF_BY_SLUG[slug];
  }

  const pascal = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  if (storyKind === "auto") {
    return `Shadcn Studio/Blocks Auto/${pascal}`;
  }

  return `Shadcn Studio/Blocks/${pascal} (curated — add to shadcn-studio-blocks.stories.tsx)`;
}

/**
 * @param {string} slug
 * @returns {"auth-adjacent" | "general-operator"}
 */
function resolveBlockClass(slug) {
  return AUTH_ADJACENT_SLUG_PATTERN.test(slug)
    ? "auth-adjacent"
    : "general-operator";
}

/**
 * @param {string} slug
 * @param {"auth-adjacent" | "general-operator"} blockClass
 * @param {string} storyRef
 * @returns {string}
 */
function renderBlockMdx(slug, blockClass, storyRef) {
  const wcagSection =
    blockClass === "auth-adjacent"
      ? `
## WCAG 2.2 AA (auth-adjacent — mandatory)

- [ ] \`pnpm check:studio-auth-surface-wcag-aa\` passes for this surface class
- [ ] Sign-in / MFA / recovery / denial semantics reviewed
`
      : `
## WCAG 2.2 AA

Not required for general operator blocks — ACPA only unless reclassified auth-adjacent.
`;

  return `{/*
  AUTO-GENERATED — do not edit by hand.
  Regenerate: pnpm storybook generate
*/}
import { Meta } from "@storybook/addon-docs/blocks";

<Meta title="Shadcn Studio/Promotion/${slug}" />

# ${slug} — promotion checklist

| Field | Value |
| --- | --- |
| **Block id** | \`${slug}\` |
| **Block class** | ${blockClass} |
| **Storybook proof** | \`${storyRef}\` |
| **Authority** | [PAS-006C](../../../../../docs/PAS/PRESENTATION/PAS-006C-SURFACE-ACCEPTANCE-ACPA-STANDARD.md) |

## Lifecycle (NS §8.2)

\`Imported → Stabilized → Theme-bound → Metadata-bound → Accepted\`

Do not wire to ERP routes until **Accepted** with a sealed Acceptance Record.

## PAS-006C criteria (NS §3.7)

- [ ] **1.** Presentation lab story exists (\`${storyRef}\`)
- [ ] **2.** Keyboard navigation verified (interaction test)
- [ ] **3.** Screen reader labels verified (a11y contract test)
- [ ] **4.** ACPA contrast satisfied — \`pnpm check:studio-block-acpa-acceptance\`
- [ ] **5.** Responsive / density verified (mobile · tablet · desktop viewports)
- [ ] **6.** Empty · loading · error · forbidden story variants (when applicable)
- [ ] **7.** No embedded business logic (static scan + review)
- [ ] **8.** No route-local primitive fork (boundary check)
- [ ] **9.** Metadata contract binding — PAS-006D gate (when applicable)
- [ ] **10.** Auth WCAG AA — see below (when auth-adjacent)

${wcagSection}

## Acceptance Record (seal at promote)

| Field | Value |
| --- | --- |
| \`acceptanceRecordId\` | _(assign at seal)_ |
| \`blockId\` | \`${slug}\` |
| \`presentationLabProof\` | \`${storyRef}\` |
| \`acpaProfileVersion\` | _(from gate output)_ |
| \`wcagAaAuthAdjacent\` | ${blockClass === "auth-adjacent" ? "`true`" : "`false`"} |
| \`sealedAt\` | _(ISO timestamp)_ |

## Gates before seal

\`\`\`bash
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio test:run
pnpm check:studio-block-acpa-acceptance
${blockClass === "auth-adjacent" ? "pnpm check:studio-auth-surface-wcag-aa" : "# auth WCAG gate N/A for general operator class"}
pnpm storybook generate
pnpm --filter @afenda/storybook typecheck
\`\`\`
`;
}

/**
 * @param {Array<{ slug: string; storyKind: "auto" | "manual" }>} blocks
 * @returns {string}
 */
function renderIndexMdx(blocks) {
  const rows = blocks
    .map(({ slug, storyKind }) => {
      const blockClass = resolveBlockClass(slug);
      return `| [${slug}](./blocks/${slug}.mdx) | ${blockClass} | ${storyKind} |`;
    })
    .join("\n");

  return `{/*
  AUTO-GENERATED — do not edit by hand.
  Regenerate: pnpm storybook generate
*/}
import { Meta } from "@storybook/addon-docs/blocks";

<Meta title="Shadcn Studio/Promotion" />

# Block promotion index (PAS-006C)

Checklists for MCP-installed blocks. Regenerated from \`block-story-manifest.generated.json\`.

| Block | Class | Story kind |
| --- | --- | --- |
${rows}

**Doctrine:** Stabilize before customize · seal Acceptance Record before ERP wiring ([PAS-006](../../../../../docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md)).
`;
}

function main() {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

  /** @type {Array<{ slug: string; storyKind: "auto" | "manual" }>} */
  const blocks = [
    ...(manifest.autoStories ?? []).map(
      /** @param {{ slug: string }} entry */ (entry) => ({
        slug: entry.slug,
        storyKind: /** @type {const} */ ("auto"),
      })
    ),
    ...(manifest.manualStoryRequired ?? []).map(
      /** @param {string} slug */ (slug) => ({
        slug,
        storyKind: /** @type {const} */ ("manual"),
      })
    ),
  ].sort((a, b) => a.slug.localeCompare(b.slug));

  rmSync(docsRoot, { recursive: true, force: true });
  mkdirSync(docsRoot, { recursive: true });

  for (const { slug, storyKind } of blocks) {
    const blockClass = resolveBlockClass(slug);
    const storyRef = resolveStoryRef(slug, storyKind);
    writeFileSync(
      join(docsRoot, `${slug}.mdx`),
      renderBlockMdx(slug, blockClass, storyRef),
      "utf8"
    );
  }

  writeFileSync(indexPath, renderIndexMdx(blocks), "utf8");

  console.log(
    `storybook:generate-block-promotion-docs — ${blocks.length} checklist(s) → ${docsRoot}`
  );
}

main();
