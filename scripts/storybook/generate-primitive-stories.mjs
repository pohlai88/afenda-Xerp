/**
 * Discovers UI primitives and emits colocated *.stories.tsx scaffolds + manifest.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadPrimitiveEvidenceRegistry } from "../governance/lib/load-primitive-evidence-registry.mjs";
import {
  argTypesImportName,
  argTypesMetaField,
  defaultArgsWithFn,
  requiresArgTypes,
} from "../governance/lib/primitive-args-first-controls.mjs";
import {
  compositionExportName,
  compoundMetaComponent,
  compoundStoryImports,
  defaultStoryArgsLiteral,
  discoverPrimitiveStories,
  parseUiPrimitiveSlugs,
  renderStoryBody,
} from "./lib/discover-primitive-stories.mjs";

const PRIMITIVE_COMPOSITION_SLUGS_RE =
  /PRIMITIVE_COMPOSITION_SLUGS\s*=\s*\[([\s\S]*?)\]\s*as const/;

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(scriptDir, "../..");
const uiRoot = join(repoRoot, "packages/shadcn-studio/src/components-ui");
const governanceRegistryPath = join(
  repoRoot,
  "packages/shadcn-studio/src/meta-gates/_governance.registry.ts"
);
const compositionsPath = join(
  repoRoot,
  "packages/shadcn-studio/src/storybook/primitive-story.compositions.tsx"
);
const manifestPath = join(
  repoRoot,
  "packages/shadcn-studio/src/storybook/primitive-story-manifest.generated.json"
);
const catalogPath = join(
  repoRoot,
  "packages/shadcn-studio/src/storybook/shadcn-studio-primitives-catalog.stories.tsx"
);

const NO_COMPONENT_META_SLUGS = new Set(["chart", "input-otp"]);

/**
 * @param {import("../governance/lib/primitive-args-first-controls.mjs").PrimitiveEvidenceSpec | undefined} spec
 * @returns {string}
 */
function storyMetaTagsLiteral(spec) {
  if (spec?.tier === "gold") {
    return '["autodocs", "lab-smoke", "colocated"]';
  }

  return '["autodocs", "colocated"]';
}

/**
 * @param {import("../governance/lib/primitive-args-first-controls.mjs").PrimitiveEvidenceSpec | undefined} spec
 * @returns {string}
 */
function defaultStoryA11yTagsField(spec) {
  if (spec?.tier === "gold") {
    return `\n  tags: ["a11y-smoke"],`;
  }

  return "";
}

/**
 * @param {import("../governance/lib/primitive-args-first-controls.mjs").PrimitiveEvidenceSpec | undefined} spec
 * @returns {string}
 */
function defaultStoryChromaticField(spec) {
  if (spec?.tier === "gold") {
    return "\n  ...shadcnStudioChromaticSmokeParameters,";
  }

  return "";
}

/**
 * @param {string} slug
 * @param {import("../governance/lib/primitive-args-first-controls.mjs").PrimitiveEvidenceSpec | undefined} spec
 * @returns {string}
 */
function storyMetaParametersField(slug, spec) {
  if (spec?.tier !== "gold") {
    return "";
  }

  return `\n  parameters: {\n    ...shadcnStudioPrimitiveFigmaDesignFromEnv("${slug}"),\n  },`;
}

/**
 * @param {import("./lib/discover-primitive-stories.mjs").PrimitiveDiscoveryEntry} entry
 * @param {import("../governance/lib/primitive-args-first-controls.mjs").PrimitiveEvidenceSpec | undefined} spec
 * @returns {string}
 */
