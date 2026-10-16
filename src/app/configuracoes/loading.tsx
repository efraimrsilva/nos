import { ControlsShell } from "@/features/controls/components/controls-shell";
import { LoadingIndicator } from "@/shared/components/loading-indicator";
export default function ControlsLoading() {
  return <ControlsShell title="Autonomia e proteção" subtitle="Conferindo seu acesso…" back="/nucleos"><p role="status"><LoadingIndicator>Carregando informações.</LoadingIndicator></p></ControlsShell>;
}
