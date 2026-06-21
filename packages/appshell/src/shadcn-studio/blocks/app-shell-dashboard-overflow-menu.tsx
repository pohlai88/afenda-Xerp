import { EllipsisVerticalIcon } from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@afenda/ui";
import {
  mapStockButtonProps,
  type GovernedUiComponentName,
} from "@afenda/ui/governance";

export type AppShellDashboardOverflowMenuGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "DropdownMenu"
>;

export interface AppShellDashboardOverflowMenuProps {
  readonly items: readonly string[];
  readonly menuLabel?: string;
}

export function AppShellDashboardOverflowMenu({
  items,
  menuLabel = "Widget actions",
}: AppShellDashboardOverflowMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button {...mapStockButtonProps("ghost", "icon-sm")}>
          <EllipsisVerticalIcon aria-hidden className="app-shell-dashboard-overflow-icon" />
          <span className="sr-only">{menuLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {items.map((item) => (
            <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
