"use client";

import { ChevronsUpDownIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../../button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../collapsible";
import {
  STARRED_REPOS_COLLAPSIBLE,
  STARRED_REPOS_PRIMARY,
  STARRED_REPOS_TITLE,
} from "./collapsible-fixtures";

export interface StorybookCollapsibleAnimatedProps {
  readonly collapsibleRepos?: readonly string[];
  readonly defaultOpen?: boolean;
  readonly primaryRepo?: string;
  readonly title?: string;
}

/**
 * Storybook-only animated collapsible — normalized from shadcn-studio collapsible-10.
 *
 * Phase 3 normalization:
 *   - Zero className on Collapsible / CollapsibleTrigger / CollapsibleContent / Button
 *   - All layout + animation in collapsible-preview.css via BEM + data-slot selectors
 *   - Button: emphasis="ghost" presentation="icon" size="sm" (not stock variant strings)
 */
export function StorybookCollapsibleAnimated({
  title = STARRED_REPOS_TITLE,
  primaryRepo = STARRED_REPOS_PRIMARY,
  collapsibleRepos = STARRED_REPOS_COLLAPSIBLE,
  defaultOpen,
}: StorybookCollapsibleAnimatedProps): ReactNode {
  return (
    <div className="afenda-storybook-collapsible">
      <Collapsible {...(defaultOpen ? { defaultOpen: true } : {})}>
        <div className="afenda-storybook-collapsible__header">
          <p className="afenda-storybook-collapsible__title">{title}</p>
          <CollapsibleTrigger asChild>
            <Button
              aria-label="Toggle starred repositories"
              emphasis="ghost"
              intent="secondary"
              presentation="icon"
              size="sm"
            >
              <ChevronsUpDownIcon aria-hidden="true" />
              <span className="afenda-storybook-collapsible__sr-only">
                Toggle
              </span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <div className="afenda-storybook-collapsible__repo-row">
          {primaryRepo}
        </div>

        <CollapsibleContent>
          {collapsibleRepos.map((repo) => (
            <div className="afenda-storybook-collapsible__repo-row" key={repo}>
              {repo}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
