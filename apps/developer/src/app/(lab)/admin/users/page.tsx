import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio";
import type { Metadata } from "next";
import {
  createAdminUsersMetadata,
  loadAdminUsersPage,
} from "@/lib/lab/load-admin-users-page.server";
import { UsersDirectoryPanel } from "./_components/users-directory-panel";

export async function generateMetadata(): Promise<Metadata> {
  return createAdminUsersMetadata();
}

export default async function AdminUsersPage() {
  const pageData = await loadAdminUsersPage();

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="font-medium text-primary text-xs uppercase tracking-[0.28em]">
            Operator List Surface
          </p>
          <h1 className="font-semibold text-3xl tracking-tight">
            {pageData.title}
          </h1>
          <p className="max-w-3xl text-muted-foreground">
            {pageData.description}
          </p>
        </div>
        <Card className="w-full max-w-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Future ERP integration</CardTitle>
            <CardDescription>{pageData.promotionSummary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="rounded-2xl bg-muted px-3 py-2">
              {pageData.promotion.futureErpPath}
            </p>
            <p className="text-muted-foreground">{pageData.promotion.notes}</p>
          </CardContent>
        </Card>
      </header>
      <UsersDirectoryPanel pageData={pageData} />
    </section>
  );
}
