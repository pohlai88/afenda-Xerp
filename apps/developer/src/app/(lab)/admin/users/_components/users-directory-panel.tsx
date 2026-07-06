"use client";

import { DataTableSurface } from "@afenda/shadcn-studio-v2/clients";
import Image from "next/image";
import type { AdminUsersPageData } from "@/lib/lab/contracts";
import { mapLabUsersToTableSurface } from "@/lib/lab/user-table-fixture";

interface UsersDirectoryPanelProps {
  readonly pageData: AdminUsersPageData;
}

export function UsersDirectoryPanel({ pageData }: UsersDirectoryPanelProps) {
  const tableSurface = mapLabUsersToTableSurface(pageData.users);

  return (
    <section className="min-w-0 space-y-4">
      <div className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-muted/30">
        <Image
          alt={pageData.previewImage.alt}
          className="h-auto w-full"
          height={pageData.previewImage.height}
          loading="eager"
          sizes="(min-width: 1280px) 72rem, 100vw"
          src={pageData.previewImage.src}
          width={pageData.previewImage.width}
        />
      </div>
      <div className="min-w-0 overflow-x-auto rounded-2xl border border-border/60 px-4 py-3 text-sm">
        Canonical route: {pageData.canonicalHref}
      </div>
      <div className="min-w-0 overflow-x-auto">
        <DataTableSurface {...tableSurface} />
      </div>
    </section>
  );
}
