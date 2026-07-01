import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

describe("tabs interaction", () => {
  it("switches visible panel when trigger is clicked", async () => {
    const user = setupUser();

    render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">Panel one</TabsContent>
        <TabsContent value="two">Panel two</TabsContent>
      </Tabs>
    );

    expect(screen.getByText("Panel one")).toBeVisible();
    expect(screen.queryByText("Panel two")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByText("Panel two")).toBeVisible();
    expect(screen.queryByText("Panel one")).not.toBeInTheDocument();
  });
});
