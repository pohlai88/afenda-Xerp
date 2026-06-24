"use client";

import type { ReactNode } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  type TabsListVariant,
  TabsTrigger,
} from "../tabs";

export interface DocsTabbedPanelItem {
  readonly content: ReactNode;
  readonly label: string;
  readonly value: string;
}

export interface DocsTabbedPanelProps {
  readonly defaultValue?: string;
  readonly items: readonly DocsTabbedPanelItem[];
  readonly tabsVariant?: TabsListVariant;
}

export function DocsTabbedPanel({
  items,
  defaultValue,
  tabsVariant = "line",
}: DocsTabbedPanelProps): ReactNode {
  const initial = defaultValue ?? items[0]?.value ?? "";

  return (
    <div className="afenda-docs-tabbed-panel" data-tabs-variant={tabsVariant}>
      <Tabs {...(initial ? { defaultValue: initial } : {})}>
        <TabsList variant={tabsVariant}>
          {items.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {items.map((item) => (
          <TabsContent key={item.value} value={item.value}>
            {item.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
