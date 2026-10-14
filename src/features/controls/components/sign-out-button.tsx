"use client";
import { useFormStatus } from "react-dom";

export function SignOutButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} aria-busy={pending} className="min-h-11 rounded-xl border border-line px-5 font-semibold text-ink transition-colors hover:bg-[#eff3e6] disabled:opacity-60 motion-reduce:transition-none">{pending ? "Saindo…" : "Sair da conta"}</button>;
}
