"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface UserSettingsTab {
  readonly href: string;
  readonly label: string;
}

interface UserSettingsTabNavProps {
  readonly tabs: readonly UserSettingsTab[];
}

export function UserSettingsTabNav({ tabs }: UserSettingsTabNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="User settings sections" className="erp-settings-tab-nav">
      <ul className="erp-settings-tab-nav__list">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <li key={tab.href}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className="erp-settings-tab-nav__tab"
                href={tab.href}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
