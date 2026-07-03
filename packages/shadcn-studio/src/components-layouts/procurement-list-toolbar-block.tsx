"use client";

import {
  ArrowDownWideNarrowIcon,
  PlusCircleIcon,
  SearchIcon,
} from "lucide-react";
import { Button } from "../components-ui/button.js";
import { SearchDialogBlock } from "./dialog-search";

export interface ProcurementListToolbarBlockProps {
  readonly createLabel: string;
  readonly searchLabel: string;
}

export function ProcurementListToolbarBlock({
  createLabel,
  searchLabel,
}: ProcurementListToolbarBlockProps) {
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
        <ArrowDownWideNarrowIcon className="size-4" />
        Sort
      </Button>
      <Button className="gap-2">
        <PlusCircleIcon className="size-4" />
        {createLabel}
      </Button>
    </div>
  );
}
