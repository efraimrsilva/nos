export function parseRecoveryCredentials(params: URLSearchParams) {
  // Rejeita ambiguidades antes do Auth: até um parâmetro vazio caracteriza credenciais misturadas.
  if (["code", "token_hash", "type"].some(name => params.getAll(name).length > 1)
    || (params.has("code") && params.has("token_hash"))) return null;
  const code = params.get("code");
  const tokenHash = params.get("token_hash");
  if (params.has("type") && params.get("type") !== "recovery") return null;
  if (!code && (!tokenHash || params.get("type") !== "recovery")) return null;
  return code ? { code } : { tokenHash: tokenHash! };
}
