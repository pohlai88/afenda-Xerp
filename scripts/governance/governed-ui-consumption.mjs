/**
 * TIP-004 consumer-layer policy — shared by Cursor preToolUse hook and package tests.
 *
 * Governed @afenda/ui primitives validate className at runtime (layout-only).
 * Consumers must use governed props; shell chrome belongs on plain HTML wrappers.
 *
 * Detection strategy
 * ──────────────────
 * Pass 1 — single-line: `<Button className=` on the same line as the open tag.
 * Pass 2 — multiline: className split across lines before the closing `>` / `/>`.
 * Pass 3 — wrapper slop: static className strings with anti-slop violations
 *          (gradients, arbitrary values, raw palette scales).
 * Pass 4 — staging import ban: no #/components/shadcn-studio/primitives from consumers.
 * Pass 5 — studio block className: only .app-shell-* / .app-shell-studio-* (+ sr-only).
 * Pass 6 — Lucide-only icon imports in shadcn-studio/blocks production TSX.
 * Pass 7 — mapStockButtonProps sunset: allowlisted files only (no new usages).
 * Pass 8 — direct studio CSS import ban (TS-side mirror of Gate E R22).
 */
import {
  extractStaticClassNames,
  findConsumerWrapperClassNameSlop,
  tokenizeClassName,
} from "./consumer-class-name-policy.mjs";

/** PascalCase tags exported from @afenda/ui that enforce TIP-004 className policy. */
export const GOVERNED_UI_TAGS = new Set([
  "Accordion",
  "AccordionContent",
  "AccordionItem",
  "AccordionTrigger",
  "Alert",
  "AlertDescription",
  "AlertDialog",
  "AlertDialogAction",
  "AlertDialogCancel",
  "AlertDialogContent",
  "AlertDialogDescription",
  "AlertDialogFooter",
  "AlertDialogHeader",
  "AlertDialogTitle",
  "AlertDialogTrigger",
  "AlertTitle",
  "Avatar",
  "AvatarFallback",
  "AvatarGroup",
  "AvatarGroupCount",
  "AvatarImage",
  "Badge",
  "Breadcrumb",
  "BreadcrumbItem",
  "BreadcrumbLink",
  "BreadcrumbList",
  "BreadcrumbPage",
  "BreadcrumbSeparator",
  "Button",
  "ButtonGroup",
  "Card",
  "CardContent",
  "CardDescription",
  "CardFooter",
  "CardHeader",
  "CardTitle",
  "Checkbox",
  "Collapsible",
  "CollapsibleContent",
  "CollapsibleTrigger",
  "Combobox",
  "ComboboxEmpty",
  "ComboboxGroup",
  "ComboboxInput",
  "ComboboxItem",
  "ComboboxLabel",
  "ComboboxList",
  "ComboboxSeparator",
  "Dialog",
  "DialogContent",
  "DialogDescription",
  "DialogFooter",
  "DialogHeader",
  "DialogTitle",
  "DialogTrigger",
  "DropdownMenu",
  "DropdownMenuCheckboxItem",
  "DropdownMenuContent",
  "DropdownMenuGroup",
  "DropdownMenuItem",
  "DropdownMenuLabel",
  "DropdownMenuRadioGroup",
  "DropdownMenuRadioItem",
  "DropdownMenuSeparator",
  "DropdownMenuSub",
  "DropdownMenuSubContent",
  "DropdownMenuSubTrigger",
  "DropdownMenuTrigger",
  "Empty",
  "Field",
  "FieldDescription",
  "FieldError",
  "FieldGroup",
  "FieldLabel",
  "FieldLegend",
  "FieldSeparator",
  "FieldSet",
  "Input",
  "InputGroup",
  "InputGroupAddon",
  "InputGroupButton",
  "InputGroupInput",
  "InputGroupText",
  "InputGroupTextarea",
  "Kbd",
  "Label",
  "Pagination",
  "PaginationContent",
  "PaginationEllipsis",
  "PaginationItem",
  "PaginationLink",
  "PaginationNext",
  "PaginationPrevious",
  "Popover",
  "PopoverContent",
  "PopoverTrigger",
  "Progress",
  "Select",
  "SelectContent",
  "SelectGroup",
  "SelectItem",
  "SelectLabel",
  "SelectSeparator",
  "SelectTrigger",
  "SelectValue",
  "Separator",
  "Sheet",
  "SheetContent",
  "SheetDescription",
  "SheetFooter",
  "SheetHeader",
  "SheetTitle",
  "SheetTrigger",
  "Sidebar",
  "SidebarContent",
  "SidebarFooter",
  "SidebarGroup",
  "SidebarGroupAction",
  "SidebarGroupContent",
  "SidebarGroupLabel",
  "SidebarHeader",
  "SidebarInput",
  "SidebarInset",
  "SidebarMenu",
  "SidebarMenuAction",
  "SidebarMenuBadge",
  "SidebarMenuButton",
  "SidebarMenuItem",
  "SidebarMenuSkeleton",
  "SidebarMenuSub",
  "SidebarMenuSubButton",
  "SidebarMenuSubItem",
  "SidebarProvider",
  "SidebarRail",
  "SidebarSeparator",
  "SidebarTrigger",
  "Switch",
  "Table",
  "TableBody",
  "TableCaption",
  "TableCell",
  "TableFooter",
  "TableHead",
  "TableHeader",
  "TableRow",
  "Tabs",
  "TabsContent",
  "TabsList",
  "TabsTrigger",
  "Textarea",
  "Toggle",
  "ToggleGroup",
  "ToggleGroupItem",
  "Tooltip",
  "TooltipContent",
  "TooltipTrigger",
]);

