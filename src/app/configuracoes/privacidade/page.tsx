import type { Metadata } from "next";
import { requireControlsSession } from "@/features/controls/access";
import { ControlsShell } from "@/features/controls/components/controls-shell";
import { PrivacyContent } from "@/features/controls/components/settings-content";
import { routes } from "@/shared/routes";
export const metadata: Metadata = { title: "Privacidade e visibilidade" };
export default async function PrivacyPage() {
  const { supabase } = await requireControlsSession(routes.privacy);
  const { data: hidden, error } = await supabase.rpc("get_my_privacy_preference");
  if (error) throw new Error("Não foi possível consultar sua preferência.");
  return <ControlsShell title="Privacidade e visibilidade" subtitle="Escolhas claras sobre seu histórico compartilhado." back={routes.settings}><div className="ui-panel account-panel"><PrivacyContent hidden={Boolean(hidden)} /></div></ControlsShell>;
}
