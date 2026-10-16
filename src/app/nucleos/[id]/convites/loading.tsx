import { LoadingIndicator } from "@/shared/components/loading-indicator";

export default function InvitationsLoading() {
  return <main className="app-shell mx-auto max-w-xl" aria-busy="true">
    <h1 className="font-display text-[30px]">Gerenciar convites</h1>
    <p role="status" className="mt-4 text-sm leading-7 text-muted"><LoadingIndicator>Conferindo sua permissão e os convites deste Núcleo…</LoadingIndicator></p>
  </main>;
}
