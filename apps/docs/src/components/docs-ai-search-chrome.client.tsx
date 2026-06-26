"use client";

import { MessageCircleIcon } from "lucide-react";
import {
  AISearch,
  AISearchPanel,
  AISearchTrigger,
} from "@/components/ai/search";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function DocsAiSearchChrome() {
  return (
    <AISearch>
      <AISearchPanel />
      <AISearchTrigger
        className={cn(
          buttonVariants({
            color: "secondary",
            className: "gap-3 rounded-2xl text-fd-muted-foreground",
          })
        )}
        position="float"
      >
        <MessageCircleIcon className="size-4.5" />
        Ask AI
      </AISearchTrigger>
    </AISearch>
  );
}
