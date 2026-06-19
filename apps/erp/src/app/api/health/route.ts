import { withSupabaseRoute } from "@/lib/supabase/route-handler";

export const GET = withSupabaseRoute({ auth: "none" }, (_request, _ctx) =>
  Promise.resolve(Response.json({ status: "ok" }))
);
