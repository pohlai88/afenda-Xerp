/**
 * PAS-006 Storybook lab — primitive discovery for colocated vs composition stories.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** First-wave compound primitives — always use compositions. */
export const FIRST_WAVE_COMPLEX_SLUGS = new Set([
  "dialog",
  "sheet",
  "sidebar",
  "command",
  "dropdown-menu",
  "select",
  "sonner",
]);

/** @typedef {"simple" | "complex"} PrimitiveStoryKind */

/**
 * @param {string} slug
 * @returns {string}
 */
export function slugToPascalCase(slug) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * @param {string} slug
 * @returns {string}
 */
export function compositionExportName(slug) {
  return `${slugToPascalCase(slug)}DefaultSample`;
}

/**
 * @param {string} source
 * @returns {number}
 */
export function countValueExports(source) {
  const exportBlock = source.match(/export\s*\{([^}]+)\}/s);
  if (!exportBlock) {
    return 0;
  }

  return exportBlock[1]
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && !part.startsWith("type "))
    .length;
}

/**
 * @param {string} slug
 * @param {string} source
 * @returns {PrimitiveStoryKind}
 */
export function classifyPrimitiveStory(slug, _source) {
  if (FIRST_WAVE_COMPLEX_SLUGS.has(slug)) {
    return "complex";
  }

  return "simple";
}

/**
 * @param {string} slug
 * @returns {string | undefined}
 */
export function specialExportName(slug) {
  const special = {
    sonner: "Toaster",
    "input-otp": "InputOTP",
    chart: "ChartContainer",
    resizable: "ResizablePanelGroup",
    direction: "DirectionProvider",
  };

  return special[slug];
}

/**
 * @param {string} slug
 * @param {string} source
 * @returns {string}
 */
export function resolvePrimaryExportName(slug, source) {
  const special = specialExportName(slug);
  if (special) {
    return special;
  }

  const expected = slugToPascalCase(slug);
  const exportBlock = source.match(/export\s*\{([^}]+)\}/s);

  if (exportBlock) {
    const names = exportBlock[1]
      .split(",")
      .map((part) => part.trim().split(/\s+/).pop())
      .filter((name) => name && !name.startsWith("type"));

    if (names.includes(expected)) {
      return expected;
    }

    if (names.length === 1 && names[0]) {
      return names[0];
    }
  }

  return expected;
}

/**
 * @param {string} governanceRegistrySource
 * @returns {string[]}
 */
export function parseUiPrimitiveSlugs(governanceRegistrySource) {
  const match = governanceRegistrySource.match(
    /UI_PRIMITIVE_CONTRACT_SLUGS\s*=\s*\[([\s\S]*?)\]\s*as const/
  );

  if (!match) {
    throw new Error("UI_PRIMITIVE_CONTRACT_SLUGS not found in governance registry");
  }

  return [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
}

/** @typedef {{ slug: string; kind: PrimitiveStoryKind; exportName: string; hasStory: boolean }} PrimitiveDiscoveryEntry */

/**
 * @param {string} uiRoot
 * @param {string[]} slugs
 * @returns {PrimitiveDiscoveryEntry[]}
 */
export function discoverPrimitiveStories(uiRoot, slugs) {
  /** @type {PrimitiveDiscoveryEntry[]} */
  const entries = [];

  for (const slug of slugs) {
    const componentPath = join(uiRoot, `${slug}.tsx`);
    const storyPath = join(uiRoot, `${slug}.stories.tsx`);

    if (!existsSync(componentPath)) {
      continue;
    }

    const source = readFileSync(componentPath, "utf8");
    const kind = classifyPrimitiveStory(slug, source);
    const exportName = resolvePrimaryExportName(slug, source);

    entries.push({
      slug,
      kind,
      exportName,
      hasStory: existsSync(storyPath),
    });
  }

  return entries;
}

/**
 * @param {string} uiRoot
 * @returns {string[]}
 */
export function listExistingColocatedStories(uiRoot) {
  return readdirSync(uiRoot)
    .filter((name) => name.endsWith(".stories.tsx"))
    .map((name) => name.replace(".stories.tsx", ""));
}

/**
 * @param {string} slug
 * @returns {string | undefined}
 */
export function defaultStoryArgsLiteral(slug) {
  const argsBySlug = {
    button: `{ children: "Button", type: "button" }`,
    badge: `{ children: "Badge" }`,
    input: `{ placeholder: "Text", type: "text" }`,
    label: `{ children: "Label", htmlFor: "lab-label" }`,
    skeleton: `{ className: "h-8 w-48" }`,
    progress: `{ value: 45, className: "w-full max-w-xs" }`,
    checkbox: `{ defaultChecked: true, "aria-label": "Accept terms" }`,
    switch: `{ defaultChecked: true, "aria-label": "Enable notifications" }`,
    textarea: `{ placeholder: "Message", className: "min-h-24 w-full max-w-sm" }`,
    separator: `{ className: "w-48" }`,
    spinner: `{ className: "size-6" }`,
    alert: `{ children: "Studio alert message." }`,
    kbd: `{ children: "⌘K" }`,
    toggle: `{ children: "Toggle", type: "button", "aria-label": "Toggle" }`,
    slider: `{ defaultValue: [40], max: 100, step: 1, className: "w-48" }`,
    "radio-group": `{ defaultValue: "a", className: "flex gap-4" }`,
    "aspect-ratio": `{ ratio: 16 / 9, className: "w-48 overflow-hidden rounded-md bg-muted" }`,
    "category-bar": `{ values: [40, 35, 25] }`,
    "circular-progress": `{ value: 62 }`,
    "number-ticker": `{ value: 1284 }`,
    direction: `{ direction: "ltr", children: "LTR content" }`,
  };

  return argsBySlug[slug];
}

/**
 * @param {string} slug
 * @returns {string | undefined}
 */
export function renderStoryBody(slug, exportName) {
  const renderBySlug = {
    "aspect-ratio": `export const Default: Story = {
  render: (args) => (
    <${exportName} {...args}>
      <div className="flex h-full items-center justify-center text-sm">16:9</div>
    </${exportName}>
  ),
  args: { ratio: 16 / 9, className: "w-48 overflow-hidden rounded-md bg-muted" },
};`,
    chart: `export const Default: Story = {
  render: () => (
    <${exportName} config={{ desktop: { label: "Desktop", color: "var(--primary)" } }} className="h-48 w-full max-w-sm">
      <p className="text-muted-foreground text-sm">Chart container shell — add Recharts children in curated stories.</p>
    </${exportName}>
  ),
};`,
    resizable: `export const Default: Story = {
  args: {},
  render: () => (
    <${exportName} orientation="horizontal" className="min-h-32 w-full max-w-md rounded-lg border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-4 text-sm">Panel A</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-4 text-sm">Panel B</div>
      </ResizablePanel>
    </${exportName}>
  ),
};`,
    card: `export const Default: Story = {
  render: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Studio card</CardTitle>
        <CardDescription>Auto-generated colocated scaffold.</CardDescription>
      </CardHeader>
      <CardContent>Card content region.</CardContent>
    </Card>
  ),
};`,
    empty: `export const Default: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No records</EmptyTitle>
        <EmptyDescription>Auto-generated empty state scaffold.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};`,
    avatar: `export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>AF</AvatarFallback>
    </Avatar>
  ),
};`,
    "input-otp": `export const Default: Story = {
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
};`,
  };

  return renderBySlug[slug];
}
