import { NextResponse, type NextRequest } from "next/server";
import { confirmEmailSession } from "@/features/auth/confirm-email-session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  if (supabase && await confirmEmailSession(request.nextUrl.searchParams, supabase.auth)) {
    return NextResponse.redirect(new URL(routes.start, request.url));
  }
  return NextResponse.redirect(new URL(`${routes.account}?erro=confirmacao`, request.url));
}
