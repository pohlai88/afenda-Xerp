import { withSupabaseRoute } from "@/lib/supabase/route-handler";

/** Supabase JWT claims debug route — not Afenda identity (see ADR-004). */
export const GET = withSupabaseRoute({ auth: "user" }, (_request, ctx) =>
  Promise.resolve(
    Response.json({
      authMode: ctx.authMode,
      user: ctx.userClaims,
    })
  )
);
