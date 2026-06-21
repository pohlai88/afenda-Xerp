import { setupUser } from "@afenda/testing/react";
import { render, screen, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { MetadataActionButton } from "../client/metadata-action-renderer.client.js";
import { samplePageSurfaceFixture } from "../fixtures/sample-page-surface.fixture.js";
import { MetadataModuleSurface } from "../surfaces/index.js";
import { sampleRenderContext } from "../fixtures/sample-runtime-context.fixture.js";
import React from "react";

const productionCss = readFileSync(
  join(import.meta.dirname, "../styles.css"),
  "utf8"
);

describe("metadata-ui accessibility", () => {
  it("production CSS defines focus-visible affordances for interactive controls", () => {
    expect(productionCss).toMatch(/\.metadata-action-button:focus-visible/);
    expect(productionCss).toMatch(/\.metadata-action-link:focus-visible/);
    expect(productionCss).toMatch(
      /\.metadata-surface-breadcrumbs a:focus-visible/
    );
  });

  it("production CSS includes visually-hidden utility for describedby text", () => {
    expect(productionCss).toContain(".metadata-visually-hidden");
  });

  it("disabled action reasons are exposed to assistive tech via aria-describedby", () => {
    render(
      <MetadataActionButton
        action={{
          key: "disabled-action",
          label: "Disabled",
          kind: "button",
          visibility: "disabled",
          reason: "You do not have permission.",
        }}
      />
    );

    const button = screen.getByRole("button", { name: "Disabled" });
    const reasonId = button.getAttribute("aria-describedby");
    expect(reasonId).toBeTruthy();

    const reason = document.getElementById(reasonId ?? "");
    expect(reason).not.toBeNull();
    expect(reason).toHaveClass("metadata-visually-hidden");
    expect(reason).toHaveTextContent("You do not have permission.");
    expect(reason?.getAttribute("hidden")).toBeNull();
  });

  it("marks the current breadcrumb with aria-current on page surfaces", () => {
    render(samplePageSurfaceFixture.element);

    const breadcrumbNav = screen.getByRole("navigation", {
      name: "Breadcrumb",
    });
    expect(
      within(breadcrumbNav).getByText("Order fulfillment queue")
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Sales" })).not.toHaveAttribute(
      "aria-current"
    );
  });

  it("does not duplicate aria-label when aria-labelledby is present", () => {
    render(
      <MetadataModuleSurface
        context={sampleRenderContext}
        identity={{
          id: "module.test",
          title: "Module title",
        }}
        slots={{ content: <p>Body</p> }}
      />
    );

    const region = screen.getByRole("region", { name: "Module title" });
    expect(region).toHaveAttribute("aria-labelledby");
    expect(region.getAttribute("aria-label")).toBeNull();
  });

  it("disabled link actions are removed from tab order", () => {
    render(
      <MetadataActionButton
        action={{
          key: "disabled-link",
          label: "Disabled link",
          kind: "link",
          href: "/orders",
          visibility: "disabled",
          reason: "Read-only mode.",
        }}
      />
    );

    const link = document.querySelector('[data-action-key="disabled-link"]');
    expect(link).not.toBeNull();
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
  });

  it("metadata action bar uses fieldset group semantics", () => {
    render(samplePageSurfaceFixture.element);

    const actionBar = document.querySelector('[data-slot="metadata-action-bar"]');
    expect(actionBar).not.toBeNull();
    expect(actionBar?.tagName).toBe("FIELDSET");
    expect(actionBar).toHaveAttribute("aria-label");
  });

  it("keyboard users can focus action buttons", async () => {
    const user = setupUser();
    render(samplePageSurfaceFixture.element);

    await user.tab();
    const focused = document.activeElement;
    expect(focused?.tagName).toMatch(/A|BUTTON/);
  });
});
