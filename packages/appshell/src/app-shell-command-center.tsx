"use client";

import Link from "next/link";

import {
  Badge,
  Button,
  Kbd,
} from "@afenda/ui";
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
      {item.keyboardShortcut ? <Kbd>{item.keyboardShortcut}</Kbd> : null}
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
          <Search aria-hidden />
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
      <Search aria-hidden />
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
      className="flex flex-wrap items-center"
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
