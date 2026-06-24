import { Button, Card, CardContent } from "@afenda/ui";
import { mapStockButtonProps } from "@afenda/ui/governance";
import Link from "next/link";
import type { ReactElement, ReactNode } from "react";

import {
  type ErpEmptyStateIconKey,
  type ErpEmptyStateProps,
  isErpEmptyStateWithAction,
} from "@/lib/erp/erp-empty-state.contract";

const ERP_EMPTY_STATE_ICON_PROPS = {
  "aria-hidden": true,
  className: "erp-empty-state__icon",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2,
  viewBox: "0 0 24 24",
} as const;

function ErpDecorativeIcon({
  children,
  title,
}: {
  readonly children: ReactNode;
  readonly title: string;
}): ReactElement {
  return (
    <svg {...ERP_EMPTY_STATE_ICON_PROPS}>
      <title>{title}</title>
      {children}
    </svg>
  );
}

function ErpEmptyStateAccountingIcon(): ReactElement {
  return (
    <ErpDecorativeIcon title="Accounting placeholder">
      <rect height="14" rx="2" width="16" x="4" y="5" />
      <path d="M8 9h8M8 13h5" />
    </ErpDecorativeIcon>
  );
}

function ErpEmptyStateModuleIcon(): ReactElement {
  return (
    <ErpDecorativeIcon title="Module workspace">
      <rect height="7" rx="1" width="7" x="3" y="3" />
      <rect height="7" rx="1" width="7" x="14" y="3" />
      <rect height="7" rx="1" width="7" x="3" y="14" />
      <rect height="7" rx="1" width="7" x="14" y="14" />
    </ErpDecorativeIcon>
  );
}

function ErpEmptyStateSettingsIcon(): ReactElement {
  return (
    <ErpDecorativeIcon title="Settings">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </ErpDecorativeIcon>
  );
}

function ErpEmptyStateUsersIcon(): ReactElement {
  return (
    <ErpDecorativeIcon title="Users">
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
    </ErpDecorativeIcon>
  );
}

const ERP_EMPTY_STATE_ICONS = {
  accounting: ErpEmptyStateAccountingIcon,
  module: ErpEmptyStateModuleIcon,
  settings: ErpEmptyStateSettingsIcon,
  users: ErpEmptyStateUsersIcon,
} as const satisfies Record<ErpEmptyStateIconKey, () => ReactElement>;

export function ErpEmptyState(props: ErpEmptyStateProps) {
  const Icon = ERP_EMPTY_STATE_ICONS[props.iconKey];
  const titleId = props.titleId ?? "erp-empty-state-title";

  return (
    <section
      aria-labelledby={titleId}
      className="erp-empty-state"
      data-empty-state-variant={props.surfaceVariant}
    >
      <Card>
        <CardContent>
          <div className="erp-empty-state__inner">
            <Icon />
            <p className="erp-empty-state__title" id={titleId}>
              {props.title}
            </p>
            <p className="erp-empty-state__description">{props.description}</p>
            {isErpEmptyStateWithAction(props) ? (
              <div className="erp-empty-state__action">
                <Button asChild {...mapStockButtonProps("outline", "default")}>
                  <Link href={props.action.href}>{props.action.label}</Link>
                </Button>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
