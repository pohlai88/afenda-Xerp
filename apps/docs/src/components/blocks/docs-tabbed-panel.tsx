"use client";

import { type ReactNode, useState } from "react";
import type { DocsTabbedPanelProps } from "./docs-block.types";

export function DocsTabbedPanel({
  items,
  defaultValue,
}: DocsTabbedPanelProps): ReactNode {
  const initial = defaultValue ?? items[0]?.value ?? "";
  const [active, setActive] = useState(initial);
  const activeItem = items.find((item) => item.value === active) ?? items[0];

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="afenda-docs-tabbed-panel">
      <div
        aria-label="Tab list"
        className="afenda-docs-tabbed-panel__list"
        role="tablist"
      >
        {items.map((item) => (
          <button
            aria-selected={active === item.value}
            className="afenda-docs-tabbed-panel__trigger"
            key={item.value}
            onClick={() => setActive(item.value)}
            role="tab"
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="afenda-docs-tabbed-panel__panel" role="tabpanel">
        {activeItem?.content}
      </div>
    </div>
  );
}

export type {
  DocsTabbedPanelItem,
  DocsTabbedPanelProps,
} from "./docs-block.types";
