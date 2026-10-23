export const ACCOUNT_DELETION_PHRASE = "APAGAR CONTA";

// Interface e servidor compartilham a mesma confirmação, sem normalizar uma frase diferente.
export function isAccountDeletionConfirmed(value: unknown): boolean {
  return value === ACCOUNT_DELETION_PHRASE;
}
