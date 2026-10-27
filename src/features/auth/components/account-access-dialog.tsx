import type { ReactNode } from "react";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { EmailActionForm } from "./access-forms";

export type AccountAccessKind = "recovery" | "confirmation";

export function AccountAccessDialog({ kind, next, defaultOpen = false, trigger, className = "", accountEmail, emailConfirmed = false }: {
  kind: AccountAccessKind;
  next: string;
  defaultOpen?: boolean;
  trigger?: ReactNode;
  className?: string;
  accountEmail?: string;
  emailConfirmed?: boolean;
}) {
  const recovery = kind === "recovery";
  return <ActionDialog variant="text" className={`auth-access-trigger ${className}`} defaultOpen={defaultOpen}
    title={recovery ? "Recuperar acesso" : "Confirmar e-mail"}
    description={recovery ? "Vamos ajudar você a voltar." : "Um pequeno passo para proteger sua conta."}
    trigger={trigger ?? (recovery ? "Esqueci minha senha" : "Preciso confirmar meu e-mail")}>
    {!recovery && emailConfirmed
      ? <p role="status" className="ui-feedback">Seu e-mail já está confirmado. Você já pode continuar usando sua conta.</p>
      : <EmailActionForm kind={kind} next={next} embedded accountEmail={accountEmail} />}
  </ActionDialog>;
}
