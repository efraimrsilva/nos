import type { User } from "@supabase/supabase-js";

export function socialProvider(value: unknown): "google" | "apple" | null {
  return value === "google" || value === "apple" ? value : null;
}

export function authAppOrigin(value: string | undefined): string | null {
  try {
    const url = new URL(value ?? "");
    const local = url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if ((!local && url.protocol !== "https:") || url.username || url.password || url.pathname !== "/" || url.search || url.hash) return null;
    return url.origin;
  } catch { return null; }
}

type SocialAuth = {
  exchangeCodeForSession(code: string): Promise<{ data: { user: User | null }; error: unknown }>;
  updateUser(attributes: { data: { name: string } }): Promise<{ data: { user: User | null }; error: unknown }>;
};

export async function establishSocialSession(params: URLSearchParams, auth: SocialAuth): Promise<"ready" | "name" | "error"> {
  // Somente código PKCE inequívoco; erros do provedor nunca são refletidos na interface.
  const code = params.get("code");
  if (params.has("error") || params.has("error_description") || params.has("token_hash") || params.has("type") || params.getAll("code").length !== 1 || !code || code.length > 4096 || /\s/.test(code)) return "error";
  try {
    const { data, error } = await auth.exchangeCodeForSession(code);
    if (error || !data.user) return "error";
    const metadata = data.user.user_metadata;
    if (typeof metadata.name === "string" && metadata.name.trim() && metadata.name.trim().length <= 80) return "ready";
    const name = typeof metadata.full_name === "string" ? metadata.full_name.trim() : "";
    if (!name || name.length > 80) return "name";
    // Google fornece full_name; o Nós usa name nas listas/perfil, nunca para autorização.
    try {
      const saved = await auth.updateUser({ data: { name } });
      return !saved.error && saved.data.user?.id === data.user.id && saved.data.user.user_metadata.name === name ? "ready" : "name";
    } catch {
      // A sessão já foi criada; falha no nome deve permitir completar o perfil.
      return "name";
    }
  } catch { return "error"; }
}
