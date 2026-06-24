import { Card, CardContent } from "@afenda/ui";
import type { GovernedCardProps } from "@afenda/ui/governance";
import Link from "next/link";
import type { ReactElement, ReactNode } from "react";

import type {
  ErpCardNavIconKey,
  ErpCardNavItem,
} from "@/lib/system-admin/resolve-system-admin-card-nav";

const ERP_CARD_NAV_ICON_PROPS = {
  "aria-hidden": true,
  className: "erp-card-nav-grid__icon",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2,
  viewBox: "0 0 24 24",
} as const;

const ERP_CARD_NAV_ICON_TITLES = {
  audit: "Audit",
  memberships: "Memberships",
  permissions: "Permissions",
  roles: "Roles",
  settings: "Settings",
  users: "Users",
} as const satisfies Record<ErpCardNavIconKey, string>;

function ErpCardNavDecorativeIcon({
  children,
  iconKey,
}: {
  readonly children: ReactNode;
  readonly iconKey: ErpCardNavIconKey;
}): ReactElement {
  return (
    <svg {...ERP_CARD_NAV_ICON_PROPS}>
      <title>{ERP_CARD_NAV_ICON_TITLES[iconKey]}</title>
      {children}
    </svg>
  );
}

function ErpCardNavAuditIcon(): ReactElement {
  return (
    <ErpCardNavDecorativeIcon iconKey="audit">
      <path d="M8 6h10M8 10h10M8 14h6M6 6h.01M6 10h.01M6 14h.01" />
      <path d="M4 4h16v16H4z" />
    </ErpCardNavDecorativeIcon>
  );
}

function ErpCardNavMembershipsIcon(): ReactElement {
  return (
    <ErpCardNavDecorativeIcon iconKey="memberships">
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </ErpCardNavDecorativeIcon>
  );
}

function ErpCardNavPermissionsIcon(): ReactElement {
  return (
    <ErpCardNavDecorativeIcon iconKey="permissions">
      <circle cx="8" cy="15" r="4" />
      <path d="M11.5 11.5 16 7M16 7l3 3M16 7v4h4" />
    </ErpCardNavDecorativeIcon>
  );
}

function ErpCardNavRolesIcon(): ReactElement {
  return (
    <ErpCardNavDecorativeIcon iconKey="roles">
      <path d="M12 3 4 7v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V7l-8-4z" />
    </ErpCardNavDecorativeIcon>
  );
}

function ErpCardNavSettingsIcon(): ReactElement {
  return (
    <ErpCardNavDecorativeIcon iconKey="settings">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2" />
    </ErpCardNavDecorativeIcon>
  );
}

function ErpCardNavUsersIcon(): ReactElement {
  return (
    <ErpCardNavDecorativeIcon iconKey="users">
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
    </ErpCardNavDecorativeIcon>
  );
}

const ERP_CARD_NAV_ICONS = {
  audit: ErpCardNavAuditIcon,
  memberships: ErpCardNavMembershipsIcon,
  permissions: ErpCardNavPermissionsIcon,
  roles: ErpCardNavRolesIcon,
  settings: ErpCardNavSettingsIcon,
  users: ErpCardNavUsersIcon,
} as const satisfies Record<ErpCardNavIconKey, () => ReactElement>;

const ERP_CARD_NAV_CARD_PROPS = {
  density: "standard",
  radius: "md",
  shadow: "raised",
} as const satisfies GovernedCardProps;

interface ErpCardNavGridProps {
  readonly items: readonly ErpCardNavItem[];
}

export function ErpCardNavGrid({ items }: ErpCardNavGridProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="System admin sections" className="erp-card-nav-grid">
      <ul className="erp-card-nav-grid__list">
        {items.map((item) => {
          const Icon = ERP_CARD_NAV_ICONS[item.iconKey];

          return (
            <li className="erp-card-nav-grid__item" key={item.sectionId}>
              <Link className="erp-card-nav-grid__link" href={item.href}>
                <Card {...ERP_CARD_NAV_CARD_PROPS}>
                  <CardContent>
                    <Icon />
                    <p className="erp-card-nav-grid__label">{item.label}</p>
                    <p className="erp-card-nav-grid__description">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