function renderSimpleStoryFile(entry, spec) {
  const renderBody = renderStoryBody(entry.slug, entry.exportName);
  const needsControls = spec !== undefined && requiresArgTypes(spec);
  const argTypesImport = needsControls
    ? argTypesImportName(entry.slug)
    : undefined;
  const compoundImport = compoundStoryImports(entry.slug);
  const extraImports = [];

  if (compoundImport) {
    extraImports.push(compoundImport);
  } else if (entry.slug === "resizable") {
    extraImports.push(
      `import { ${entry.exportName}, ResizableHandle, ResizablePanel } from "./${entry.slug}.js";`
    );
  } else if (entry.slug === "card") {
    extraImports.push(
      `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./${entry.slug}.js";`
    );
  } else if (entry.slug === "empty") {
    extraImports.push(
      `import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./${entry.slug}.js";`
    );
  } else if (entry.slug === "avatar") {
    extraImports.push(
      `import { Avatar, AvatarFallback } from "./${entry.slug}.js";`
    );
  } else if (entry.slug === "input-otp") {
    extraImports.push(
      `import { InputOTP, InputOTPGroup, InputOTPSlot } from "./${entry.slug}.js";`
    );
  } else {
    extraImports.push(
      `import { ${entry.exportName} } from "./${entry.slug}.js";`
    );
  }

  const metaComponent =
    compoundMetaComponent(entry.slug) ??
    (entry.slug === "card"
      ? "Card"
      : entry.slug === "empty"
        ? "Empty"
        : entry.slug === "avatar"
          ? "Avatar"
          : entry.slug === "input-otp"
            ? "InputOTP"
            : entry.exportName);

  const defaultExport =
    renderBody ??
    `export const Default: Story = {${defaultStoryA11yTagsField(spec)}${defaultStoryChromaticField(spec)}
  args: ${needsControls ? defaultArgsWithFn(entry.slug, defaultStoryArgsLiteral(entry.slug) ?? "{}") : (defaultStoryArgsLiteral(entry.slug) ?? "{}")},
};`;

  const metaBlock = NO_COMPONENT_META_SLUGS.has(entry.slug)
    ? `const meta = {
  tags: ${storyMetaTagsLiteral(spec)},${storyMetaParametersField(entry.slug, spec)}
} satisfies Meta;`
    : `const meta = {
  component: ${metaComponent},
  tags: ${storyMetaTagsLiteral(spec)},${needsControls && argTypesImport ? `\n${argTypesMetaField(entry.slug)}` : ""}${storyMetaParametersField(entry.slug, spec)}
} satisfies Meta<typeof ${metaComponent}>;`;

  const chromaticImport =
    spec?.tier === "gold"
      ? `import { shadcnStudioChromaticSmokeParameters, shadcnStudioPrimitiveFigmaDesignFromEnv } from "../storybook/story-parameters.js";\n`
      : "";

  const controlImports =
    needsControls && argTypesImport
      ? `import { fn } from "storybook/test";

import { ${argTypesImport} } from "../storybook/colocated-argtypes.js";
`
      : "";

  return `/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-primitive-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

${chromaticImport}${controlImports}${extraImports.join("\n")}

${metaBlock}

export default meta;
type Story = StoryObj<typeof meta>;

${defaultExport}
`;
}

/**
 * @param {import("./lib/discover-primitive-stories.mjs").PrimitiveDiscoveryEntry} entry
 * @returns {string}
 */
function renderComplexStoryFile(entry) {
  const sampleName = compositionExportName(entry.slug);

  return `/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-primitive-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import { ${sampleName} } from "../storybook/primitive-story.compositions.js";

const meta = {
  component: ${sampleName},
  tags: ["autodocs", "colocated"],
  parameters: {
    docs: {
      description: {
        component:
          "Composition-backed primitive story — fixture in storybook/primitive-story.compositions.tsx.",
      },
    },
  },
} satisfies Meta<typeof ${sampleName}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <${sampleName} />,
};
`;
}

/**
 * @param {import("./lib/discover-primitive-stories.mjs").PrimitiveDiscoveryEntry[]} entries
 * @returns {string}
 */
