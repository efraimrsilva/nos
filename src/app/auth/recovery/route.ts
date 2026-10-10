import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { authCookieOptions } from "@/lib/supabase/cookie-options";
import { recoveryCookie, recoveryLifetime, recoverySecret, signRecoveryProof } from "@/features/auth/recovery-proof";
import { safeAuthNext, withAuthNext } from "@/features/auth/input";
import { parseRecoveryCredentials } from "@/features/auth/recovery-credentials";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const next = safeAuthNext(params.getAll("next").length === 1 ? params.get("next") : undefined);
  const jar = await cookies();
  jar.delete(recoveryCookie);
  const origin = process.env.APP_ORIGIN || request.url;
  const failure = () => NextResponse.redirect(new URL(withAuthNext("/conta/nova-senha?erro=link", next), origin));
  const credentials = parseRecoveryCredentials(params);
  if (!credentials) return failure();
  const supabase = await createSupabaseServerClient();
  const key = recoverySecret();
  if (!supabase || !key) return failure();
  // Token direto exige tipo recovery. No PKCE, o método vem do JWT assinado pelo Auth,
  // nunca do parâmetro type ou do redirectType derivado de um cookie do navegador.
  const result = credentials.code ? await supabase.auth.exchangeCodeForSession(credentials.code) : await supabase.auth.verifyOtp({ token_hash: credentials.tokenHash!, type: "recovery" });
  if (result.error || !result.data.session) return failure();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const session = claims?.session_id;
  if (error || typeof session !== "string" || claims?.sub !== result.data.user?.id) return failure();
  if (credentials.code && !claims?.amr?.some(entry => (typeof entry === "string" ? entry : entry.method) === "recovery")) {
    await supabase.auth.signOut({ scope: "local" });
    return failure();
  }
  jar.set(recoveryCookie, signRecoveryProof(result.data.user!.id, session, key), { ...authCookieOptions, path: "/", maxAge: recoveryLifetime });
  // Remove código/token da URL antes de renderizar qualquer formulário ou carregar recursos.
  return NextResponse.redirect(new URL(withAuthNext("/conta/nova-senha", next), origin));
}
