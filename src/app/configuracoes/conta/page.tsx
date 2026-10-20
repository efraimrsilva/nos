import type { Metadata } from "next";
import { requireControlsSession } from "@/features/controls/access";
import { ControlsShell } from "@/features/controls/components/controls-shell";
import { SecurityContent } from "@/features/controls/components/settings-content";
import { routes } from "@/shared/routes";
export const metadata: Metadata = { title: "Conta e segurança" };
export default async function SecurityPage() {
  await requireControlsSession(routes.security);
  return <ControlsShell title="Conta e segurança" subtitle="Cuide também do seu acesso." back={routes.settings}><div className="ui-panel account-panel"><SecurityContent /></div></ControlsShell>;
}
