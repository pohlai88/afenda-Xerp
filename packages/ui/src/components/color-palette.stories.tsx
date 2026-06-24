/**
 * Afenda ERP v2 enterprise design token catalog.
 *
 * Visualises generated tokens from token.registry.ts via afenda-design-system.css.
 * Swatches read live CSS variables — no hardcoded colors. Theme toolbar = light/dark.
 *
 * Layer legend:
 *   raw    — literal OKLCH in :root / .dark (--afenda-color-*, --afenda-state-*)
 *   alias  — semantic references via var() (table, form-field, etc.)
 *   bridge — shadcn-compatible aliases (--primary, --chart-1, …)
 *
 * See: apps/storybook/.storybook/preview.css — loads the app globals.css (which includes `@afenda/ui/afenda-ui.css`).
 */
import type { Meta, StoryObj } from "@storybook/react";
import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

// ─── Token model ─────────────────────────────────────────────────────────────

type TokenLayer = "raw" | "alias" | "bridge";

type TokenItem = {
  readonly token: string;
  readonly label: string;
  readonly layer: TokenLayer;
};

type TokenGroup = {
  readonly title: string;
  readonly note?: string;
  readonly category: PaletteCategory;
  readonly items: readonly TokenItem[];
};

type PaletteCategory =
  | "core"
  | "status"
  | "charts"
  | "acpa"
  | "bridge"
  | "semantic"
  | "scale";

const raw = (token: string, label: string): TokenItem => ({
  token,
  label,
  layer: "raw",
});
const alias = (token: string, label: string): TokenItem => ({
  token,
  label,
  layer: "alias",
});
const bridge = (token: string, label: string): TokenItem => ({
  token,
  label,
  layer: "bridge",
});

const PALETTE_STATUS_TONES = [
  "neutral",
  "info",
  "success",
  "warning",
  "danger",
  "forbidden",
  "invalid",
] as const;

const statusItems: readonly TokenItem[] = PALETTE_STATUS_TONES.flatMap(
  (tone) => [
    raw(`--afenda-status-tone-${tone}-surface`, `${tone} · surface`),
    raw(`--afenda-status-tone-${tone}-foreground`, `${tone} · fg`),
    raw(`--afenda-status-tone-${tone}-border`, `${tone} · border`),
    raw(`--afenda-status-tone-${tone}-focus`, `${tone} · focus`),
    raw(`--afenda-status-tone-${tone}-solid`, `${tone} · solid`),
    raw(`--afenda-status-tone-${tone}-solid-foreground`, `${tone} · solid fg`),
  ]
);

