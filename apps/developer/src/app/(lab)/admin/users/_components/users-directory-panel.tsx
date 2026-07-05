import { SystemAdminUsersTableBlock } from "@afenda/shadcn-studio";
import Image from "next/image";
import type { AdminUsersPageData } from "@/lib/lab/contracts";

interface UsersDirectoryPanelProps {
  readonly pageData: AdminUsersPageData;
}

export function UsersDirectoryPanel({ pageData }: UsersDirectoryPanelProps) {
  return (
    <section className="space-y-4">
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
      <div className="rounded-2xl border border-border/60 px-4 py-3 text-sm">
        Canonical route: {pageData.canonicalHref}
      </div>
      <SystemAdminUsersTableBlock data={pageData.users} />
    </section>
  );
}
