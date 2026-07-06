import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  breadcrumbLinkClassName,
  breadcrumbListClassName,
} from "../components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationLinkCurrent,
  paginationClassName,
  paginationLinkClassName,
  paginationLinkCurrentClassName,
} from "../components/ui/pagination";
import {
  scrollAreaClassName,
  scrollAreaViewportClassName,
  scrollThumbClassName,
} from "../components/ui/scroll-area";
import { separatorClassName } from "../components/ui/separator";
import {
  tabsContentClassName,
  tabsListClassName,
  tabsTriggerClassName,
} from "../components/ui/tabs";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const SRC_ROOT = path.join(PACKAGE_ROOT, "src");

const SERVER_SAFE_NAV_PRIMITIVES = [
  "breadcrumb.tsx",
  "pagination.tsx",
] as const;

const CLIENT_NAV_PRIMITIVES = [
  "tabs.tsx",
  "separator.tsx",
  "scroll-area.tsx",
] as const;

const NAV_DATA_PRIMITIVES = [
  ...SERVER_SAFE_NAV_PRIMITIVES,
  ...CLIENT_NAV_PRIMITIVES,
] as const;

function readSource(...segments: string[]): string {
  return readFileSync(path.join(SRC_ROOT, ...segments), "utf8");
}

describe("shadcn-studio-v2 nav and data chrome primitives", () => {
  it("keeps Lane A-06 nav/data primitives in the registered ui lane", () => {
    for (const fileName of NAV_DATA_PRIMITIVES) {
      const source = readSource("components", "ui", fileName);

      expect(source).toContain("export function");
      expect(source).not.toContain("window.");
      expect(source).not.toContain("document.");
      expect(source).not.toContain("localStorage");
      expect(source).not.toContain("useRouter");
      expect(source).not.toContain('from "next/link"');
      expect(source).not.toContain("next/navigation");
    }

    for (const fileName of CLIENT_NAV_PRIMITIVES) {
      expect(readSource("components", "ui", fileName)).toContain(
        '"use client"'
      );
    }

    expect(readSource("components", "ui", "pagination.tsx")).toContain(
      'from "./button"'
    );
  });

  it("uses canonical semantic token utilities in nav/data class helpers", () => {
    expect(tabsListClassName()).toContain("bg-muted");
    expect(tabsListClassName()).toContain("text-muted-foreground");
    expect(tabsListClassName({ variant: "underline" })).toContain(
      "border-border"
    );
    expect(tabsTriggerClassName()).toContain("focus-visible:ring-ring");
    expect(tabsContentClassName({ className: "extra-tabs" })).toContain(
      "extra-tabs"
    );

    expect(breadcrumbListClassName()).toContain("text-muted-foreground");
    expect(breadcrumbLinkClassName()).toContain("focus-visible:ring-ring");
    expect(breadcrumbLinkClassName({ className: "extra-crumb" })).toContain(
      "extra-crumb"
    );

    expect(paginationClassName()).toContain("justify-center");
    expect(paginationLinkClassName()).toContain("hover:bg-accent");
    expect(paginationLinkCurrentClassName()).toContain("border-border");
    expect(paginationLinkClassName({ className: "extra-page" })).toContain(
      "extra-page"
    );

    expect(separatorClassName()).toContain("bg-border");
    expect(separatorClassName({ orientation: "vertical" })).toContain(
      "h-full w-px"
    );

    expect(scrollAreaClassName()).toContain("overflow-hidden");
    expect(scrollAreaViewportClassName()).toContain("size-full");
    expect(scrollThumbClassName()).toContain("bg-border");
  });

  it("serializes nav/data ownership through data-slot markers", () => {
    const tabsSource = readSource("components", "ui", "tabs.tsx");
    expect(tabsSource).toContain('data-slot="tabs"');
    expect(tabsSource).toContain('data-slot="tabs-list"');
    expect(tabsSource).toContain('data-slot="tabs-trigger"');
    expect(tabsSource).toContain('data-slot="tabs-content"');
    expect(tabsSource).toContain("satisfies Record");
    expect(tabsSource).toContain("TabsPrimitive.Tab");

    const breadcrumbSource = readSource("components", "ui", "breadcrumb.tsx");
    expect(breadcrumbSource).toContain('data-slot="breadcrumb"');
    expect(breadcrumbSource).toContain('data-slot="breadcrumb-list"');
    expect(breadcrumbSource).toContain('data-slot="breadcrumb-link"');
    expect(breadcrumbSource).toContain('data-slot="breadcrumb-page"');

    const paginationSource = readSource("components", "ui", "pagination.tsx");
    expect(paginationSource).toContain('data-slot="pagination"');
    expect(paginationSource).toContain('data-slot="pagination-link"');
    expect(paginationSource).toContain('data-slot="pagination-link-current"');
    expect(paginationSource).toContain("export function PaginationLink");

    const separatorSource = readSource("components", "ui", "separator.tsx");
    expect(separatorSource).toContain('data-slot="separator"');

    const scrollAreaSource = readSource("components", "ui", "scroll-area.tsx");
    expect(scrollAreaSource).toContain('data-slot="scroll-area"');
    expect(scrollAreaSource).toContain('data-slot="scroll-area-viewport"');
    expect(scrollAreaSource).toContain('data-slot="scroll-area-thumb"');
  });

  it("renders server-safe nav primitives with semantic accessible markup", () => {
    const breadcrumbMarkup = renderToStaticMarkup(
      createElement(
        Breadcrumb,
        undefined,
        createElement(
          BreadcrumbList,
          undefined,
          createElement(
            BreadcrumbItem,
            undefined,
            createElement(BreadcrumbLink, { href: "/sales" }, "Sales")
          ),
          createElement(
            BreadcrumbItem,
            undefined,
            createElement(BreadcrumbPage, undefined, "Open records")
          )
        )
      )
    );
    const paginationMarkup = renderToStaticMarkup(
      createElement(
        Pagination,
        undefined,
        createElement(
          PaginationContent,
          undefined,
          createElement(
            PaginationItem,
            undefined,
            createElement(PaginationLink, { href: "/?page=1" }, "1")
          ),
          createElement(
            PaginationItem,
            undefined,
            createElement(PaginationLinkCurrent, { href: "/?page=2" }, "2")
          )
        )
      )
    );

    expect(breadcrumbMarkup).toContain("<nav");
    expect(breadcrumbMarkup).toContain('aria-label="Breadcrumb"');
    expect(breadcrumbMarkup).toContain('data-slot="breadcrumb-list"');
    expect(breadcrumbMarkup).toContain('href="/sales"');
    expect(breadcrumbMarkup).toContain('aria-current="page"');
    expect(breadcrumbMarkup).toContain("Open records");

    expect(paginationMarkup).toContain("<nav");
    expect(paginationMarkup).toContain('aria-label="Pagination"');
    expect(paginationMarkup).toContain('data-slot="pagination-content"');
    expect(paginationMarkup).toContain('href="/?page=1"');
    expect(paginationMarkup).toContain('aria-current="page"');
  });

  it("keeps nav/data exports on neutral index and off server surface", () => {
    const indexSource = readSource("index.ts");
    const serverSource = readSource("server.ts");

    for (const stem of [
      "tabs",
      "breadcrumb",
      "pagination",
      "separator",
      "scroll-area",
    ]) {
      expect(indexSource).toContain(`./components/ui/${stem}`);
      expect(serverSource).not.toContain(`./components/ui/${stem}`);
    }
  });
});
