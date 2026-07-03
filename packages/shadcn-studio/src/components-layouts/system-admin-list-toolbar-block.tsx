"use client";

import {
  PlusCircleIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { Button } from "../components-ui/button.js";
import { SearchDialogBlock } from "./dialog-search";

export interface SystemAdminListToolbarBlockProps {
  readonly createLabel: string;
  readonly searchLabel: string;
}

export function SystemAdminListToolbarBlock({
  createLabel,
  searchLabel,
}: SystemAdminListToolbarBlockProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchDialogBlock
        trigger={
          <Button aria-label={searchLabel} className="gap-2" variant="outline">
            <SearchIcon className="size-4" />
            {searchLabel}
          </Button>
        }
      />
      <Button className="gap-2" variant="outline">
        <SlidersHorizontalIcon className="size-4" />
        Filters
      </Button>
      <Button className="gap-2">
        <PlusCircleIcon className="size-4" />
        {createLabel}
      </Button>
    </div>
  );
}