const ALL_GROUPS: readonly TokenGroup[] = [
  {
    title: "Surfaces",
    category: "core",
    note: "Warm off-white canvas (light) · deep blue-slate canvas (dark). Elevation: sunken → canvas → card → raised.",
    items: [
      raw("--afenda-color-surface-canvas", "canvas"),
      raw("--afenda-color-surface-sunken", "sunken"),
      raw("--afenda-color-surface-card", "card"),
      raw("--afenda-color-surface-raised", "raised"),
      raw("--afenda-color-surface-muted", "muted"),
      raw("--afenda-color-surface-popover", "popover"),
      raw("--afenda-color-surface-header", "header"),
      raw("--afenda-color-surface-hover", "hover"),
      raw("--afenda-color-surface-selected", "selected"),
      raw("--afenda-color-surface-inverse", "inverse"),
      raw("--afenda-color-surface-overlay", "overlay / scrim"),
    ],
  },
  {
    title: "Text",
    category: "core",
    note: "Deep ink default (light) · warm near-white (dark). Descending prominence ladder.",
    items: [
      raw("--afenda-color-text-default", "default"),
      raw("--afenda-color-text-muted", "muted"),
      raw("--afenda-color-text-subtle", "subtle"),
      raw("--afenda-color-text-placeholder", "placeholder"),
      raw("--afenda-color-text-inverse", "inverse"),
      raw("--afenda-color-text-disabled", "disabled"),
      raw("--afenda-color-text-link", "link · sapphire"),
    ],
  },
  {
    title: "Brand & action",
    category: "core",
    note: "Deep Sapphire primary · cool blue-slate secondary · forest green accent.",
    items: [
      raw("--afenda-color-primary", "primary · sapphire"),
      raw("--afenda-color-primary-foreground", "primary fg"),
      raw("--afenda-color-primary-hover", "primary hover"),
      raw("--afenda-color-primary-active", "primary active"),
      raw("--afenda-color-primary-subtle", "primary subtle"),
      raw("--afenda-color-primary-subtle-foreground", "primary subtle fg"),
      raw("--afenda-color-secondary", "secondary"),
      raw("--afenda-color-secondary-foreground", "secondary fg"),
      raw("--afenda-color-accent", "accent · forest"),
      raw("--afenda-color-accent-foreground", "accent fg"),
      raw("--afenda-color-destructive", "destructive · risk red"),
      raw("--afenda-color-destructive-foreground", "destructive fg"),
      raw("--afenda-color-destructive-hover", "destructive hover"),
      raw("--afenda-color-destructive-active", "destructive active"),
    ],
  },
  {
    title: "Border & chrome",
    category: "core",
    items: [
      raw("--afenda-color-border-default", "border default"),
      raw("--afenda-color-border-muted", "border muted"),
      raw("--afenda-color-border-strong", "border strong"),
      raw("--afenda-color-border-focus", "border focus"),
      raw("--afenda-color-input", "input border"),
      raw("--afenda-color-focus-ring", "focus ring"),
    ],
  },
  {
    title: "Sidebar",
    category: "core",
    note: "Cool blue-tint (light) · deeper than canvas (dark) for depth perception.",
    items: [
      raw("--afenda-color-sidebar-background", "background"),
      raw("--afenda-color-sidebar-foreground", "foreground"),
      raw("--afenda-color-sidebar-primary", "primary"),
      raw("--afenda-color-sidebar-primary-foreground", "primary fg"),
      raw("--afenda-color-sidebar-accent", "accent"),
      raw("--afenda-color-sidebar-accent-foreground", "accent fg"),
      raw("--afenda-color-sidebar-border", "border"),
      raw("--afenda-color-sidebar-ring", "ring"),
    ],
  },
  {
    title: "Status tones",
    category: "status",
    note: "7 governed tones · each with surface / fg / border / focus / solid / solid-fg.",
    items: statusItems,
  },
  {
    title: "ERP operational states",
    category: "status",
    note: "readonly · disabled · degraded · maintenance · offline · skeleton.",
    items: [
      raw("--afenda-state-readonly-surface", "readonly surface"),
      raw("--afenda-state-readonly-foreground", "readonly fg"),
      raw("--afenda-state-readonly-border", "readonly border"),
      raw("--afenda-state-disabled-surface", "disabled surface"),
      raw("--afenda-state-disabled-foreground", "disabled fg"),
      raw("--afenda-state-degraded-surface", "degraded surface"),
      raw("--afenda-state-degraded-foreground", "degraded fg"),
      raw("--afenda-state-degraded-border", "degraded border"),
      raw("--afenda-state-maintenance-surface", "maintenance surface"),
      raw("--afenda-state-maintenance-foreground", "maintenance fg"),
      raw("--afenda-state-maintenance-border", "maintenance border"),
      raw("--afenda-state-offline-surface", "offline surface"),
      raw("--afenda-state-offline-foreground", "offline fg"),
      raw("--afenda-state-skeleton-base", "skeleton base"),
      raw("--afenda-state-skeleton-highlight", "skeleton highlight"),
    ],
  },
  {
    title: "Multi-tenant context",
    category: "status",
    note: "Context banner chrome — overridable per tenant.",
    items: [
      raw("--afenda-tenant-context-surface", "context surface"),
      raw("--afenda-tenant-context-foreground", "context fg"),
      raw("--afenda-tenant-context-border", "context border"),
      raw("--afenda-tenant-context-accent", "context accent"),
    ],
  },
  {
    title: "Charts — categorical",
    category: "charts",
    note: "Board-safe enterprise palette · 8 distinct series.",
    items: [
      raw("--afenda-color-chart-1", "1 · sapphire blue"),
      raw("--afenda-color-chart-2", "2 · forest green"),
      raw("--afenda-color-chart-3", "3 · golden amber"),
      raw("--afenda-color-chart-4", "4 · burgundy rose"),
      raw("--afenda-color-chart-5", "5 · royal violet"),
      raw("--afenda-color-chart-6", "6 · executive teal"),
      raw("--afenda-color-chart-7", "7 · warm slate"),
      raw("--afenda-color-chart-8", "8 · bronze"),
    ],
  },
  {
    title: "Charts — sequential",
    category: "charts",
    note: "Single-hue blue ramp · low → high magnitude.",
    items: [
      raw("--afenda-color-chart-sequential-1", "seq 1 · lowest"),
      raw("--afenda-color-chart-sequential-2", "seq 2"),
      raw("--afenda-color-chart-sequential-3", "seq 3"),
      raw("--afenda-color-chart-sequential-4", "seq 4"),
      raw("--afenda-color-chart-sequential-5", "seq 5"),
      raw("--afenda-color-chart-sequential-6", "seq 6 · highest"),
    ],
  },
  {
    title: "Charts — diverging",
    category: "charts",
    note: "Budget vs actual · deficit ← neutral → surplus.",
    items: [
      raw("--afenda-color-chart-diverging-neg-3", "neg 3 · deep deficit"),
      raw("--afenda-color-chart-diverging-neg-2", "neg 2"),
      raw("--afenda-color-chart-diverging-neg-1", "neg 1"),
      raw("--afenda-color-chart-diverging-neutral", "neutral · breakeven"),
      raw("--afenda-color-chart-diverging-pos-1", "pos 1"),
      raw("--afenda-color-chart-diverging-pos-2", "pos 2"),
      raw("--afenda-color-chart-diverging-pos-3", "pos 3 · strong surplus"),
    ],
  },
  {
    title: "Trend",
    category: "charts",
    note: "KPI delta text + subtle container surfaces.",
    items: [
      raw("--afenda-color-trend-positive", "positive"),
      raw("--afenda-color-trend-positive-surface", "positive surface"),
      raw("--afenda-color-trend-negative", "negative"),
      raw("--afenda-color-trend-negative-surface", "negative surface"),
      raw("--afenda-color-trend-neutral", "neutral"),
      raw("--afenda-color-trend-neutral-surface", "neutral surface"),
    ],
  },
  {
    title: "ACPA — chart frame",
    category: "acpa",
    note: "Plot infrastructure · grid, axis, tooltip, reference lines.",
    items: [
      alias("--afenda-chart-background", "plot background"),
      alias("--afenda-chart-foreground", "plot foreground"),
      alias("--afenda-chart-grid", "grid lines"),
      alias("--afenda-chart-axis", "axis lines"),
      alias("--afenda-chart-tooltip-bg", "tooltip bg"),
      alias("--afenda-chart-tooltip-border", "tooltip border"),
      alias("--afenda-chart-reference-line", "reference line"),
    ],
  },
  {
    title: "ACPA — KPI & trend",
    category: "acpa",
    items: [
      alias("--afenda-chart-kpi-value", "KPI value"),
      alias("--afenda-chart-kpi-label", "KPI label"),
      alias("--afenda-chart-kpi-positive", "KPI positive"),
      alias("--afenda-chart-kpi-negative", "KPI negative"),
      alias("--afenda-chart-kpi-neutral", "KPI neutral"),
      alias("--afenda-chart-kpi-target", "KPI target"),
      alias("--afenda-chart-trend-positive", "trend positive"),
      alias("--afenda-chart-trend-positive-surface", "trend positive surface"),
      alias("--afenda-chart-trend-negative", "trend negative"),
      alias("--afenda-chart-trend-negative-surface", "trend negative surface"),
      alias("--afenda-chart-trend-neutral", "trend neutral"),
      alias("--afenda-chart-trend-neutral-surface", "trend neutral surface"),
    ],
  },
  {
    title: "ACPA — thresholds & utilization",
    category: "acpa",
    items: [
      alias("--afenda-chart-threshold-success", "threshold success"),
      alias("--afenda-chart-threshold-warning", "threshold warning"),
      alias("--afenda-chart-threshold-danger", "threshold danger"),
      alias("--afenda-chart-utilization-track", "utilization track"),
      alias("--afenda-chart-utilization-low", "utilization low"),
      alias("--afenda-chart-utilization-medium", "utilization medium"),
      alias("--afenda-chart-utilization-high", "utilization high"),
      alias("--afenda-chart-utilization-over", "utilization over"),
    ],
  },
  {
    title: "ACPA — approval flow",
    category: "acpa",
    items: [
      alias("--afenda-chart-approval-draft", "draft"),
      alias("--afenda-chart-approval-pending", "pending"),
      alias("--afenda-chart-approval-approved", "approved"),
      alias("--afenda-chart-approval-rejected", "rejected"),
      alias("--afenda-chart-approval-escalated", "escalated"),
      alias("--afenda-chart-approval-cancelled", "cancelled"),
    ],
  },
  {
    title: "ACPA — forecast & finance",
    category: "acpa",
    items: [
      alias("--afenda-chart-forecast-actual", "forecast actual"),
      alias("--afenda-chart-forecast-projected", "forecast projected"),
      alias("--afenda-chart-forecast-band", "forecast band"),
      alias("--afenda-chart-finance-credit", "finance credit"),
      alias("--afenda-chart-finance-debit", "finance debit"),
      alias("--afenda-chart-finance-balanced", "finance balanced"),
      alias("--afenda-chart-timeline-line", "timeline line"),
      alias("--afenda-chart-timeline-marker", "timeline marker"),
      alias("--afenda-chart-timeline-marker-active", "timeline active"),
    ],
  },
  {
    title: "SEMANTIC · Table",
    category: "semantic",
    note: "Row-level semantic tokens — header, hover, selected, border, muted, and numeric column surfaces.",
    items: [
      alias("--afenda-table-header-background", "header bg"),
      alias("--afenda-table-header-foreground", "header fg"),
      alias("--afenda-table-row-hover", "row hover"),
      alias("--afenda-table-row-selected", "row selected"),
      alias("--afenda-table-row-border", "row border"),
      alias("--afenda-table-cell-muted", "cell muted fg"),
      alias("--afenda-table-cell-numeric", "cell numeric fg"),
    ],
  },
  {
    title: "SEMANTIC · Form field",
    category: "semantic",
    note: "Form control surface tokens — border, focus, background, placeholder, disabled, and invalid states.",
    items: [
      alias("--afenda-form-field-border", "border default"),
      alias("--afenda-form-field-border-focus", "border focus"),
      alias("--afenda-form-field-background", "background"),
      alias("--afenda-form-field-placeholder", "placeholder fg"),
      alias("--afenda-form-field-disabled-background", "disabled bg"),
      alias("--afenda-form-field-invalid-border", "invalid border"),
    ],
  },
  {
    title: "SCALE · Radius",
    category: "scale",
    note: "Base radius 0.625rem — sm through full. Used by input, card, dialog, badge primitives.",
    items: [
      alias("--afenda-radius-base", "base (0.625rem)"),
      alias("--afenda-radius-sm", "sm"),
      alias("--afenda-radius-md", "md"),
      alias("--afenda-radius-lg", "lg"),
      alias("--afenda-radius-xl", "xl"),
      alias("--afenda-radius-2xl", "2xl"),
      alias("--afenda-radius-full", "full"),
    ],
  },
  {
    title: "SCALE · Shadow",
    category: "scale",
    note: "Elevation ladder — sm (1dp) → overlay (modal scrim). Dark mode alpha is 20–30 % lighter for legibility.",
    items: [
      alias("--afenda-shadow-sm", "sm · 1dp"),
      alias("--afenda-shadow-md", "md · 4dp"),
      alias("--afenda-shadow-lg", "lg · 8dp"),
      alias("--afenda-shadow-xl", "xl · 16dp"),
      alias("--afenda-shadow-overlay", "overlay · modal"),
    ],
  },
  {
    title: "shadcn/ui bridge",
    category: "bridge",
    note: "Bridge aliases only — every value maps to an --afenda-* token.",
    items: [
      bridge("--background", "background"),
      bridge("--foreground", "foreground"),
      bridge("--card", "card"),
      bridge("--card-foreground", "card fg"),
      bridge("--popover", "popover"),
      bridge("--popover-foreground", "popover fg"),
      bridge("--primary", "primary"),
      bridge("--primary-foreground", "primary fg"),
      bridge("--secondary", "secondary"),
      bridge("--secondary-foreground", "secondary fg"),
      bridge("--muted", "muted"),
      bridge("--muted-foreground", "muted fg"),
      bridge("--accent", "accent"),
      bridge("--accent-foreground", "accent fg"),
      bridge("--destructive", "destructive"),
      bridge("--destructive-foreground", "destructive fg"),
      bridge("--success", "success"),
      bridge("--success-foreground", "success fg"),
      bridge("--warning", "warning"),
      bridge("--warning-foreground", "warning fg"),
      bridge("--info", "info"),
      bridge("--info-foreground", "info fg"),
      bridge("--border", "border"),
      bridge("--input", "input"),
      bridge("--ring", "ring"),
      bridge("--chart-1", "chart 1"),
      bridge("--chart-2", "chart 2"),
      bridge("--chart-3", "chart 3"),
      bridge("--chart-4", "chart 4"),
      bridge("--chart-5", "chart 5"),
      bridge("--chart-6", "chart 6"),
      bridge("--chart-7", "chart 7"),
      bridge("--chart-8", "chart 8"),
      bridge("--sidebar", "sidebar"),
      bridge("--sidebar-foreground", "sidebar fg"),
      bridge("--sidebar-primary", "sidebar primary"),
      bridge("--sidebar-primary-foreground", "sidebar primary fg"),
      bridge("--sidebar-accent", "sidebar accent"),
      bridge("--sidebar-accent-foreground", "sidebar accent fg"),
      bridge("--sidebar-border", "sidebar border"),
      bridge("--sidebar-ring", "sidebar ring"),
    ],
  },
];

