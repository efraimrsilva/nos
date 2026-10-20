import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { test as base, expect, localSql } from "./fixtures";

// Duas identidades reais no backend local: o criador convida e outra pessoa decide entrar.
const test = base.extend<{ invitation: { code: string; nucleusId: string; ownerId: string } }>({
  invitation: async ({}, use) => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const admin = createClient(url, process.env.SUPABASE_LOCAL_SERVICE_KEY!, { auth: { persistSession: false } });
    const email = `invite-${randomUUID()}@example.test`, password = `Aa1!${randomUUID()}`;
    const owner = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (owner.error || !owner.data.user) throw new Error("Não foi possível criar o autor local do convite.");
    const ownerId = owner.data.user.id;
    try {
      const client = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false } });
      if ((await client.auth.signInWithPassword({ email, password })).error) throw new Error("Falha no login do criador.");
      const nucleus = await client.rpc("create_nucleus", { nucleus_type: "familia", nucleus_name: "Jardim do convite", nucleus_purpose: "Cultivar respeito e presença." });
      if (nucleus.error) throw new Error(nucleus.error.message);
      const invitation = await client.rpc("create_initial_invitation", { target_nucleus: nucleus.data });
      if (invitation.error) throw new Error(invitation.error.message);
      await use({ code: invitation.data, nucleusId: nucleus.data, ownerId });
    } finally {
      localSql(`delete from public.nuclei where created_by='${ownerId}';`);
      if ((await admin.auth.admin.deleteUser(ownerId)).error) throw new Error("Falha na limpeza do criador local.");
    }
  },
});

test("Atlas e aplicativo autenticado mantêm composição, estados e percursos", async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "O verificador já cobre desktop e celular.");
  test.setTimeout(120_000);
  // A sessão chega ao comparador somente em memória; nenhum cookie entra nos registros ou capturas.
  execFileSync(process.execPath, ["Documentacao_Projeto_Nos/wireframes/tools/verify-fidelity.mjs"], {
    env: { ...process.env, NOS_VERIFY_ORIGIN: "http://127.0.0.1:3200", NOS_VERIFY_COOKIES: JSON.stringify(await context.cookies()) },
    stdio: "inherit",
  });
  const atlas = await context.newPage();
  await atlas.goto(pathToFileURL(path.resolve("Documentacao_Projeto_Nos/wireframes/atlas/index.html")).href);
  // Capturas de regressão ficam nos artefatos; galerias versionadas são evidências históricas imutáveis.
  const dir = "artifacts/current-layout-invitation";
  for (const [label, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 390, height: 844 }]] as const) {
    await page.setViewportSize(viewport);
    await page.goto("/comecar/convite");
    await page.screenshot({ path: `${dir}/app-entrada-${label}.png`, fullPage: true });
    await atlas.setViewportSize(viewport);
    for (const id of [10, 11]) {
      await atlas.evaluate(id => (window as unknown as { openScreen: (id: number) => void }).openScreen(id), id);
      await atlas.locator("#screen-preview").screenshot({ path: `${dir}/atlas-${id}-depois-${label}.png` });
    }
  }
  await atlas.close();
});

test("conferir permite conhecer o tipo e adiar sem criar associação", async ({ page, account, invitation }) => {
  await page.goto(`/nucleos/${invitation.nucleusId}`);
  await expect(page.getByRole("heading", { name: "Jardim do convite" })).toHaveCount(0);
  await page.goto("/comecar/convite");
  await page.getByLabel("Código de convite").fill(invitation.code.toUpperCase());
  await page.getByRole("button", { name: "Conferir convite" }).click();
  const preview = page.getByRole("region", { name: "Prévia do convite" });
  await expect(preview).toContainText("Família");
  await expect(preview).toContainText("Cultivar respeito e presença.");
  await page.getByRole("link", { name: "Agora não" }).click();
  await expect(page).toHaveURL(/\/nucleos$/);
  expect(localSql(`select count(*) from public.nucleus_members where nucleus_id='${invitation.nucleusId}' and user_id='${account.id}';`).trim()).toBe("0");
});

test("chegada direta pede login e retorna ao convite sem aceitar", async ({ page, context, account }) => {
  await context.clearCookies();
  await page.goto("/comecar/convite");
  await expect(page).toHaveURL(/\/conta\?modo=login&next=%2Fcomecar%2Fconvite$/);
  await page.getByLabel("E-mail", { exact: true }).fill(account.email);
  await page.getByLabel("Senha", { exact: true }).fill(account.password);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL(/\/comecar\/convite$/);
  await expect(page.getByRole("button", { name: "Aceitar convite" })).toHaveCount(0);
  expect(localSql(`select count(*) from public.nucleus_members where user_id='${account.id}';`).trim()).toBe("0");
});

