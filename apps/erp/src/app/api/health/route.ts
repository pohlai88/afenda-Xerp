export const runtime = "nodejs";
export const dynamic = "auto";
export const revalidate = 30;

export function GET() {
  return Response.json({ status: "ok" }, { status: 200 });
}
