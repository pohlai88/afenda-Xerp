/**
 * TIP-004 consumer-layer policy — shared by Cursor preToolUse hook and package tests.
 *
 * Governed @afenda/ui primitives validate className at runtime (layout-only).
 * Consumers must use governed props; shell chrome belongs on plain HTML wrappers.
 *
 * Detection strategy
 * ──────────────────
 * Line-by-line scan catches the common case: `<Button className=`.
 * Multiline scan catches split attributes:
 *
 *   <Button
 *     className="..."   ← different line from the open tag
 *   />
 *
 * We do a second pass over the whole source treating consecutive JSX lines as
 * a single logical unit: whenever we encounter an open governed tag we look
 * ahead for a className= that appears before the closing > or />.
 */

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

const GOVERNANCE_HELPER_USAGE_RE =
  /\b(?:mapStockButtonProps|mapStockButtonSize|mapStockButtonVisualToGoverned)\b/;

const GOVERNANCE_DIRECT_IMPORT_RE =
  /\bimport\s+(?:type\s+)?(?:\{[^}]*\}|\*\s+as\s+\w+)\s+from\s+["']@afenda\/ui\/governance["']/;

const BUTTON_RAW_VARIANT_RE = /<Button(?=[\s/>])[^>]*\bvariant\s*=/;

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
      "<Button variant=…> — spread mapStockButtonProps(...) from @afenda/ui/governance instead of raw stock variant strings"
    );
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

    // Only flag if className appears AND it spans multiple source lines.
    if (/\bclassName\s*=/.test(propSlice)) {
      const tagLine = lineNumberAt(tagStart);
      const classNameOffset =
        tagStart + tagMatch[0].length + propSlice.search(/\bclassName\s*=/);
      const classNameLine = lineNumberAt(classNameOffset);

      if (classNameLine !== tagLine) {
        // Multiline split — line-by-line scan would have missed this.
        violations.push(
          `line ${classNameLine}: <${tag} className=…> (multiline split from line ${tagLine}) — use governed props only`
        );
      }
      // Single-line case is already caught by the line-by-line pass.
    }
  }

  return violations;
}

/**
 * @param {string} content
 * @returns {string[]}
 */
export function checkGovernedUiConsumption(content) {
  const violations = [];

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

  // ── Pass 2: multiline detection ─────────────────────────────────────────────
  // Catches `<Button\n  className=` split across lines.
  for (const v of findMultilineViolations(content, lines)) {
    violations.push(v);
  }

  return violations;
}

/** Paths where consumer-layer policy applies. */
export const GOVERNED_UI_CONSUMER_PATH =
  /(?:^|[/\\])(?:packages[/\\]appshell[/\\]src|apps[/\\]erp[/\\]src)[/\\].*\.tsx$/i;
