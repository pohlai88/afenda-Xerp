import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Badge,
  type BadgeVariant,
  badgeClassName,
} from "../components/ui/badge";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
  buttonClassName,
} from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardVariant,
  cardClassName,
} from "../components/ui/card";
import { cn } from "../lib/cn";
import {
  readPackageSrcFile,
  readUiPrimitiveSource,
  UI_PRIMITIVE_COUNT,
  UI_PRIMITIVE_FILES,
} from "./helpers/ui-primitive-inventory";

const REQUIRED_PRIMITIVES = ["badge.tsx", "button.tsx", "card.tsx"] as const;
const BADGE_VARIANTS = [
  "default",
  "secondary",
  "destructive",
  "outline",
] satisfies BadgeVariant[];
const BUTTON_VARIANTS = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
] satisfies ButtonVariant[];
const BUTTON_SIZES = ["default", "sm", "lg", "icon"] satisfies ButtonSize[];
const CARD_VARIANTS = ["default", "muted"] satisfies CardVariant[];

describe("shadcn-studio-v2 primitive baseline", () => {
  it("aligns Slice 3A coverage with the forty-primitive inventory SSOT", () => {
    expect(UI_PRIMITIVE_COUNT).toBe(40);
    for (const fileName of REQUIRED_PRIMITIVES) {
      expect(UI_PRIMITIVE_FILES).toContain(fileName);
    }
  });

  it("keeps Slice 3A primitives in the registered ui lane", () => {
    for (const fileName of REQUIRED_PRIMITIVES) {
      const source = readUiPrimitiveSource(fileName);

      expect(source).toContain("export function");
      expect(source).not.toContain("window.");
      expect(source).not.toContain("document.");
      expect(source).not.toContain("localStorage");
    }
  });

  it("uses canonical semantic token utilities in primitive variants", () => {
    expect(buttonClassName({ variant: "default" })).toContain("bg-primary");
    expect(buttonClassName({ variant: "outline" })).toContain("border-border");
    expect(buttonClassName()).toContain("data-[state=loading]:cursor-wait");
    expect(badgeClassName({ variant: "secondary" })).toContain("bg-secondary");
    expect(badgeClassName({ variant: "outline" })).toContain("border-border");
    expect(badgeClassName({ variant: "outline" })).toContain("text-foreground");
    expect(cardClassName()).toContain("border-border");
    expect(cardClassName()).toContain("bg-card");
    expect(cardClassName()).toContain("text-card-foreground");
    expect(cardClassName()).toContain("rounded-lg");
    expect(cardClassName()).not.toContain("rounded-xl");
    expect(cardClassName({ variant: "muted" })).toContain("bg-muted");
    expect(cardClassName({ variant: "muted" })).toContain(
      "text-muted-foreground"
    );
  });

  it("supports every Badge semantic variant and native span attributes", () => {
    for (const variant of BADGE_VARIANTS) {
      expect(badgeClassName({ variant })).not.toBe("");
    }

    expect(badgeClassName({ className: "extra-badge" })).toContain(
      "extra-badge"
    );

    const badgeMarkup = renderToStaticMarkup(
      createElement(
        Badge,
        { "aria-label": "Invoice status", id: "status-badge" },
        "Open"
      )
    );

    expect(badgeMarkup).toContain("<span");
    expect(badgeMarkup).toContain('data-slot="badge"');
    expect(badgeMarkup).toContain('aria-label="Invoice status"');
    expect(badgeMarkup).toContain('id="status-badge"');
    expect(badgeMarkup).toContain("Open");
  });

  it("supports every Button semantic variant and size", () => {
    for (const variant of BUTTON_VARIANTS) {
      expect(buttonClassName({ variant })).not.toBe("");
    }

    for (const size of BUTTON_SIZES) {
      expect(buttonClassName({ size })).not.toBe("");
    }

    expect(buttonClassName({ className: "extra-class" })).toContain(
      "extra-class"
    );
  });

  it("supports every Card semantic variant and presentational title semantics", () => {
    for (const variant of CARD_VARIANTS) {
      expect(cardClassName({ variant })).not.toBe("");
    }

    expect(cardClassName({ className: "extra-card" })).toContain("extra-card");

    const cardMarkup = renderToStaticMarkup(
      createElement(
        Card,
        { "aria-label": "Revenue summary", variant: "muted" },
        createElement(
          CardHeader,
          undefined,
          createElement(CardTitle, undefined, "Revenue"),
          createElement(CardDescription, undefined, "Trailing twelve months")
        ),
        createElement(CardContent, undefined, "128"),
        createElement(CardFooter, undefined, "Updated now")
      )
    );

    expect(cardMarkup).toContain('aria-label="Revenue summary"');
    expect(cardMarkup).toContain('data-slot="card"');
    expect(cardMarkup).toContain('data-slot="card-header"');
    expect(cardMarkup).toContain('data-slot="card-title"');
    expect(cardMarkup).toContain('data-slot="card-description"');
    expect(cardMarkup).toContain('data-slot="card-content"');
    expect(cardMarkup).toContain('data-slot="card-footer"');
    expect(cardMarkup).toContain("<div");
    expect(cardMarkup).not.toContain("<h3");
    expect(cardMarkup).toContain("Revenue");
  });

  it("keeps class merging deterministic without external runtime dependency", () => {
    expect(cn("base", false, null, ["nested"], { enabled: true })).toBe(
      "base nested enabled"
    );
  });

  it("does not expose quarantine through public surfaces", () => {
    expect(readPackageSrcFile("index.ts")).not.toContain("quarantine");
    expect(readPackageSrcFile("clients.ts")).not.toContain("quarantine");
    expect(readPackageSrcFile("server.ts")).not.toContain("quarantine");
  });

  it("serializes primitive ownership through stable data-slot markers", () => {
    expect(readUiPrimitiveSource("button.tsx")).toContain('data-slot="button"');
    expect(readUiPrimitiveSource("badge.tsx")).toContain('data-slot="badge"');

    const cardSource = readUiPrimitiveSource("card.tsx");

    expect(cardSource).toContain('data-slot="card"');
    expect(cardSource).toContain('data-slot="card-header"');
    expect(cardSource).toContain('data-slot="card-title"');
    expect(cardSource).toContain('data-slot="card-description"');
    expect(cardSource).toContain('data-slot="card-content"');
    expect(cardSource).toContain('data-slot="card-footer"');
  });

  it("renders Button, Badge, and Card through semantic HTML with governed slots", () => {
    const buttonMarkup = renderToStaticMarkup(
      createElement(Button, { variant: "outline" }, "Save")
    );
    const badgeMarkup = renderToStaticMarkup(
      createElement(Badge, { variant: "secondary" }, "Stable")
    );
    const cardMarkup = renderToStaticMarkup(
      createElement(
        Card,
        undefined,
        createElement(
          CardHeader,
          undefined,
          createElement(CardTitle, undefined, "Revenue"),
          createElement(CardDescription, undefined, "Trailing twelve months")
        ),
        createElement(CardContent, undefined, "128"),
        createElement(CardFooter, undefined, "Updated now")
      )
    );

    expect(buttonMarkup).toContain("<button");
    expect(buttonMarkup).toContain('type="button"');
    expect(buttonMarkup).toContain('data-slot="button"');
    expect(buttonMarkup).toContain("Save");

    expect(badgeMarkup).toContain("<span");
    expect(badgeMarkup).toContain('data-slot="badge"');
    expect(badgeMarkup).toContain("Stable");

    expect(cardMarkup).toContain('data-slot="card"');
    expect(cardMarkup).toContain('data-slot="card-header"');
    expect(cardMarkup).toContain('data-slot="card-title"');
    expect(cardMarkup).toContain('data-slot="card-description"');
    expect(cardMarkup).toContain('data-slot="card-content"');
    expect(cardMarkup).toContain('data-slot="card-footer"');
    expect(cardMarkup).toContain("Revenue");
    expect(cardMarkup).toContain("128");
  });

  it("renders Button loading state with accessible busy and disabled semantics", () => {
    const buttonMarkup = renderToStaticMarkup(
      createElement(Button, { state: "loading" }, "Saving")
    );
    const forcedEnabledLoadingMarkup = renderToStaticMarkup(
      createElement(
        Button,
        { disabled: false, state: "loading" },
        "Still saving"
      )
    );
    const explicitBusyMarkup = renderToStaticMarkup(
      createElement(
        Button,
        { "aria-busy": false, state: "loading" },
        "Saving quietly"
      )
    );

    expect(buttonMarkup).toContain('aria-busy="true"');
    expect(buttonMarkup).toContain('data-state="loading"');
    expect(buttonMarkup).toContain("disabled");
    expect(buttonMarkup).toContain("Saving");
    expect(forcedEnabledLoadingMarkup).toContain("disabled");
    expect(explicitBusyMarkup).toContain('aria-busy="false"');
  });
});