test("editar código remove a prévia e o aceite anterior", async ({ page, invitation }) => {
  await page.goto("/comecar/convite");
  await page.getByLabel("Código de convite").fill(invitation.code);
  await page.getByRole("button", { name: "Conferir convite" }).click();
  await expect(page.getByRole("button", { name: "Aceitar convite" })).toBeVisible();
  await page.getByLabel("Código de convite").fill("a".repeat(32));
  await expect(page.getByRole("button", { name: "Aceitar convite" })).toHaveCount(0);
  await page.getByRole("button", { name: "Conferir convite" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Convite não encontrado");
});

for (const state of ["expirado", "revogado"] as const) {
  test(`convite ${state} não revela prévia nem permite entrar`, async ({ page, account, invitation }) => {
    const assignment = state === "expirado" ? "expires_at=now()-interval '1 minute'" : "revoked_at=now()";
    localSql(`update public.nucleus_invitations set ${assignment} where nucleus_id='${invitation.nucleusId}';`);
    await page.goto("/comecar/convite");
    await page.getByLabel("Código de convite").fill(invitation.code);
    await page.getByRole("button", { name: "Conferir convite" }).click();
    await expect(page.getByRole("main").getByRole("alert")).toContainText("Convite não encontrado");
    await expect(page.getByRole("region", { name: "Prévia do convite" })).toHaveCount(0);
    expect(localSql(`select count(*) from public.nucleus_members where nucleus_id='${invitation.nucleusId}' and user_id='${account.id}';`).trim()).toBe("0");
  });
}

test("revogação após conferir bloqueia aceite e permite tentar outro código", async ({ page, account, invitation }) => {
  await page.goto("/comecar/convite");
  await page.getByLabel("Código de convite").fill(invitation.code);
  await page.getByRole("button", { name: "Conferir convite" }).click();
  await expect(page.getByRole("button", { name: "Aceitar convite" })).toBeVisible();
  localSql(`update public.nucleus_invitations set revoked_at=now() where nucleus_id='${invitation.nucleusId}';`);
  await page.getByRole("button", { name: "Aceitar convite" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("não está mais disponível");
  expect(localSql(`select count(*) from public.nucleus_members where nucleus_id='${invitation.nucleusId}' and user_id='${account.id}';`).trim()).toBe("0");
  await page.getByLabel("Código de convite").fill("abc");
  await expect(page.getByRole("main").getByRole("alert")).toHaveCount(0);
});

test("aceite explícito abre Início e lista sem duplicar nem elevar o papel", async ({ page, account, invitation }, testInfo) => {
  await page.goto("/nucleos");
  await page.getByRole("link", { name: /Entrar com um convite/ }).click();
  await page.getByLabel("Código de convite").fill(invitation.code);
  await page.getByRole("button", { name: "Conferir convite" }).click();
  await expect(page.getByRole("button", { name: "Aceitar convite" })).toBeVisible();
  // Capturas usam somente texto ilustrativo; o código temporário é ocultado antes de gravar.
  await page.screenshot({ path: `artifacts/regression-captures/v0.13.3-2026-10-10-entrar-convite-tela_10-tela_11/app-previa-${testInfo.project.name}.png`, fullPage: true, mask: [page.getByLabel("Código de convite")], maskColor: "#eff3e6" });
  await page.getByRole("button", { name: "Aceitar convite" }).click();
  await expect(page).toHaveURL(new RegExp(`/nucleos/${invitation.nucleusId}$`));
  await expect(page.getByRole("heading", { name: "Jardim do convite" })).toBeVisible();
  await page.goto("/comecar/convite");
  await page.getByLabel("Código de convite").fill(invitation.code);
  await page.getByRole("button", { name: "Conferir convite" }).click();
  await page.getByRole("button", { name: "Aceitar convite" }).click();
  await expect(page).toHaveURL(new RegExp(`/nucleos/${invitation.nucleusId}$`));
  expect(localSql(`select count(*) from public.nucleus_members where nucleus_id='${invitation.nucleusId}' and user_id='${account.id}' and role='member';`).trim()).toBe("1");
  expect(localSql(`select role from public.nucleus_members where nucleus_id='${invitation.nucleusId}' and user_id='${invitation.ownerId}';`).trim()).toBe("admin");
  await page.getByRole("main").getByRole("link", { name: "Seus Núcleos", exact: true }).click();
  await expect(page.getByRole("link", { name: "Abrir Núcleo Jardim do convite", exact: true })).toBeVisible();
});
