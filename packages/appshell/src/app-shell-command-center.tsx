"use client";

import Link from "next/link";

import {
  Badge,
  Button,
} from "@afenda/ui";
import { cn } from "@afenda/ui/lib/utils";
import { Search } from "lucide-react";

import {
  type AppShellCommandItem,
  type AppShellCommandItemState,
  DEFAULT_COMMAND_ITEMS,
  isAppShellCommandItemNavigable,
  resolveAppShellCommandItemState,
  resolveAppShellCommandItemTitle,
  sortAppShellCommandItems,
} from "./app-shell.types";

const COMMAND_CENTER_HEADING_ID = "app-shell-command-center";

export interface AppShellCommandCenterProps {
  readonly items?: readonly AppShellCommandItem[];
}

function CommandItemContent({
  item,
  state,
}: {
  item: AppShellCommandItem;
  state: AppShellCommandItemState;
}) {
  return (
    <>
      <span>{item.label}</span>
      {item.keyboardShortcut ? (
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex">
          {item.keyboardShortcut}
        </kbd>
      ) : null}
      {state === "coming-soon" ? (
        <Badge emphasis="soft" size="sm" tone="neutral">
          Soon
        </Badge>
      ) : null}
    </>
  );
}

function AppShellCommandItemShell({ item }: { item: AppShellCommandItem }) {
  const state = resolveAppShellCommandItemState(item);
  const title = resolveAppShellCommandItemTitle(item);
  const isDisabled = state !== "ready";
  const content = <CommandItemContent item={item} state={state} />;

  if (isAppShellCommandItemNavigable(item)) {
    return (
      <Button
        asChild
        data-command-group={item.group}
        data-command-id={item.id}
        data-command-kind={item.kind}
        emphasis="outline"
        intent="secondary"
        size="sm"
        title={title}
      >
        <Link href={item.href}>
          <Search className="size-4" />
          {content}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      aria-disabled={isDisabled}
      data-command-group={item.group}
      data-command-id={item.id}
      data-command-kind={item.kind}
      disabled={isDisabled}
      emphasis="outline"
      intent="secondary"
      size="sm"
      title={title}
      type="button"
    >
      <Search className="size-4" />
      {content}
    </Button>
  );
}

export function AppShellCommandCenter({
  items = DEFAULT_COMMAND_ITEMS,
}: AppShellCommandCenterProps) {
  const visibleItems = sortAppShellCommandItems(items);

  return (
    <section
      aria-labelledby={COMMAND_CENTER_HEADING_ID}
      className={cn("flex flex-wrap items-center gap-2")}
    >
      <h2 className="sr-only" id={COMMAND_CENTER_HEADING_ID}>
        Command center
      </h2>
      {visibleItems.map((item) => (
        <AppShellCommandItemShell item={item} key={item.id} />
      ))}
    </section>
  );
}
