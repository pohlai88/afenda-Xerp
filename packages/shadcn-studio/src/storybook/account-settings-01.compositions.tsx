"use client";

import type { ReactNode } from "react";

import AccountSettings01Block from "../components-layouts/account-settings-01/account-settings-01.js";
import { cn } from "../utils/utils.js";

import {
  ACCOUNT_SETTINGS_01_SETTINGS_NAV,
  ACCOUNT_SETTINGS_01_SLOT_HYDRATION_LAB,
} from "./account-settings-01.fixtures.js";
import { MetadataSlotHydrationLab } from "./metadata-slot-hydration-lab.helpers.js";

function AccountSettingsBlockSurface({
  expandContentWidth = false,
}: {
  readonly expandContentWidth?: boolean;
}) {
  return (
    <div
      className={cn(
        "w-full",
        expandContentWidth && "[&_.max-w-7xl]:max-w-none [&_section]:py-0"
      )}
    >
      <AccountSettings01Block />
    </div>
  );
}

export function AccountSettingsPageShell({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <div className="min-h-svh w-full bg-background text-foreground">
      <header className="border-b px-6 py-6">
        <h1 className="font-semibold text-2xl tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account and workspace preferences.
        </p>
      </header>
      <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[12rem_minmax(0,1fr)]">
        <nav
          aria-label="Settings sections"
          className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:gap-1"
        >
          {ACCOUNT_SETTINGS_01_SETTINGS_NAV.map((item) => (
            <button
              className={cn(
                "rounded-md px-3 py-2 text-left text-sm transition-colors",
                item.active
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
              key={item.id}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

export function AccountSettings01InSettingsShell() {
  return (
    <AccountSettingsPageShell>
      <AccountSettingsBlockSurface expandContentWidth />
    </AccountSettingsPageShell>
  );
}

export function AccountSettings01FullWidthLab() {
  return (
    <div className="min-h-svh w-full bg-background px-4 py-6 sm:px-8">
      <AccountSettingsBlockSurface expandContentWidth />
    </div>
  );
}

export function AccountSettings01MetadataHydratedLab() {
  return (
    <AccountSettingsPageShell>
      <MetadataSlotHydrationLab
        slotHydration={ACCOUNT_SETTINGS_01_SLOT_HYDRATION_LAB}
      >
        <AccountSettingsBlockSurface expandContentWidth />
      </MetadataSlotHydrationLab>
    </AccountSettingsPageShell>
  );
}