const PALETTE_DNA = [
  { token: "--afenda-color-primary", label: "Sapphire Primary" },
  { token: "--afenda-color-surface-canvas", label: "Canvas" },
  { token: "--afenda-color-destructive", label: "Risk Red" },
  { token: "--afenda-status-tone-success-solid", label: "Success" },
  { token: "--afenda-status-tone-warning-solid", label: "Warning" },
  { token: "--afenda-status-tone-forbidden-solid", label: "Forbidden" },
  { token: "--afenda-color-chart-1", label: "Chart 1" },
  { token: "--afenda-color-chart-2", label: "Chart 2" },
] as const;

type FilterTab = "all" | PaletteCategory;

const FILTER_TABS: readonly { value: FilterTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "core", label: "Core" },
  { value: "status", label: "Status & ERP" },
  { value: "semantic", label: "Semantic" },
  { value: "scale", label: "Scale" },
  { value: "charts", label: "Charts" },
  { value: "acpa", label: "ACPA" },
  { value: "bridge", label: "shadcn Bridge" },
];

const TOTAL_TOKENS = ALL_GROUPS.reduce((s, g) => s + g.items.length, 0);

const LAYER_BADGE: Record<
  TokenLayer,
  { label: string; badgeTone: "neutral" | "info" | "success" }
