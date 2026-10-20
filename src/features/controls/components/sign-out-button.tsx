"use client";
import { useFormStatus } from "react-dom";

export function SignOutButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} aria-busy={pending} className="ui-button-secondary">{pending ? "Saindo…" : "Sair da conta"}</button>;
}
