import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeAuthNext, withAuthNext } from "@/features/auth/input";
import { authAppOrigin, establishSocialSession } from "@/features/auth/social-session";
import { recoveryCookie } from "@/features/auth/recovery-proof";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const next = safeAuthNext(params.getAll("next").length === 1 ? params.get("next") : undefined);
  const origin = authAppOrigin(process.env.APP_ORIGIN);
  const respond = (path: string) => {
    const response = NextResponse.redirect(new URL(path, origin ?? request.nextUrl.origin));
    // O callback contém credencial temporária; não armazenar nem enviar a URL como Referer.
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  };
  const cancelled = params.getAll("error").length === 1 && params.get("error") === "access_denied" && !params.has("code");
  const failed = () => respond(withAuthNext(`/conta?modo=login&erro=${cancelled ? "social-cancelado" : "social"}`, next));
  if (!origin || params.has("error")) return failed();
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return failed();
    const result = await establishSocialSession(params, supabase.auth);
    if (result === "error") return failed();
    // A entrada social, como a entrada por senha, encerra a prova anterior de recuperação.
    (await cookies()).delete(recoveryCookie);
    return respond(result === "name" ? withAuthNext("/conta?completar=nome", next) : next);
  } catch { return failed(); }
}
