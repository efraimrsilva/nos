"use client";

export function DeclineButton() {
  return <button type="submit" onClick={(event) => {
    if (!window.confirm("Você deixará de participar destes termos. O acordo e o histórico das outras pessoas permanecerão. Deseja continuar?")) {
      event.preventDefault();
    }
  }} className="min-h-11 rounded-xl border border-line px-4 text-sm font-semibold text-muted">Recusar proposta</button>;
}
