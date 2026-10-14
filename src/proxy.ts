import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { authCookieOptions } from "@/lib/supabase/cookie-options";
import { safeAuthNext } from "@/features/auth/input";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const protectedPage = /^\/(?:comecar|nucleos|configuracoes|ajuda)(?:\/|$)/.test(path);
  const loginRedirect = () => {
    const login = new URL("/conta", request.url);
    login.searchParams.set("modo", "login");
    const navigation = new URLSearchParams(request.nextUrl.search);
    // _rsc é transporte interno do Next; avisos de ações não precisam atravessar um novo login.
    navigation.delete("_rsc");
    navigation.delete("resultado");
    login.searchParams.set("next", safeAuthNext(path + (navigation.size ? `?${navigation}` : "")));
    // Ações enviadas por fetch usam o protocolo do App Router; um 307 repetiria o POST no login.
    if (request.method === "POST" && request.headers.has("next-action")) {
      return new NextResponse(null, { status: 303, headers: { "x-action-redirect": `${login.href};push` } });
    }
    return NextResponse.redirect(login, request.method === "POST" ? 303 : 307);
  };
  if (!isSupabaseConfigured()) return protectedPage ? loginRedirect() : NextResponse.next({ request });
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: authCookieOptions,
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
        },
      },
    },
  );
  // getUser consulta o Auth; cookies locais sozinhos não autorizam operações protegidas.
  const { data: { user }, error } = await supabase.auth.getUser();
  if (protectedPage) {
    // Indisponibilidade não equivale a logout; em ambos os casos nenhum conteúdo privado é liberado.
    const blocked = isNucleusAuthUnavailable(error)
      ? new NextResponse("Não foi possível conferir sua sessão. Tente novamente em instantes.", { status: 503 })
      : !user ? loginRedirect() : null;
    if (blocked) {
      // Limpeza/renovação do SSR deve chegar ao navegador também quando a resposta é um redirecionamento.
      response.cookies.getAll().forEach(cookie => blocked.cookies.set(cookie));
      for (const header of ["cache-control", "expires", "pragma"]) {
        const value = response.headers.get(header);
        if (value) blocked.headers.set(header, value);
      }
      blocked.headers.set("Cache-Control", "private, no-store");
      return blocked;
    }
    response.headers.set("Cache-Control", "private, no-store");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
