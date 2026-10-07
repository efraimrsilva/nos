type ConfirmationAuth = {
  exchangeCodeForSession: (code: string) => Promise<{ error: unknown }>;
  verifyOtp: (params: { token_hash: string; type: "email" }) => Promise<{ error: unknown }>;
};

export async function confirmEmailSession(params: URLSearchParams, auth: ConfirmationAuth) {
  // Valores repetidos ou credenciais misturadas não escolhem implicitamente o primeiro link.
  if (["code", "token_hash", "type"].some(name => params.getAll(name).length > 1) || (params.has("code") && params.has("token_hash"))) return false;
  const code = params.get("code");
  if (code) {
    // O template padrão do Supabase verifica o e-mail antes de redirecionar com um código PKCE.
    const { error } = await auth.exchangeCodeForSession(code);
    return !error;
  }

  const tokenHash = params.get("token_hash");
  if (tokenHash && params.get("type") === "email") {
    // Mantém compatibilidade com um template personalizado que aponta direto para esta rota.
    const { error } = await auth.verifyOtp({ token_hash: tokenHash, type: "email" });
    return !error;
  }
  return false;
}
