"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "../button";

export type DocsAnnouncementBarVariant = "accent" | "neutral" | "warn";

export interface DocsAnnouncementBarProps {
  readonly message: ReactNode;
  readonly actionLabel?: string;
  readonly actionHref?: string;
  readonly variant?: DocsAnnouncementBarVariant;
}

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
          <a
            className="afenda-docs-announcement-bar__action"
            href={actionHref}
          >
            {actionLabel}
          </a>
        ) : null}
      </div>
      <Button
        aria-label="Dismiss announcement"
        emphasis="ghost"
        onClick={() => setVisible(false)}
        size="sm"
      >
        Dismiss
      </Button>
    </div>
  );
}