const IMPORTS_AFENDA_UI_RE = /\bfrom\s+["']@afenda\/ui(?:\/[^"']*)?["']/;

const GOVERNANCE_REEXPORT_RE =
  /export\s+(?:\{[^}]*\}|\*\s+as\s+\w+)\s+from\s+["']@afenda\/ui\/governance["']/;

const STOCK_PROPS_IMPORT_RE = /\bfrom\s+["'][^"']*stock-props["']/;

const RESOLVE_STOCK_BUTTON_PROPS_RE = /\bresolveStockButtonProps\b/;

const SHADCN_ALIAS_IMPORT_RE =
  /\bfrom\s+["']@\/components\/ui(?:\/[^"']*)?["']/;

const MAP_STOCK_BUTTON_PROPS_USAGE_RE = /\bmapStockButtonProps\b/;

const GOVERNANCE_HELPER_USAGE_RE =
  /\b(?:mapStockButtonProps|mapStockButtonSize|mapStockButtonVisualToGoverned)\b/;

/** Staging primitive / MCP install paths — must not import from consumer packages. */
const STAGING_PRIMITIVE_IMPORT_RE =
  /\bfrom\s+["']#\/components\/shadcn-studio(?:\/[^"']*)?["']/;

const STAGING_PATH_IMPORT_RES = [
  /\bfrom\s+["'][^"']*\/packages\/ui\/src\/components\/shadcn-studio[^"']*["']/,
  /\bfrom\s+["']@afenda\/ui\/src\/components\/shadcn-studio[^"']*["']/,
  /\bfrom\s+["'][^"']*\/shadcn-studio\/primitives[^"']*["']/,
];

const STUDIO_BLOCK_PRODUCTION_PATH =
  /(?:^|[/\\])packages[/\\]appshell[/\\]src[/\\]shadcn-studio[/\\]blocks[/\\][^/\\]+\.tsx$/i;

const CONSUMER_PACKAGE_PATH =
  /(?:^|[/\\])(?:packages[/\\]appshell[/\\]src|packages[/\\]metadata-ui[/\\]src|apps[/\\]erp[/\\]src)[/\\]/i;

/** Allowed utility tokens on studio block wrapper className (a11y). */
const STUDIO_BLOCK_ALLOWED_UTILITY_TOKENS = new Set(["sr-only"]);

/** Allowed class token prefix in studio block production TSX. */
const STUDIO_BLOCK_CLASS_PREFIX_RE = /^app-shell-/;

const BLOCK_FORBIDDEN_ICON_SOURCE_RES = [
  /\bfrom\s+["']react-icons(?:\/[^"']*)?["']/,
  /\bfrom\s+["']@radix-ui\/react-icons(?:\/[^"']*)?["']/,
  /\bfrom\s+["']@heroicons(?:\/[^"']*)?["']/,
  /\bfrom\s+["']@tabler\/icons-react["']/,
];

/** Direct studio CSS import strings — only afenda-appshell.css may reference these. */
const STUDIO_CSS_FORBIDDEN_IMPORT_SUBSTRINGS = [
  "afenda-appshell-studio.css",
  "@afenda/appshell/afenda-appshell-studio",
  "packages/appshell/src/styles/afenda-appshell-studio",
];

const SOLE_STUDIO_CSS_IMPORTER =
  "packages/appshell/src/styles/afenda-appshell.css";

/**
 * Files grandfathered for mapStockButtonProps during sunset.
 * New production files must use governed intent/emphasis/size props directly.
 * @type {ReadonlySet<string>}
 */
export const MAP_STOCK_BUTTON_PROPS_ALLOWLIST = new Set([
  // Empty after migration — Gate D fails any new mapStockButtonProps usage.
]);

const GOVERNANCE_DIRECT_IMPORT_RE =
  /\bimport\s+(?:type\s+)?(?:\{[^}]*\}|\*\s+as\s+\w+)\s+from\s+["']@afenda\/ui\/governance["']/;

const BUTTON_RAW_VARIANT_RE = /<Button(?=[\s/>])[^>]*\bvariant\s*=/;

const BUTTON_STOCK_SIZE_RE =
  /<Button(?=[\s/>])[^>]*\bsize\s*=\s*["'](?:default|icon|icon-xs|icon-sm|icon-lg)["']/;

/**
 * @param {string} content
 * @returns {string[]}
 */
function checkGovernanceImportPolicy(content) {
  const violations = [];

  if (STOCK_PROPS_IMPORT_RE.test(content)) {
    violations.push(
      "Local stock-props import — import mapStockButtonProps from @afenda/ui/governance at call sites"
    );
  }

  if (RESOLVE_STOCK_BUTTON_PROPS_RE.test(content)) {
    violations.push(
      "resolveStockButtonProps — use mapStockButtonProps from @afenda/ui/governance directly"
    );
  }

  if (SHADCN_ALIAS_IMPORT_RE.test(content)) {
    violations.push(
      "@/components/ui import — use @afenda/ui and @afenda/ui/governance instead"
    );
  }

  if (
    GOVERNANCE_HELPER_USAGE_RE.test(content) &&
    !GOVERNANCE_DIRECT_IMPORT_RE.test(content)
  ) {
    violations.push(
      "Governance helper used without direct import from @afenda/ui/governance"
    );
  }

  if (BUTTON_RAW_VARIANT_RE.test(content)) {
    violations.push(
      "<Button variant=…> — use governed Button props: intent, emphasis, size, presentation (not stock shadcn variant strings)"
    );
  }

  if (BUTTON_STOCK_SIZE_RE.test(content)) {
    violations.push(
      '<Button size="icon|icon-*|default"> — use governed Button props: intent, emphasis, size, presentation (not stock shadcn size strings)'
    );
  }

  return violations;
}

/**
 * @param {string} content
 * @returns {string[]}
 */
function checkStagingImportPolicy(content) {
  const violations = [];

  if (STAGING_PRIMITIVE_IMPORT_RE.test(content)) {
    violations.push(
      "Staging primitive import (#/components/shadcn-studio/*) — govern and move to @afenda/appshell production blocks"
    );
  }

  for (const pattern of STAGING_PATH_IMPORT_RES) {
    if (pattern.test(content)) {
      violations.push(
        "Staging shadcn-studio path import — use @afenda/ui and @afenda/appshell production blocks only"
      );
      break;
    }
  }

  return violations;
}

/**
 * @param {string} content
 * @returns {string[]}
 */
export function checkStudioBlockClassNamePolicy(content) {
  const violations = [];

  for (const { value, index } of extractStaticClassNames(content)) {
    const lineNumber = content.slice(0, index).split("\n").length;

    for (const token of tokenizeClassName(value)) {
      if (
        STUDIO_BLOCK_ALLOWED_UTILITY_TOKENS.has(token) ||
        STUDIO_BLOCK_CLASS_PREFIX_RE.test(token)
      ) {
        continue;
      }

      violations.push(
        `line ${lineNumber}: studio block className "${token}" — use .app-shell-* or .app-shell-studio-* semantic classes only (no raw Tailwind utilities)`
      );
    }
  }

  return violations;
}

/**
 * @param {string} content
 * @returns {string[]}
 */
export function checkStudioBlockIconImportPolicy(content) {
  const violations = [];

  for (const pattern of BLOCK_FORBIDDEN_ICON_SOURCE_RES) {
    if (pattern.test(content)) {
      violations.push(
        "Non-Lucide icon import in studio block — use lucide-react icons only"
      );
      break;
    }
  }

  return violations;
}

/**
 * @param {string} content
 * @param {string | undefined} normalizedFilePath
 * @returns {string[]}
 */
function checkMapStockButtonPropsAllowlist(content, normalizedFilePath) {
  if (!MAP_STOCK_BUTTON_PROPS_USAGE_RE.test(content)) {
    return [];
  }

  if (
    normalizedFilePath !== undefined &&
    MAP_STOCK_BUTTON_PROPS_ALLOWLIST.has(normalizedFilePath)
  ) {
    return [];
  }

  return [
    "mapStockButtonProps is sunset — use governed Button props (intent, emphasis, size, presentation) directly; allowlist only for grandfathered files",
  ];
}

/**
 * Gate D pass 8 — reject direct studio CSS imports outside afenda-appshell.css.
 *
 * @param {string} content
 * @param {string | undefined} normalizedFilePath
 * @returns {string[]}
 */
function checkDirectStudioCssImportPolicy(content, normalizedFilePath) {
  if (normalizedFilePath === undefined) {
    return [];
  }
  if (normalizedFilePath === SOLE_STUDIO_CSS_IMPORTER) {
    return [];
  }

  const isConsumerRoot = CONSUMER_PACKAGE_PATH.test(normalizedFilePath);
  const isUiProduction =
    /^packages\/ui\/src\//.test(normalizedFilePath) &&
    !normalizedFilePath.includes("/__tests__/") &&
    !/\.(?:test|spec|stories)\.(?:ts|tsx)$/.test(normalizedFilePath);

  if (!(isConsumerRoot || isUiProduction)) {
    return [];
  }

  const importRe = /\b(?:import|from)\s+["']([^"']+)["']/g;
  const violations = [];

  for (const match of content.matchAll(importRe)) {
    const imp = match[1] ?? "";
    for (const forbidden of STUDIO_CSS_FORBIDDEN_IMPORT_SUBSTRINGS) {
      if (imp.includes(forbidden)) {
        violations.push(
          `Direct studio CSS import forbidden ("${forbidden}") — import @afenda/appshell/afenda-appshell.css only`
        );
        return violations;
      }
    }
  }

  return violations;
}

/**
 * @param {string} content
 * @param {string | undefined} normalizedFilePath  Repo-relative path with forward slashes.
 * @returns {string[]}
 */
export function checkConsumerGateDPolicies(content, normalizedFilePath) {
  const violations = [];

  if (normalizedFilePath === undefined) {
    return violations;
  }

  if (CONSUMER_PACKAGE_PATH.test(normalizedFilePath)) {
    violations.push(...checkStagingImportPolicy(content));
    violations.push(
      ...checkDirectStudioCssImportPolicy(content, normalizedFilePath)
    );
  }

  if (
    /^packages\/ui\/src\//.test(normalizedFilePath) &&
    !normalizedFilePath.includes("/__tests__/") &&
    !/\.(?:test|spec|stories)\.(?:ts|tsx)$/.test(normalizedFilePath)
  ) {
    violations.push(
      ...checkDirectStudioCssImportPolicy(content, normalizedFilePath)
    );
  }

  if (isProductionConsumerSource(normalizedFilePath)) {
    violations.push(
      ...checkMapStockButtonPropsAllowlist(content, normalizedFilePath)
    );
  }

  if (STUDIO_BLOCK_PRODUCTION_PATH.test(normalizedFilePath)) {
    violations.push(...checkStudioBlockClassNamePolicy(content));
    violations.push(...checkStudioBlockIconImportPolicy(content));
  }

  return violations;
}

/**
 * Build a regex that matches an opening JSX tag for any governed component.
 * Anchored to word boundary so "ButtonGroup" doesn't match on "Button".
 */
const GOVERNED_TAG_OPEN_RE = new RegExp(
  `<(${[...GOVERNED_UI_TAGS].join("|")})(?=[\\s/>])`,
  "g"
);

/**
 * In multiline JSX, a single component's props may span several lines:
 *
 *   <Button
 *     variant="ghost"
 *     className="relative"   ← violation — different line from the tag
 *   />
 *
 * Strategy: scan the whole source string. When we find an open governed tag,
 * extract the text from that tag up to the matching > or /> (not crossing into
 * child content), then check for className= in that window.
 */
function findMultilineViolations(content, lines) {
  const violations = [];

  // Map char offset → 1-based line number for friendly error messages.
  const lineStarts = [0];
  for (let i = 0; i < content.length; i += 1) {
    if (content[i] === "\n") {
      lineStarts.push(i + 1);
    }
  }

  function lineNumberAt(offset) {
    let lo = 0;
    let hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStarts[mid] <= offset) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }
    return lo + 1;
  }

  GOVERNED_TAG_OPEN_RE.lastIndex = 0;
  let tagMatch;

  while ((tagMatch = GOVERNED_TAG_OPEN_RE.exec(content)) !== null) {
    const tag = tagMatch[1];
    const tagStart = tagMatch.index;

    // Find the closing > or /> of this element's opening tag.
    // We need to be careful not to run past a nested tag.
    // Simple heuristic: scan forward, tracking string literals so we don't
    // mistake a > inside a string for the closing bracket.
    let pos = tagStart + tagMatch[0].length;
    let inString = null;
    let closedAt = -1;

    while (pos < content.length) {
      const ch = content[pos];

      if (inString) {
        if (ch === inString && content[pos - 1] !== "\\") {
          inString = null;
        }
      } else if (ch === '"' || ch === "'") {
        inString = ch;
      } else if (ch === "`") {
        // Template literal — consume until matching backtick
        inString = "`";
      } else if (ch === "{") {
        // JSX expression — skip balanced braces
        let depth = 1;
        pos += 1;
        while (pos < content.length && depth > 0) {
          if (content[pos] === "{") {
            depth += 1;
          } else if (content[pos] === "}") {
            depth -= 1;
          }
          pos += 1;
        }
        continue;
      } else if (ch === ">") {
        closedAt = pos;
        break;
      } else if (ch === "<" && pos !== tagStart) {
        // Hit a nested tag before closing — stop (malformed / JSX without explicit close)
        break;
      }

      pos += 1;
    }

    if (closedAt === -1) {
      continue;
    }

    const propSlice = content.slice(tagStart + tagMatch[0].length, closedAt);

    if (/\bclassName\s*=/.test(propSlice)) {
      const tagLine = lineNumberAt(tagStart);
      const classNameOffset =
        tagStart + tagMatch[0].length + propSlice.search(/\bclassName\s*=/);
      const classNameLine = lineNumberAt(classNameOffset);

      if (classNameLine !== tagLine) {
        violations.push(
          `line ${classNameLine}: <${tag} className=…> (multiline split from line ${tagLine}) — use governed props only; wrap with plain div/span for shell layout`
        );
      }
      // Static or dynamic single-line cases are caught by the line-by-line pass.
    }
  }

  return violations;
}

/**
 * @param {string} content
 * @param {string | undefined} [normalizedFilePath]  Repo-relative path (forward slashes).
 * @returns {string[]}
 */
export function checkGovernedUiConsumption(content, normalizedFilePath) {
  const violations = [];

  violations.push(...checkConsumerGateDPolicies(content, normalizedFilePath));

  if (!IMPORTS_AFENDA_UI_RE.test(content)) {
    return violations;
  }

  if (GOVERNANCE_REEXPORT_RE.test(content)) {
    violations.push(
      "Re-export barrel from @afenda/ui/governance — import directly at call sites instead"
    );
  }

  if (!GOVERNANCE_DIRECT_IMPORT_RE.test(content)) {
    violations.push(
      "Missing direct import from @afenda/ui/governance — consumer files must import both @afenda/ui and @afenda/ui/governance"
    );
  }

  violations.push(...checkGovernanceImportPolicy(content));

  const lines = content.split("\n");

  // ── Pass 1: single-line detection ──────────────────────────────────────────
  // Catches `<Button className=` on the same line as the open tag.
  const singleLineSeen = new Set();

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    if (!/\bclassName=/.test(line)) {
      continue;
    }

    GOVERNED_TAG_OPEN_RE.lastIndex = 0;
    let tagMatch;
    while ((tagMatch = GOVERNED_TAG_OPEN_RE.exec(line)) !== null) {
      const tag = tagMatch[1];
      const key = `${lineIndex}:${tag}`;
      if (!singleLineSeen.has(key)) {
        singleLineSeen.add(key);
        violations.push(
          `line ${lineIndex + 1}: <${tag} className=…> — use governed props only; wrap with plain div/span for shell layout`
        );
      }
    }
  }

  // ── Pass 2: multiline + dynamic className on governed primitives ─────────────
  for (const v of findMultilineViolations(content, lines)) {
    violations.push(v);
  }

  // ── Pass 3: anti-slop on static wrapper className strings ───────────────────
  for (const v of findConsumerWrapperClassNameSlop(content, lines)) {
    violations.push(v);
  }

  return violations;
}

/** Paths where consumer-layer policy applies. */
export const GOVERNED_UI_CONSUMER_PATH =
  /(?:^|[/\\])(?:packages[/\\]appshell[/\\]src|packages[/\\]metadata-ui[/\\]src|apps[/\\]erp[/\\]src)[/\\].*\.tsx$/i;

/**
 * @param {string} normalizedFilePath
 * @returns {boolean}
 */
function isProductionConsumerSource(normalizedFilePath) {
  if (!CONSUMER_PACKAGE_PATH.test(normalizedFilePath)) {
    return false;
  }
  if (normalizedFilePath.includes("/__tests__/")) {
    return false;
  }
  if (/\.(?:test|interaction\.test)\.tsx$/.test(normalizedFilePath)) {
    return false;
  }
  return true;
}
