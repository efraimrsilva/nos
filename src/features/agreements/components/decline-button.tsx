"use client";

export function DeclineButton() {
  return <button type="submit" onClick={(event) => {
    if (!window.confirm("Você deixará de participar destes termos. O acordo e o histórico das outras pessoas permanecerão. Deseja continuar?")) {
      event.preventDefault();
    }
  }} className="ui-button-secondary">Recusar proposta</button>;
}
