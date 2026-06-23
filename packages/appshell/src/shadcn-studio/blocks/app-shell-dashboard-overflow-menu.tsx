import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@afenda/ui";
import {
  type GovernedUiComponentName,
  mapStockButtonProps,
} from "@afenda/ui/governance";
import { EllipsisVerticalIcon } from "lucide-react";
import { Fragment } from "react";

import type { AppShellDashboardOverflowMenuItem } from "../data/app-shell.dashboard.types";

export type AppShellDashboardOverflowMenuGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "DropdownMenu"
>;

export interface AppShellDashboardOverflowMenuProps {
  readonly align?: "center" | "end" | "start";
  readonly items: readonly AppShellDashboardOverflowMenuItem[];
  readonly menuLabel?: string;
  readonly onSelect?: (itemId: string) => void;
}

function partitionOverflowItems(
  items: readonly AppShellDashboardOverflowMenuItem[]
) {
  const primary: AppShellDashboardOverflowMenuItem[] = [];
  const secondary: AppShellDashboardOverflowMenuItem[] = [];

  for (const item of items) {
    if (item.section === "secondary") {
      secondary.push(item);
    } else {
      primary.push(item);
    }
  }

  return { primary, secondary };
}

function OverflowMenuItemRow({
  item,
  onSelect,
}: {
  readonly item: AppShellDashboardOverflowMenuItem;
  readonly onSelect?: (itemId: string) => void;
}) {
  return (
    <DropdownMenuItem
      {...(item.variant === undefined ? {} : { variant: item.variant })}
      onSelect={() => {
        onSelect?.(item.id);
      }}
    >
      <span className="app-shell-dashboard-overflow-item">
        <item.Icon
          aria-hidden
          className="app-shell-dashboard-overflow-item-icon"
        />
        <span>{item.label}</span>
      </span>
      {item.shortcut ? (
        <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
      ) : null}
    </DropdownMenuItem>
  );
}

function OverflowMenuGroupSection({
  items,
  onSelect,
}: {
  readonly items: readonly AppShellDashboardOverflowMenuItem[];
  readonly onSelect?: (itemId: string) => void;
}) {
  return (
    <DropdownMenuGroup>
      {items.map((item) => (
        <OverflowMenuItemRow
          item={item}
          key={item.id}
          {...(onSelect === undefined ? {} : { onSelect })}
        />
      ))}
    </DropdownMenuGroup>
  );
}

export function AppShellDashboardOverflowMenu({
  items,
  menuLabel = "Widget actions",
  align = "end",
  onSelect,
}: AppShellDashboardOverflowMenuProps) {
  const { primary, secondary } = partitionOverflowItems(items);

  return (
    <div className="app-shell-dashboard-overflow-menu">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            {...mapStockButtonProps("ghost", "icon-sm")}
            aria-label={menuLabel}
          >
            <EllipsisVerticalIcon
              aria-hidden
              className="app-shell-dashboard-overflow-icon"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align}>
          <DropdownMenuLabel>
            <span className="app-shell-dashboard-overflow-label">
              {menuLabel}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {primary.length > 0 ? (
            <OverflowMenuGroupSection
              items={primary}
              {...(onSelect === undefined ? {} : { onSelect })}
            />
          ) : null}
          {secondary.length > 0 ? (
            <Fragment>
              <DropdownMenuSeparator />
              <OverflowMenuGroupSection
                items={secondary}
                {...(onSelect === undefined ? {} : { onSelect })}
              />
            </Fragment>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