> = {
  raw: { label: "RAW", badgeTone: "neutral" },
  alias: { label: "ALIAS", badgeTone: "info" },
  bridge: { label: "BRIDGE", badgeTone: "success" },
};

function countForTab(tab: FilterTab): number {
  if (tab === "all") {
    return TOTAL_TOKENS;
  }
  return ALL_GROUPS.filter((g) => g.category === tab).reduce(
    (s, g) => s + g.items.length,
    0
  );
}

function filterGroups(
  tab: FilterTab,
  query: string
): readonly (TokenGroup & { items: TokenItem[] })[] {
  const q = query.trim().toLowerCase();
  return ALL_GROUPS.filter((g) => tab === "all" || g.category === tab)
    .map((group) => {
      let items = [...group.items];
      if (q) {
        items = items.filter(
          (i) =>
            i.token.toLowerCase().includes(q) ||
            i.label.toLowerCase().includes(q) ||
            group.title.toLowerCase().includes(q)
        );
      }
      return { ...group, items };
    })
    .filter((g) => g.items.length > 0);
}

// ─── Components ──────────────────────────────────────────────────────────────

function DnaStrip({ themeKey }: { readonly themeKey: string }) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
      {PALETTE_DNA.map(({ token, label }) => (
        <DnaSwatch
          key={token}
          label={label}
          themeKey={themeKey}
          token={token}
        />
      ))}
    </div>
  );
}

