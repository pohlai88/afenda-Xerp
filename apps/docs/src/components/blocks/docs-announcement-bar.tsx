"use client";

import { type ReactNode, useState } from "react";
import type { DocsAnnouncementBarProps } from "./docs-block.types";

export function DocsAnnouncementBar({
  message,
  actionLabel,
  actionHref,
  variant = "accent",
}: DocsAnnouncementBarProps): ReactNode {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <div
      className="afenda-docs-announcement-bar"
      data-variant={variant}
      role="status"
    >
      <div className="afenda-docs-announcement-bar__content">
        <p className="afenda-docs-announcement-bar__message">{message}</p>
        {actionLabel && actionHref ? (
          <a className="afenda-docs-announcement-bar__action" href={actionHref}>
            {actionLabel}
          </a>
        ) : null}
      </div>
      <button
        aria-label="Dismiss announcement"
        className="afenda-docs-announcement-bar__dismiss"
        onClick={() => setVisible(false)}
        type="button"
      >
        Dismiss
      </button>
    </div>
  );
}

export type {
  DocsAnnouncementBarProps,
  DocsAnnouncementBarVariant,
} from "./docs-block.types";
