"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SettingsTab {
  readonly href: string;
  readonly label: string;
}

interface SettingsTabNavProps {
  readonly tabs: readonly SettingsTab[];
}

export function SettingsTabNav({ tabs }: SettingsTabNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Settings sections" className="erp-settings-tab-nav">
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