function renderCatalogStory(entries) {
  const rows = entries
    .map(
      (entry) => `      <li key="${entry.slug}">
        <code>${entry.slug}</code>
        <span className="text-muted-foreground"> — ${entry.kind}${entry.hasStory ? "" : " (pending story)"}</span>
      </li>`
    )
    .join("\n");

  return `/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-primitive-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import {
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
  shadcnStudioStoryA11y,
} from "../lab/index.js";

const meta = {
  title: "Shadcn Studio/Primitives Catalog",
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "Stock shadcn/studio primitives from @afenda/shadcn-studio (MCP seed). Inventory of colocated primitive autodocs — open each component story for controls and prop tables.",
      },
    },
    a11y: shadcnStudioStoryA11y,
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inventory: Story = {
  render: () => (
    <ul className="grid max-w-lg list-none gap-2 p-0 text-sm">
${rows}
    </ul>
  ),
};

export const InventoryDark: Story = {
  ...Inventory,
  globals: shadcnStudioDarkThemeGlobals,
};
`;
}

function readCompositionSlugs(compositionsSource) {
  const match = compositionsSource.match(PRIMITIVE_COMPOSITION_SLUGS_RE);

  if (!match) {
    return [];
  }

  return [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
}

function isAutoGeneratedStory(storyPath) {
  if (!existsSync(storyPath)) {
    return false;
  }

  return readFileSync(storyPath, "utf8").includes(
    "AUTO-GENERATED — do not edit by hand"
  );
}

function main() {
  const governanceSource = readFileSync(governanceRegistryPath, "utf8");
  const compositionsSource = readFileSync(compositionsPath, "utf8");
  const { registry } = loadPrimitiveEvidenceRegistry();
  const specBySlug = new Map(registry.map((spec) => [spec.slug, spec]));
  const slugs = parseUiPrimitiveSlugs(governanceSource);
  const entries = discoverPrimitiveStories(uiRoot, slugs);
  const compositionSlugs = readCompositionSlugs(compositionsSource);

  let generatedCount = 0;
  /** @type {string[]} */
  const generatedSlugs = [];
  /** @type {string[]} */
  const manualCompositionRequired = [];

  for (const entry of entries) {
    const storyPath = join(uiRoot, `${entry.slug}.stories.tsx`);

    if (entry.hasStory && !isAutoGeneratedStory(storyPath)) {
      continue;
    }

    if (entry.kind === "complex") {
      if (!compositionSlugs.includes(entry.slug)) {
        manualCompositionRequired.push(entry.slug);
        continue;
      }

      writeFileSync(
        join(uiRoot, `${entry.slug}.stories.tsx`),
        renderComplexStoryFile(entry),
        "utf8"
      );
      generatedSlugs.push(entry.slug);
      generatedCount += 1;
      continue;
    }

    writeFileSync(
      join(uiRoot, `${entry.slug}.stories.tsx`),
      renderSimpleStoryFile(entry, specBySlug.get(entry.slug)),
      "utf8"
    );
    generatedSlugs.push(entry.slug);
    generatedCount += 1;
  }

  manualCompositionRequired.sort();
  const generatedSlugSet = new Set(generatedSlugs);

  writeFileSync(
    manifestPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        primitiveCount: entries.length,
        generatedStoryCount: generatedCount,
        manualCompositionRequired,
        entries: entries.map(({ slug, kind, exportName, hasStory }) => ({
          slug,
          kind,
          exportName,
          hasStory: hasStory || generatedSlugSet.has(slug),
        })),
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  writeFileSync(
    catalogPath,
    renderCatalogStory(
      entries.map((entry) => ({
        ...entry,
        hasStory: entry.hasStory || generatedSlugSet.has(entry.slug),
      }))
    ),
    "utf8"
  );

  console.log(
    `storybook:generate-primitive-stories — ${generatedCount} new colocated story(ies), ${manualCompositionRequired.length} need compositions → manifest ${manifestPath}`
  );
}

main();
