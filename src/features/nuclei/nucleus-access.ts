import { isAuthApiError, isAuthSessionMissingError, type AuthError } from "@supabase/supabase-js";

export function isNucleusAuthUnavailable(error: AuthError | null) {
  if (!error || isAuthSessionMissingError(error)) return false;
  // Cookies SSR expirados deixam de representar uma sessão; falhas de transporte continuam recuperáveis.
  if (isAuthApiError(error) && ["session_expired", "refresh_token_not_found", "refresh_token_already_used"].includes(error.code ?? "")) return false;
  return true;
}
