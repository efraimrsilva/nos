import type { ReactNode } from "react";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { EmailActionForm } from "./access-forms";

export type AccountAccessKind = "recovery" | "confirmation";

export function AccountAccessDialog({ kind, next, defaultOpen = false, trigger, className = "" }: {
  kind: AccountAccessKind;
  next: string;
  defaultOpen?: boolean;
  trigger?: ReactNode;
  className?: string;
}) {
  const recovery = kind === "recovery";
  return <ActionDialog variant="text" className={`auth-access-trigger ${className}`} defaultOpen={defaultOpen}
    title={recovery ? "Recuperar acesso" : "Confirmar e-mail"}
    description={recovery ? "Vamos ajudar você a voltar." : "Um pequeno passo para proteger sua conta."}
    trigger={trigger ?? (recovery ? "Esqueci minha senha" : "Preciso confirmar meu e-mail")}>
    <EmailActionForm kind={kind} next={next} embedded />
  </ActionDialog>;
}
