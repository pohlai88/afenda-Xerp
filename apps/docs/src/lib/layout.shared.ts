import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Afenda Docs",
    },
    links: [
      {
        text: "Applications",
        url: "/docs/apps",
        active: "nested-url",
      },
      {
        text: "Contributing",
        url: "/docs/contributing",
        active: "nested-url",
      },
    ],
  };
}
