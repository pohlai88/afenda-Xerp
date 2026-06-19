import { withSupabaseRoute } from "@/lib/supabase/route-handler";

export const GET = withSupabaseRoute({ auth: "user" }, (_request, ctx) =>
  Promise.resolve(
    Response.json({
      authMode: ctx.authMode,
      user: ctx.userClaims,
    })
  )
);
