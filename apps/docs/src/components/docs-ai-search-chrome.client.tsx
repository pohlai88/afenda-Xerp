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
          buttonVariants({ color: "secondary", size: "sm" }),
          "fixed bottom-4 z-20 gap-2 rounded-full text-fd-muted-foreground shadow-md inset-e-[calc(--spacing(4)+var(--removed-body-scroll-bar-size,0px))]"
        )}
        position="float"
      >
        <MessageCircleIcon className="size-4.5" />
        Ask AI
      </AISearchTrigger>
    </AISearch>
  );
}
