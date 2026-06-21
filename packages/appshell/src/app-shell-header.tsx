"use client";

import { AppShellCommandCenter } from "./app-shell-command-center";
import type { AppShellCommandItem } from "./app-shell.types";

export interface AppShellHeaderProps {
  readonly commandItems?: readonly AppShellCommandItem[];
}

export function AppShellHeader({ commandItems }: AppShellHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <p className="sr-only">Application header</p>
      <div className="ml-auto flex items-center gap-2">
        <AppShellCommandCenter
          {...(commandItems === undefined ? {} : { items: commandItems })}
        />
      </div>
    </header>
  );
}
