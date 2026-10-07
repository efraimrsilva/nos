import { NextResponse, type NextRequest } from "next/server";
import { confirmEmailSession } from "@/features/auth/confirm-email-session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";
import { safeAuthNext, withAuthNext } from "@/features/auth/input";

export async function GET(request: NextRequest) {
  const next = safeAuthNext(request.nextUrl.searchParams.getAll("next").length === 1 ? request.nextUrl.searchParams.get("next") : undefined);
  // A origem configurada preserva cookies quando o servidor usa hostname interno diferente.
  const origin = process.env.APP_ORIGIN || request.url;
  const supabase = await createSupabaseServerClient();
  if (supabase && await confirmEmailSession(request.nextUrl.searchParams, supabase.auth)) {
    return NextResponse.redirect(new URL(next, origin));
  }
  return NextResponse.redirect(new URL(withAuthNext(`${routes.account}?erro=confirmacao`, next), origin));
}
