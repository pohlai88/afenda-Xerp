import { redirect } from "next/navigation";

/** Legacy readonly demo — use `/appshell-canvas` for the governed layout harness. */
export default function AppShellDemoPage() {
  redirect("/appshell-canvas");
}
