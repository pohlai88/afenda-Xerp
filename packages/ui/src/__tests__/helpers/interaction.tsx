import {
  type RenderOptions,
  type RenderResult,
  render,
} from "@testing-library/react";
import type { ReactElement } from "react";

import { SidebarProvider } from "../../index";

export function renderWithSidebar(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): RenderResult {
  return render(ui, {
    wrapper: ({ children }) => <SidebarProvider>{children}</SidebarProvider>,
    ...options,
  });
}
