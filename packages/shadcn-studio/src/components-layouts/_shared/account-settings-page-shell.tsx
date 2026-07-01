import type { ReactNode } from "react";

/** Shared page shell for account-settings MCP blocks (PAS-006). */
export function AccountSettingsPageShell({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <section className="w-full min-w-0 px-4 py-3 sm:px-6">
      <div className="mx-auto min-w-0 max-w-7xl">{children}</div>
    </section>
  );
}

/** Section grid — xl breakpoint keeps Storybook / settings sidebars single-column until wide enough. */
export const accountSettingsSectionGridClassName =
  "grid min-w-0 w-full grid-cols-1 gap-10 xl:grid-cols-3";

export const accountSettingsSectionHeadingClassName =
  "min-w-0 flex flex-col space-y-1";

export function accountSettingsSectionContentClassName(
  spacing: "4" | "6" = "6"
): string {
  return spacing === "4"
    ? "min-w-0 space-y-4 xl:col-span-2"
    : "min-w-0 space-y-6 xl:col-span-2";
}
