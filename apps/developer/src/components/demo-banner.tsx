import { LAB_DEMO_BANNER } from "@/lib/lab/lab-demo-context";

export function DemoBanner() {
  return (
    <div
      className="border-b bg-amber-500/10 px-4 py-2 text-center text-amber-950 text-xs dark:text-amber-100"
      role="status"
    >
      {LAB_DEMO_BANNER}
    </div>
  );
}
