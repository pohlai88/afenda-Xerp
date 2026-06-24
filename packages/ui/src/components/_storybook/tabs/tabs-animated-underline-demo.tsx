"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../tabs";
import {
  ANIMATED_TABS_DEFAULT_VALUE,
  ANIMATED_TABS_ITEMS,
  type StorybookAnimatedTabsItem,
} from "./tabs-fixtures";

export interface StorybookTabsAnimatedUnderlineProps {
  readonly defaultValue?: string;
  readonly items?: readonly StorybookAnimatedTabsItem[];
}

/**
 * Storybook-only animated underline tabs — normalized from shadcn-studio tabs-29.
 *
 * Phase 3 normalization:
 *   - Zero className on Tabs, TabsList, TabsTrigger, TabsContent
 *   - Spring underline via motion.div in plain HTML list shell
 *   - Line list styling in tabs-preview.css via data-slot selectors
 */
export function StorybookTabsAnimatedUnderline({
  defaultValue = ANIMATED_TABS_DEFAULT_VALUE,
  items = ANIMATED_TABS_ITEMS,
}: StorybookTabsAnimatedUnderlineProps): ReactNode {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const listShellRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const activeIndex = items.findIndex((tab) => tab.value === activeTab);
    const activeTabElement = tabRefs.current[activeIndex];
    const listShell = listShellRef.current;

    if (!(activeTabElement && listShell)) {
      return;
    }

    const shellRect = listShell.getBoundingClientRect();
    const tabRect = activeTabElement.getBoundingClientRect();

    setUnderlineStyle({
      left: tabRect.left - shellRect.left,
      width: tabRect.width,
    });
  }, [activeTab, items]);

  const underlineTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 400, damping: 40 };

  return (
    <div className="afenda-storybook-tabs afenda-storybook-tabs--animated">
      <Tabs onValueChange={setActiveTab} value={activeTab}>
        <div className="afenda-storybook-tabs__list-shell" ref={listShellRef}>
          <TabsList variant="line">
            {items.map((tab, index) => (
              <TabsTrigger
                key={tab.value}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                value={tab.value}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <motion.div
            animate={{
              left: underlineStyle.left,
              width: underlineStyle.width,
            }}
            aria-hidden="true"
            className="afenda-storybook-tabs__underline"
            transition={underlineTransition}
          />
        </div>

        {items.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <p className="afenda-storybook-tabs__content">{tab.content}</p>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
