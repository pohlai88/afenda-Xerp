"use client";

import {
  type AppShellApplicationShell02Section,
  AppShellApplicationShell02SystemAdminChrome,
  type AppShellApplicationShell02UserProfile,
} from "@afenda/appshell";
import { usePathname } from "next/navigation";

export interface SystemAdminSectionNavProps {
  readonly sections: readonly AppShellApplicationShell02Section[];
  readonly userProfile?: AppShellApplicationShell02UserProfile;
}

export function SystemAdminSectionNav({
  sections,
  userProfile,
}: SystemAdminSectionNavProps) {
  const pathname = usePathname();

  return (
    <AppShellApplicationShell02SystemAdminChrome
      activeHref={pathname}
      sections={sections}
      {...(userProfile === undefined ? {} : { userProfile })}
    />
  );
}
