import { notFound } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ModuleRootPageProps {
  readonly params: Promise<{
    readonly moduleId: string;
  }>;
}

export default async function ModuleRootPage({
  params,
}: ModuleRootPageProps): Promise<React.JSX.Element> {
  const { moduleId } = await params;

  if (moduleId.trim().length === 0) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <p className="font-medium text-muted-foreground text-sm">Module</p>
        <h1 className="mt-2 font-semibold text-2xl tracking-normal">
          {moduleId}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground text-sm">
          This module root is registered for ERP navigation and documentation
          evidence. Operational pages remain available under the module-specific
          routes.
        </p>
      </section>
    </main>
  );
}
