import { AppShellMain } from "@afenda/appshell";
import {
  getAfendaAuthSession,
  isAfendaAuthSessionLinked,
  toAfendaAuthIdentity,
} from "@afenda/auth";
import { headers } from "next/headers";
import { forbidden, notFound, redirect } from "next/navigation";
import { connection } from "next/server";

import { ModulePlaceholderEmptyState } from "@/components/module-placeholder-empty-state";
import { resolveOperatingContextFromHeaders } from "@/lib/context/resolve-operating-context-from-headers.server";
import { guardModuleRoute } from "@/lib/modules/guard-module-route.server";
import { resolveModulePlaceholderCopy } from "@/lib/modules/resolve-module-placeholder-copy";
import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";

interface ModulePlaceholderPageProps {
  readonly params: Promise<{
    readonly moduleId: string;
  }>;
}

export default async function ModulePlaceholderPage({
  params,
}: ModulePlaceholderPageProps) {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const session = await getAfendaAuthSession(await headers());

  if (!session) {
    redirect("/sign-in");
  }

  if (!isAfendaAuthSessionLinked(session)) {
    redirect("/sign-in?error=unlinked");
  }

  const identity = toAfendaAuthIdentity(session);
  const { moduleId } = await params;
  const operatingResult = await resolveOperatingContextFromHeaders({
    actorUserId: identity.userId,
  });

  if (!operatingResult.ok) {
    forbidden();
  }

  const guardResult = await guardModuleRoute({
    moduleId,
    operatingContext: operatingResult.value,
    correlationId: operatingResult.value.correlationId,
  });

  if (guardResult.kind === "not_found") {
    notFound();
  }

  if (guardResult.kind === "forbidden") {
    forbidden();
  }

  const placeholderCopy = resolveModulePlaceholderCopy({
    moduleId,
    label: guardResult.route.label,
  });

  return (
    <AppShellMain
      contentLabel={`${guardResult.route.label} module`}
      description={placeholderCopy.shellDescription}
      title={guardResult.route.label}
    >
      {/*
        Shell placeholder surface. Domain capabilities will appear here via contract copy.
      */}
      <ModulePlaceholderEmptyState copy={placeholderCopy} />
    </AppShellMain>
  );
}