function DnaSwatch({
  token,
  label,
  themeKey,
}: {
  readonly token: string;
  readonly label: string;
  readonly themeKey: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState("—");

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (ref.current) {
        setResolved(getComputedStyle(ref.current).backgroundColor);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [themeKey]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <StoryStack gap="xs">
          <div
            className="h-10 w-full rounded-md border border-border"
            ref={ref}
            style={{
              backgroundColor: `var(${token})`,
              boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.06)",
            }}
          />
          <span className="truncate text-muted-foreground text-xs">
            {label}
          </span>
        </StoryStack>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <StoryStack gap="xs">
          <code className="font-mono text-xs">{token}</code>
          <span className="font-mono text-muted-foreground text-xs">
            {resolved}
          </span>
        </StoryStack>
      </TooltipContent>
    </Tooltip>
  );
}

function Swatch({
  item,
  themeKey,
}: {
  readonly item: TokenItem;
  readonly themeKey: string;
}) {
  const swatchRef = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState("—");
  const layerMeta = LAYER_BADGE[item.layer];

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (swatchRef.current) {
        setResolved(getComputedStyle(swatchRef.current).backgroundColor);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [themeKey]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          aria-label={`${item.label}: ${item.token}`}
          className="group cursor-default overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          role="img"
          tabIndex={0}
        >
          <div
            className="relative h-16 w-full transition-opacity group-hover:opacity-90"
            ref={swatchRef}
            style={{
              backgroundColor: `var(${item.token})`,
              boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.06)",
            }}
          >
            <div className="absolute top-1 right-1">
              <Badge emphasis="solid" size="sm" tone="neutral">
                {layerMeta.label}
              </Badge>
            </div>
          </div>
          <StoryStack gap="xs" padding="sm">
            <span className="truncate font-medium text-foreground text-xs leading-tight">
              {item.label}
            </span>
            <code className="block truncate text-muted-foreground text-xs">
              {item.token.replace(/^--afenda-|^--/, "")}
            </code>
          </StoryStack>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <div className="max-w-xs">
          <StoryStack gap="xs">
            <span className="font-mono font-semibold text-xs">
              {item.token}
            </span>
            <Separator />
            <StoryRow align="center" gap="sm">
              <div
                className="size-4 shrink-0 rounded border border-border"
                style={{ backgroundColor: `var(${item.token})` }}
              />
              <span className="font-mono text-muted-foreground text-xs">
                {resolved}
              </span>
            </StoryRow>
            <Badge emphasis="soft" size="sm" tone={layerMeta.badgeTone}>
              {layerMeta.label.toLowerCase()}
            </Badge>
          </StoryStack>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function RadiusSwatch({ item }: { readonly item: TokenItem }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="size-12 border border-border bg-primary/20"
        style={{ borderRadius: `var(${item.token})` }}
      />
      <div className="text-center">
        <p className="font-medium text-foreground text-xs">{item.label}</p>
        <code className="text-muted-foreground text-xs">
          {item.token.replace("--afenda-", "")}
        </code>
      </div>
    </div>
  );
}

