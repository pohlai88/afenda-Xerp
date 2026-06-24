import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../tabs";
import {
  LINE_TABS_DEFAULT_VALUE,
  LINE_TABS_ITEMS,
  type StorybookLineTabsItem,
} from "./tabs-fixtures";

export interface StorybookTabsLineProps {
  readonly defaultValue?: string;
  readonly items?: readonly StorybookLineTabsItem[];
}

/**
 * Storybook-only static line tabs — normalized from shadcn-studio tabs-11.
 *
 * Phase 3 normalization:
 *   - Zero className on Tabs, TabsList, TabsTrigger, TabsContent
 *   - Line list chrome (border-b, flush pseudo underline) in tabs-preview.css
 *   - Uses governed TabsList variant="line" — no local variant strings
 */
export function StorybookTabsLine({
  defaultValue = LINE_TABS_DEFAULT_VALUE,
  items = LINE_TABS_ITEMS,
}: StorybookTabsLineProps): ReactNode {
  return (
    <div className="afenda-storybook-tabs afenda-storybook-tabs--line">
      <Tabs defaultValue={defaultValue}>
        <TabsList variant="line">
          {items.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {items.map((item) => (
          <TabsContent key={item.value} value={item.value}>
            <p className="afenda-storybook-tabs__content">{item.content}</p>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
