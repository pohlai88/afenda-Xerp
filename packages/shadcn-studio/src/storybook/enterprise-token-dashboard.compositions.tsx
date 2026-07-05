"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Search,
  Settings,
} from "lucide-react";
import type { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "../components-ui/alert.js";
import { Avatar, AvatarFallback } from "../components-ui/avatar.js";
import { badgeSolidDestructiveClassName } from "../components-ui/badge.contract.js";
import { Badge } from "../components-ui/badge.js";
import { Button } from "../components-ui/button.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components-ui/card.js";
import { Checkbox } from "../components-ui/checkbox.js";
import { Input } from "../components-ui/input.js";
import { Label } from "../components-ui/label.js";
import { Progress } from "../components-ui/progress.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components-ui/select.js";
import { Separator } from "../components-ui/separator.js";
import { Spinner } from "../components-ui/spinner.js";
import { Switch } from "../components-ui/switch.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components-ui/table.js";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components-ui/tabs.js";
import { Textarea } from "../components-ui/textarea.js";
import { cn } from "../utils/utils.js";
import {
  labNoirProofItemClassName,
  labNoirProofLabelClassName,
  labNoirProofStripClassName,
  labNoirProofValueClassName,
  labNoirStatusClassName,
  labNoirSystemLineClassName,
} from "./presentation-lab/presentation-lab.noir.contract.js";

type DashboardSeries = "admincn-light" | "admincn-dark" | "brand-dark";

const BRAND_CLASS = "theme-afenda-brand";

const SWISS_NOIR_PROOF = [
  { id: "surfaces", value: "06", label: "Surfaces" },
  { id: "presets", value: "12", label: "Presets" },
  { id: "gates", value: "05", label: "Gates" },
] as const;

const SEMANTIC_SWATCHES = [
  { token: "background", className: "bg-background" },
  { token: "foreground", className: "bg-foreground" },
  { token: "card", className: "bg-card" },
  { token: "primary", className: "bg-primary" },
  { token: "primary-fg", className: "bg-primary-foreground" },
  { token: "secondary", className: "bg-secondary" },
  { token: "muted", className: "bg-muted" },
  { token: "muted-fg", className: "bg-muted-foreground" },
  { token: "accent", className: "bg-accent" },
  { token: "destructive", className: "bg-destructive" },
  { token: "border", className: "bg-border" },
  { token: "input", className: "bg-input" },
  { token: "ring", className: "bg-ring" },
  { token: "chart-1", className: "bg-chart-1" },
  { token: "chart-2", className: "bg-chart-2" },
  { token: "chart-3", className: "bg-chart-3" },
  { token: "sidebar", className: "bg-sidebar" },
  { token: "info", className: "bg-info" },
  { token: "success", className: "bg-success" },
  { token: "warning", className: "bg-warning" },
] as const;

function Swatch({
  token,
  className,
  value,
}: {
  token: string;
  className?: string;
  value?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={cn(
          "h-9 w-full rounded-md border border-border shadow-xs",
          className
        )}
        style={value ? { background: value } : undefined}
        title={value ?? token}
      />
      <span className="font-mono text-[10px] text-muted-foreground leading-tight">
        {token}
      </span>
    </div>
  );
}

function SwissNoirProofStrip() {
  return (
    <div
      aria-label="Swiss Noir proof summary"
      className={labNoirProofStripClassName}
    >
      {SWISS_NOIR_PROOF.map((item) => (
        <article className={labNoirProofItemClassName} key={item.id}>
          <p className={labNoirProofValueClassName}>{item.value}</p>
          <p className={labNoirProofLabelClassName}>{item.label}</p>
        </article>
      ))}
    </div>
  );
}

function seriesMeta(series: DashboardSeries) {
  switch (series) {
    case "admincn-light":
      return {
        title: "Light mode",
        subtitle: "shadcn-default.css semantic palette · :root",
        badge: "base-vega",
        footer:
          "packages/shadcn-studio/src/styles/shadcn-default.css · :root tokens",
        modeKey: "light" as const,
      };
    case "admincn-dark":
      return {
        title: "Dark mode",
        subtitle: "shadcn-default.css semantic palette · .dark",
        badge: "base-vega",
        footer:
          "packages/shadcn-studio/src/styles/shadcn-default.css · .dark tokens",
        modeKey: "dark" as const,
      };
    case "brand-dark":
      return {
        title: "Brand dark",
        subtitle: "Color Brand · Figma Brand Dark · Swiss Noir DNA",
        badge: "color-brand",
        footer:
          "packages/shadcn-studio/docs/swiss-noir.css · .dark .theme-afenda-brand",
        modeKey: "brand" as const,
      };
  }
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="font-semibold text-base tracking-tight">{title}</h2>
        {description ? (
          <p className="text-muted-foreground text-xs">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function TableStatusBadge({
  children,
  series,
  tone,
}: {
  children: ReactNode;
  series: DashboardSeries;
  tone: "paid" | "pending" | "overdue";
}) {
  const onDark = series !== "admincn-light";

  if (tone === "paid") {
    return <Badge variant="secondary">{children}</Badge>;
  }

  if (tone === "pending") {
    return (
      <Badge
        className={
          onDark ? "border-border/70 bg-muted/40 text-foreground" : undefined
        }
        variant="outline"
      >
        {children}
      </Badge>
    );
  }

  return onDark ? (
    <Badge className={badgeSolidDestructiveClassName}>{children}</Badge>
  ) : (
    <Badge variant="destructive">{children}</Badge>
  );
}

function EnterpriseDashboardPanel({ series }: { series: DashboardSeries }) {
  const meta = seriesMeta(series);
  const isBrand = series === "brand-dark";
  const isAdminCnDark = series === "admincn-dark";

  return (
    <div
      className={cn(
        "relative flex min-h-full flex-col gap-6 bg-background p-6 text-foreground",
        isAdminCnDark && "dark",
        isBrand && ["dark", BRAND_CLASS, "lab-noir-canvas overflow-hidden"]
      )}
      data-mode={meta.modeKey}
      data-series={series}
    >
      {isBrand ? (
        <div
          aria-hidden
          className="lab-noir-orb pointer-events-none absolute"
        />
      ) : null}

      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-border border-b pb-4">
        <div>
          {isBrand ? (
            <p className={labNoirSystemLineClassName}>
              figma · Color Brand · LsmtG4KiaTUi3KpjxZXHwH
            </p>
          ) : (
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Afenda ERP · Token verification
            </p>
          )}
          <h1
            className={cn(
              "font-semibold text-2xl tracking-tight",
              isBrand && "lab-noir-title uppercase"
            )}
          >
            {meta.title}
          </h1>
          <p className="text-muted-foreground text-sm">{meta.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">PAS-006</Badge>
          <Badge variant="outline">{meta.badge}</Badge>
          {isBrand ? (
            <span className={labNoirStatusClassName}>
              <span className="size-1.5 rounded-full bg-primary" />
              Swiss Noir
            </span>
          ) : null}
          <Button
            aria-label="Search"
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <Search />
          </Button>
          <Button
            aria-label="Notifications"
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <Bell />
          </Button>
          <Button
            aria-label="Settings"
            size="icon-sm"
            type="button"
            variant="default"
          >
            <Settings />
          </Button>
        </div>
      </header>

      {isBrand ? (
        <div className="relative z-10">
          <SwissNoirProofStrip />
        </div>
      ) : null}

      <Section
        description={
          isBrand
            ? "Color Brand semantic tokens — mirrors Figma collection modes Brand Light / Brand Dark"
            : "Semantic CSS variables from tokens-complete.json"
        }
        title="Color palette"
      >
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-6">
          {SEMANTIC_SWATCHES.map((swatch) => (
            <Swatch
              className={swatch.className}
              key={swatch.token}
              token={swatch.token}
            />
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="grid gap-2 rounded-lg border border-border bg-card p-4">
          <p className="font-semibold text-3xl tracking-tight">Display 3xl</p>
          <p className="font-semibold text-2xl">Heading 2xl</p>
          <p className="font-semibold text-xl">Heading xl</p>
          <p className="font-medium text-base">Body base — operator copy</p>
          <p className="text-muted-foreground text-sm">
            Muted sm — secondary labels and hints
          </p>
          <p className="font-mono text-xs">Mono xs — invoice #INV-2048</p>
        </div>
      </Section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Actions">
          <div className="flex flex-wrap gap-2">
            <Button type="button">Primary</Button>
            <Button type="button" variant="secondary">
              Secondary
            </Button>
            <Button type="button" variant="outline">
              Outline
            </Button>
            <Button type="button" variant="ghost">
              Ghost
            </Button>
            <Button type="button" variant="destructive">
              Destructive
            </Button>
            <Button type="button" variant="link">
              Link
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </Section>

        <Section title="Form controls">
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor={`search-${meta.modeKey}`}>Search</Label>
              <Input
                id={`search-${meta.modeKey}`}
                placeholder="Filter records…"
                type="search"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor={`notes-${meta.modeKey}`}>Notes</Label>
              <Textarea
                id={`notes-${meta.modeKey}`}
                placeholder="Approval comment"
                rows={2}
              />
            </div>
            <Select defaultValue="open">
              <SelectTrigger aria-label="Invoice status" className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox defaultChecked id={`cb-${meta.modeKey}`} />
                <Label htmlFor={`cb-${meta.modeKey}`}>Approved</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  defaultChecked
                  id={`sw-${meta.modeKey}`}
                  variant={isBrand ? "outline" : "default"}
                />
                <Label htmlFor={`sw-${meta.modeKey}`}>Notifications</Label>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <Section title="Status & feedback">
        <div className="grid gap-3">
          <Alert>
            <AlertTitle>System notice</AlertTitle>
            <AlertDescription>
              Default alert on card surface — token-bound border and text.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Validation failed</AlertTitle>
            <AlertDescription>
              Destructive alert — check required fields before submit.
            </AlertDescription>
          </Alert>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-info text-info-foreground">Info</Badge>
            <Badge className="bg-success text-success-foreground">
              Success
            </Badge>
            <Badge className="bg-warning text-warning-foreground">
              Warning
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Progress
              aria-label="Token verification progress"
              className="w-48"
              value={68}
            />
            <Spinner />
          </div>
        </div>
      </Section>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenue</CardDescription>
            <CardTitle className="text-2xl tabular-nums">$128,420</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-1 text-sm text-success">
            <ArrowUpRight className="size-4" />
            +12.4% vs last month
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Outstanding</CardDescription>
            <CardTitle className="text-2xl tabular-nums">$18,902</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-1 text-destructive text-sm">
            <ArrowDownRight className="size-4" />3 overdue invoices
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active users</CardDescription>
            <CardTitle className="text-2xl tabular-nums">1,284</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback>AF</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground text-sm">42 online now</span>
          </CardContent>
        </Card>
      </div>

      <Section title="Data & navigation">
        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
          </TabsList>
          <TabsContent className="mt-3" value="orders">
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-xs">
                      INV-2048
                    </TableCell>
                    <TableCell>Acme Corp</TableCell>
                    <TableCell>
                      <TableStatusBadge series={series} tone="paid">
                        Paid
                      </TableStatusBadge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      $4,280.00
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">
                      INV-2049
                    </TableCell>
                    <TableCell>Northwind LLC</TableCell>
                    <TableCell>
                      <TableStatusBadge series={series} tone="pending">
                        Pending
                      </TableStatusBadge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      $1,120.50
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">
                      INV-2050
                    </TableCell>
                    <TableCell>Globex</TableCell>
                    <TableCell>
                      <TableStatusBadge series={series} tone="overdue">
                        Overdue
                      </TableStatusBadge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      $890.00
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent
            className="mt-3 text-muted-foreground text-sm"
            value="inventory"
          >
            Inventory tab — placeholder for secondary surface check.
          </TabsContent>
          <TabsContent
            className="mt-3 text-muted-foreground text-sm"
            value="audit"
          >
            Audit tab — placeholder for secondary surface check.
          </TabsContent>
        </Tabs>
      </Section>

      <Separator />
      <footer className="relative z-10 text-muted-foreground text-xs">
        Source: {meta.footer}
      </footer>
    </div>
  );
}

/**
 * Enterprise verification surface — three palette series (Storybook SSOT).
 *
 * 1. AdminCN Light (:root)
 * 2. AdminCN Dark (.dark)
 * 3. Brand Dark (.dark + .theme-afenda-brand) — Figma Color Brand / Swiss Noir DNA
 */
export function EnterpriseTokenDashboardSideBySide() {
  return (
    <div
      className="grid min-h-svh w-full grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3"
      data-testid="enterprise-token-dashboard"
    >
      <EnterpriseDashboardPanel series="admincn-light" />
      <EnterpriseDashboardPanel series="admincn-dark" />
      <EnterpriseDashboardPanel series="brand-dark" />
    </div>
  );
}
