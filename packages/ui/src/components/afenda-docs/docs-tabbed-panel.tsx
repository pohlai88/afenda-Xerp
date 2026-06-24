"use client";

import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger, type TabsListVariant } from "../tabs";

export interface DocsTabbedPanelItem {
  readonly value: string;
  readonly label: string;
  readonly content: ReactNode;
}

export interface DocsTabbedPanelProps {
  readonly items: readonly DocsTabbedPanelItem[];
  readonly defaultValue?: string;
  readonly tabsVariant?: TabsListVariant;
}

export function DocsTabbedPanel({
  items,
  defaultValue,
  tabsVariant = "default",
}: DocsTabbedPanelProps): ReactNode {
  const initial = defaultValue ?? items[0]?.value;

  return (
    <div className="afenda-docs-tabbed-panel" data-tabs-variant={tabsVariant}>
      <Tabs defaultValue={initial}>
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
