import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookOpenIcon } from "lucide-react";
import { describe, expect, it } from "vitest";
import {
  DocsAccordionPanel,
  DocsAnnouncementBar,
  DocsCallout,
  DocsFeatureStrip,
  DocsGuideCardGrid,
  DocsTabbedPanel,
} from "@/components/blocks";

describe("docs editorial blocks", () => {
  it("registers DocsGuideCardGrid with editorial card structure", () => {
    render(
      <DocsGuideCardGrid
        heading="Guides"
        items={[
          {
            title: "Getting started",
            description: "Install and run the monorepo.",
            href: "/docs/getting-started",
            icon: BookOpenIcon,
            badge: "New",
          },
        ]}
      />
    );

    expect(
      screen.getByRole("link", { name: /getting started/i })
    ).toHaveAttribute("href", "/docs/getting-started");
    expect(screen.getByText("New")).toHaveAttribute("data-tone", "info");
  });

  it("renders DocsCallout with alert role for warn tone", () => {
    render(<DocsCallout title="Heads up" tone="warn" />);

    expect(screen.getByRole("alert")).toHaveAttribute("data-tone", "warn");
  });

  it("renders DocsFeatureStrip items", () => {
    render(
      <DocsFeatureStrip
        items={[
          {
            title: "Typecheck",
            description: "Strict TS across packages.",
            icon: BookOpenIcon,
          },
        ]}
        title="Quality gates"
      />
    );

    expect(
      screen.getByRole("heading", { name: "Quality gates" })
    ).toBeVisible();
    expect(screen.getByText("Typecheck")).toBeVisible();
  });

  it("toggles DocsTabbedPanel panels", async () => {
    const user = userEvent.setup();

    render(
      <DocsTabbedPanel
        items={[
          { label: "pnpm", value: "pnpm", content: <p>pnpm install</p> },
          { label: "npm", value: "npm", content: <p>npm install</p> },
        ]}
      />
    );

    expect(screen.getByRole("tabpanel")).toHaveTextContent("pnpm install");
    await user.click(screen.getByRole("tab", { name: "npm" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("npm install");
  });

  it("expands DocsAccordionPanel items", () => {
    render(
      <DocsAccordionPanel
        defaultOpenItems={["Install"]}
        items={[
          { title: "Install", content: <p>Run pnpm install</p> },
          { title: "Dev", content: <p>Run pnpm dev</p> },
        ]}
      />
    );

    expect(screen.getByText("Run pnpm install")).toBeVisible();
  });

  it("dismisses DocsAnnouncementBar", async () => {
    const user = userEvent.setup();

    render(
      <DocsAnnouncementBar
        message="Preview release available."
        variant="accent"
      />
    );

    expect(screen.getByRole("status")).toBeVisible();
    await user.click(
      screen.getByRole("button", { name: "Dismiss announcement" })
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
