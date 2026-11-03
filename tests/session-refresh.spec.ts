import { expect, test } from "@playwright/test";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { runInNewContext } from "node:vm";
import { authCookieOptions } from "../src/lib/supabase/cookie-options";
import { safeAuthNext } from "../src/features/auth/input";
import { isNucleusAuthUnavailable } from "../src/features/nuclei/nucleus-access";

// Exercita o proxy e a biblioteca SSR reais; somente o transporte Auth é simulado.
for (const expiredFor of [60, 24 * 60 * 60]) {
  test(`sessão expirada há ${expiredFor}s renova e devolve cookies persistentes`, async () => {
    const url = "https://session-check.supabase.co";
    const user = { id: "12345678-1234-4234-8234-123456789abc", aud: "authenticated", role: "authenticated", email: "session@example.test", app_metadata: {}, user_metadata: {}, created_at: new Date(0).toISOString() };
    const token = (exp: number) => `${Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")}.${Buffer.from(JSON.stringify({ sub: user.id, exp, role: "authenticated" })).toString("base64url")}.test-signature`;
    const now = Math.floor(Date.now() / 1000);
    const access = token(now + 3600);
    let refreshes = 0;
    const transport: typeof fetch = async (input, init) => {
      const endpoint = String(input);
      if (endpoint.includes("/token?grant_type=refresh_token")) {
        refreshes++;
        expect(JSON.parse(String(init?.body)).refresh_token).toBe("valid-test-refresh");
        return Response.json({ access_token: access, refresh_token: "renewed-test-refresh", token_type: "bearer", expires_in: 3600, user });
      }
      if (endpoint.endsWith("/user")) return Response.json(user);
      throw new Error(`Transporte não esperado: ${endpoint}`);
    };
    const source = stripTypeScriptTypes(readFileSync("src/proxy.ts", "utf8"))
      .replace(/^import .*;\r?\n/gm, "").replace(/export async function/g, "async function").replace(/export const/g, "const");
    const proxy = runInNewContext(`${source}\nproxy;`, {
      NextResponse, URL, URLSearchParams, authCookieOptions, safeAuthNext, isNucleusAuthUnavailable,
      isSupabaseConfigured: () => true,
      process: { env: { NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "test-key" } },
      createServerClient: (_url: string, _key: string, options: Parameters<typeof createServerClient>[2]) => createServerClient(url, "test-key", { ...options, global: { fetch: transport } }),
    });
    const session = { access_token: token(now - expiredFor), refresh_token: "valid-test-refresh", expires_at: now - expiredFor, expires_in: 3600, token_type: "bearer", user };
    const cookieName = "sb-session-check-auth-token";
    const request = new NextRequest("https://app.example.test/nucleos", { headers: { cookie: `${cookieName}=base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}` } });
    const response: NextResponse = await proxy(request);
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(refreshes).toBe(1);
    const renewed = response.cookies.getAll().filter(cookie => cookie.name.startsWith(cookieName) && cookie.value);
    expect(renewed.length).toBeGreaterThan(0);
    for (const cookie of renewed) {
      expect(cookie.httpOnly).toBe(true);
      expect(cookie.sameSite).toBe("lax");
      expect(cookie.maxAge).toBeGreaterThan(24 * 60 * 60);
    }
    // A próxima requisição já recebe o token renovado, sem repetir o refresh.
    await proxy(new NextRequest("https://app.example.test/nucleos", { headers: { cookie: renewed.map(cookie => `${cookie.name}=${cookie.value}`).join("; ") } }));
    expect(refreshes).toBe(1);
  });
}
