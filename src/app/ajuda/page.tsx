import type { Metadata } from "next";
import { requireControlsSession } from "@/features/controls/access";
import { ControlsShell } from "@/features/controls/components/controls-shell";
import { HelpContent } from "@/features/controls/components/settings-content";
import { routes } from "@/shared/routes";
export const metadata: Metadata = { title: "Ajuda e suporte" };
export default async function HelpPage() {
  await requireControlsSession(routes.help);
  return <ControlsShell title="Ajuda e suporte" subtitle="Orientação e contato com a responsável pelo aplicativo." back={routes.settings}><div className="ui-panel account-panel"><HelpContent /></div></ControlsShell>;
}