function ShadowSwatch({
  item,
  themeKey,
}: {
  readonly item: TokenItem;
  readonly themeKey: string;
}) {
  return (
    <div className="flex flex-col items-start gap-3" key={themeKey}>
      <div
        className="h-16 w-28 rounded-lg border border-border bg-card"
        style={{ boxShadow: `var(${item.token})` }}
      />
      <div>
        <p className="font-medium text-foreground text-xs">{item.label}</p>
        <code className="text-muted-foreground text-xs">
          {item.token.replace("--afenda-", "")}
        </code>
      </div>
    </div>
  );
}

function GroupSection({
  group,
  themeKey,
}: {
  readonly group: TokenGroup & { items: TokenItem[] };
  readonly themeKey: string;
}) {
  const isRadius = group.title === "SCALE · Radius";
  const isShadow = group.title === "SCALE · Shadow";

  return (
    <section>
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <StoryRow align="center" gap="sm">
            <h3 className="font-semibold text-foreground text-sm">
              {group.title}
            </h3>
            <span className="text-muted-foreground text-xs">
              {group.items.length} tokens
            </span>
          </StoryRow>
          {group.note ? (
            <p className="text-muted-foreground text-xs">{group.note}</p>
          ) : null}
        </StoryStack>
        {isRadius ? (
          <div className="flex flex-wrap gap-6">
            {group.items.map((item) => (
              <RadiusSwatch item={item} key={item.token} />
            ))}
          </div>
        ) : isShadow ? (
          <div className="flex flex-wrap gap-8">
            {group.items.map((item) => (
              <ShadowSwatch item={item} key={item.token} themeKey={themeKey} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
            {group.items.map((item) => (
              <Swatch item={item} key={item.token} themeKey={themeKey} />
            ))}
          </div>
        )}
      </StoryStack>
    </section>
  );
}

function StatsBar({
  filteredGroups,
  query,
  activeTab,
}: {
  readonly filteredGroups: readonly (TokenGroup & { items: TokenItem[] })[];
  readonly query: string;
  readonly activeTab: FilterTab;
}) {
  const visible = filteredGroups.reduce((s, g) => s + g.items.length, 0);
  return (
    <StoryRow
      align="center"
      className="text-muted-foreground text-xs"
      gap="md"
      wrap
    >
      <span>
        <span className="font-semibold text-foreground">{visible}</span> of{" "}
        {activeTab === "all" ? TOTAL_TOKENS : countForTab(activeTab)} tokens
      </span>
      <span>
        <span className="font-semibold text-foreground">
          {filteredGroups.length}
        </span>{" "}
        groups
      </span>
      {query.trim() ? (
        <span className="font-medium text-primary">
          Filtered by &quot;{query}&quot;
        </span>
      ) : null}
    </StoryRow>
  );
}

function TokenSearch({
  query,
  onQueryChange,
}: {
  readonly query: string;
  readonly onQueryChange: (value: string) => void;
}) {
  return (
    <StoryFrame width="sm">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <SearchIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
        </InputGroupAddon>
        <InputGroupInput
          aria-label="Search tokens"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search tokens, groups…"
          type="search"
          value={query}
        />
      </InputGroup>
    </StoryFrame>
  );
}

function PaletteView({
  initialTab = "all",
  themeKey,
}: {
  readonly initialTab?: FilterTab;
  readonly themeKey: string;
}) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>(initialTab);
  const filteredGroups = filterGroups(activeTab, query);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Tabs
          onValueChange={(value) => setActiveTab(value as FilterTab)}
          value={activeTab}
        >
          <StoryStack
            className="sticky top-0 z-10 shrink-0 border-border border-b bg-background/95 backdrop-blur"
            gap="md"
            paddingX="lg"
            paddingY="md"
          >
            <StoryRow align="start" gap="md" justify="between" wrap>
              <StoryStack gap="xs">
                <h2 className="font-semibold text-foreground text-sm">
                  Afenda ERP v2 — Color Palette
                </h2>
                <p className="max-w-2xl text-muted-foreground text-xs">
                  Deep Sapphire · Warm Canvas · Forest Green · Controlled Amber
                  · Royal Violet · Board-safe charts. Hover swatches for
                  resolved OKLCH. Toggle Theme for dark mode.
                </p>
              </StoryStack>
              <Badge emphasis="outline" size="sm" tone="info">
                TIP-004B authority
              </Badge>
            </StoryRow>

            <StoryStack gap="xs">
              <span className="font-medium text-foreground text-xs">
                Palette DNA
              </span>
              <DnaStrip themeKey={themeKey} />
            </StoryStack>

            <TokenSearch onQueryChange={setQuery} query={query} />

            <TabsList>
              {FILTER_TABS.map(({ value, label }) => (
                <TabsTrigger key={value} value={value}>
                  <StoryRow align="center" gap="xs">
                    <span>{label}</span>
                    <Badge emphasis="soft" size="sm" tone="neutral">
                      {countForTab(value)}
                    </Badge>
                  </StoryRow>
                </TabsTrigger>
              ))}
            </TabsList>

            <StatsBar
              activeTab={activeTab}
              filteredGroups={filteredGroups}
              query={query}
            />

            <Separator />
          </StoryStack>

          <div className="min-h-0 flex-1">
            {FILTER_TABS.map(({ value }) => (
              <TabsContent key={value} value={value}>
                <div className="min-h-96">
                  <ScrollArea>
                    <StoryStack gap="lg" paddingY="lg">
                      {filteredGroups.length === 0 ? (
                        <div className="flex min-h-48 flex-col items-center justify-center text-center">
                          <StoryStack gap="sm">
                            <span className="text-muted-foreground text-sm">
                              No tokens match{" "}
                              <strong>&quot;{query}&quot;</strong>
                            </span>
                          </StoryStack>
                        </div>
                      ) : (
                        filteredGroups.map((group) => (
                          <GroupSection
                            group={group}
                            key={group.title}
                            themeKey={themeKey}
                          />
                        ))
                      )}
                    </StoryStack>
                  </ScrollArea>
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

const meta = {
  title: "Design Tokens/Color Palette",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Afenda ERP v2 token catalog from afenda-tokens.css. Category tabs: Core, Status & ERP, Charts, ACPA, shadcn Bridge. Hover swatches for resolved OKLCH. Toggle Theme toolbar for dark mode.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Catalog: Story = {
  name: "ERP v2 Catalog",
  render: (_args, context) => {
    const theme =
      typeof context.globals["theme"] === "string"
        ? context.globals["theme"]
        : "light";
    return <PaletteView themeKey={theme} />;
  },
};

export const CoreOnly: Story = {
  name: "Core surfaces & brand",
  render: (_args, context) => {
    const theme =
      typeof context.globals["theme"] === "string"
        ? context.globals["theme"]
        : "light";
    return <PaletteView initialTab="core" themeKey={theme} />;
  },
};

export const ChartsAndAcpa: Story = {
  name: "Charts & ACPA",
  render: (_args, context) => {
    const theme =
      typeof context.globals["theme"] === "string"
        ? context.globals["theme"]
        : "light";
    return <PaletteView initialTab="charts" themeKey={theme} />;
  },
};

export const SemanticTokens: Story = {
  name: "Semantic (Table, Form, Status)",
  render: (_args, context) => {
    const theme =
      typeof context.globals["theme"] === "string"
        ? context.globals["theme"]
        : "light";
    return <PaletteView initialTab="semantic" themeKey={theme} />;
  },
};

export const ScaleTokens: Story = {
  name: "Scale (Radius & Shadow)",
  render: (_args, context) => {
    const theme =
      typeof context.globals["theme"] === "string"
        ? context.globals["theme"]
        : "light";
    return <PaletteView initialTab="scale" themeKey={theme} />;
  },
};
