import { test, expect, localSql } from "./fixtures";
import { randomUUID } from "node:crypto";
import { withPeer } from "./peer";
import { createClient } from "@supabase/supabase-js";
import { mkdirSync } from "node:fs";
import path from "node:path";

test("nomeação exige aceite e saída confirmada sorteia administração", async ({ page, account }) => {
  test.setTimeout(100_000);
  const nucleus = randomUUID();
  await withPeer(page, async peer => {
    try {
      localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','familia','Jardim de exemplo','Cultivar presença','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','admin'),('${nucleus}','${peer.id}','member');`);
      await page.goto(`/nucleos/${nucleus}/pessoas`);
      await page.getByLabel("Enviar nomeação; a pessoa precisará aceitar.").check();
      await page.getByRole("button", { name: "Convidar para administrar", exact: true }).click();
      await expect(page).toHaveURL(/resultado=salvo/);
      expect(localSql(`select role from public.nucleus_members where nucleus_id='${nucleus}' and user_id='${peer.id}'`).trim()).toBe("member");
      await peer.page.goto(`http://127.0.0.1:3200/nucleos/${nucleus}/pessoas`);
      await peer.page.getByLabel("Desejo assumir a administração deste Núcleo.").check();
      await peer.page.getByRole("button", { name: "Aceitar administração", exact: true }).click();
      await expect(peer.page).toHaveURL(/resultado=salvo/);
      expect(localSql(`select role from public.nucleus_members where nucleus_id='${nucleus}' and user_id='${peer.id}'`).trim()).toBe("admin");
      // Retirar o papel preserva o vínculo; saída do único admin deve sortear o membro restante.
      await page.goto(`/nucleos/${nucleus}/pessoas`);
      await page.getByLabel("A pessoa permanecerá participante, sem poderes de administração.").check();
      await page.getByRole("button", { name: "Retirar administração", exact: true }).click();
      await expect(page).toHaveURL(/resultado=salvo/);
      await page.goto("/configuracoes/privacidade");
      await page.getByLabel("Ocultar minha autoria nas interações após sair de um Núcleo").check();
      await page.getByRole("button", { name: "Salvar preferência", exact: true }).click();
      await expect(page.getByRole("status")).toContainText("Preferência salva");
      await page.goto(`/nucleos/${nucleus}/sair`);
      await expect(page.getByText(/histórico compartilhado de conversas e interações permanecerá/)).toBeVisible();
      expect(localSql(`select count(*) from public.nucleus_members where nucleus_id='${nucleus}'`).trim()).toBe("2");
      await page.getByLabel("Entendi que perderei acesso e que o histórico compartilhado permanecerá.").check();
      await page.getByRole("button", { name: "Sair deste Núcleo", exact: true }).click();
      await expect(page).toHaveURL(/\/nucleos$/);
      expect(localSql(`select role from public.nucleus_members where nucleus_id='${nucleus}' and user_id='${peer.id}'`).trim()).toBe("admin");
      await page.goto(`/nucleos/${nucleus}/pessoas`);
      await expect(page.getByRole("heading", { name: "404", exact: true })).toBeVisible();
      await peer.page.goto(`http://127.0.0.1:3200/nucleos/${nucleus}/sair`);
      await peer.page.getByLabel("Entendi que perderei acesso e que o histórico compartilhado permanecerá.").check();
      await peer.page.getByRole("button", { name: "Sair deste Núcleo", exact: true }).click();
      await expect(peer.page).toHaveURL(/\/nucleos$/);
      expect(localSql(`select closed_at is not null from public.nuclei where id='${nucleus}'`).trim()).toBe("t");
    } finally { localSql(`delete from public.nuclei where id='${nucleus}';`); }
  });
});

test("gestão e saída exigem associação; suporte mostra contato aprovado", async ({ page }) => {
  for (const suffix of ["pessoas", "sair"]) {
    await page.goto(`/nucleos/${randomUUID()}/${suffix}`);
    await expect(page.getByRole("heading", { name: "404", exact: true })).toBeVisible();
  }
  await page.goto("/ajuda");
  await expect(page.getByRole("main").locator("p").filter({ hasText: /^Sintagma Software$/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "sintagmasoftware@gmail.com", exact: true })).toHaveAttribute("href", "mailto:sintagmasoftware@gmail.com");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("saídas concorrentes fecham Núcleo e autoria oculta permanece protegida na tela", async ({ page, account }, testInfo) => {
  const nucleus = randomUUID(), habit = randomUUID(), event = randomUUID();
  await withPeer(page, async peer => {
    try {
      localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','familia','Privacidade em prática','Cuidar','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','admin'),('${nucleus}','${peer.id}','admin'); insert into public.nucleus_agreements(id,nucleus_id,created_by,category,title,description,timing,frequency,status,trial_days) values('${habit}','${nucleus}','${account.id}','habit','Vivência compartilhada','Presença','Noite','Diária','active',7); insert into public.nucleus_habit_moments(agreement_id,author_id,mood,note) values('${habit}','${account.id}','good','Uma vivência que permanece');`);
      localSql(`insert into public.nucleus_events(id,nucleus_id,created_by,title,starts_at,ends_at,time_zone) values('${event}','${nucleus}','${account.id}','Evento com autoria protegida',now()+interval '1 day',now()+interval '1 day 1 hour','UTC'); insert into public.nucleus_event_participants(event_id,user_id,response) values('${event}','${account.id}','accepted'),('${event}','${peer.id}','accepted');`);
      const gallery = process.env.NOS_ADMIN_GALLERY;
      if (gallery) {
        mkdirSync(gallery, { recursive: true });
        for (const [id, route, title] of [[13,`/nucleos/${nucleus}`,"Privacidade em prática"],[73,`/nucleos/${nucleus}/pessoas`,"Pessoas e administração"],[67,"/configuracoes/privacidade","Privacidade e visibilidade"],[70,"/ajuda","Ajuda e suporte"],[71,`/nucleos/${nucleus}/sair`,"Sair de um Núcleo"]] as const) {
          await page.goto(route);
          await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
          await page.evaluate(() => document.fonts.ready);
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
          await page.screenshot({ path: path.join(gallery, `app-${id}-${testInfo.project.name}.png`), fullPage: true });
        }
      }
      await page.goto("/configuracoes/privacidade");
      await page.getByLabel("Ocultar minha autoria nas interações após sair de um Núcleo").check();
      await page.getByRole("button", { name: "Salvar preferência", exact: true }).click();
      await expect(page.getByRole("status")).toContainText("Preferência salva");
      const own = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false } });
      expect((await own.auth.signInWithPassword({ email: account.email, password: account.password })).error).toBeNull();
      expect((await own.rpc("leave_nucleus", { target_nucleus: nucleus })).error).toBeNull();
      await peer.page.goto(`http://127.0.0.1:3200/nucleos/${nucleus}/acordos/${habit}`);
      await expect(peer.page.getByText(/Autoria oculta/)).toBeVisible();
      await expect(peer.page.getByText("Uma vivência que permanece", { exact: true })).toBeVisible();
      if (gallery) await peer.page.screenshot({ path: path.join(gallery, `app-25-${testInfo.project.name}.png`), fullPage: true });
      // Reentrada real solicita novo aceite; duas requisições de saída disputam a mesma trava.
      const code = (await peer.client.rpc("create_initial_invitation", { target_nucleus: nucleus })).data;
      const invitationCode = typeof code === "string" ? code : code?.[0]?.code;
      const storedCode = localSql(`select code from public.nucleus_invitations where nucleus_id='${nucleus}' and revoked_at is null order by created_at desc limit 1`).trim();
      expect(invitationCode || storedCode).toBeTruthy();
      expect((await own.rpc("accept_invitation", { invitation_code: storedCode })).error).toBeNull();
      // Remarcação é uma ação real do outro administrador; a presença própria continua disponível.
      expect((await peer.client.rpc("update_nucleus_event", { target_event: event, event_title: "Evento com autoria protegida", event_intention: "", event_starts_at: new Date(Date.now() + 172_800_000).toISOString(), event_ends_at: new Date(Date.now() + 176_400_000).toISOString(), event_time_zone: "UTC" })).error).toBeNull();
      await page.goto(`/nucleos/${nucleus}/agenda`);
      await expect(page.getByText("Sua resposta: ainda não respondi.")).toBeVisible();
      await page.getByRole("button", { name: "Posso participar", exact: true }).click();
      await expect(page).toHaveURL(/resultado=resposta/);
      await expect(page.getByText("Sua resposta: vou participar.")).toBeVisible();
      const results = await Promise.all([own.rpc("leave_nucleus", { target_nucleus: nucleus }), peer.client.rpc("leave_nucleus", { target_nucleus: nucleus })]);
      for (const result of results) expect(result.error).toBeNull();
      expect(localSql(`select count(*) from public.nucleus_members where nucleus_id='${nucleus}'`).trim()).toBe("0");
      expect(localSql(`select closed_at is not null from public.nuclei where id='${nucleus}'`).trim()).toBe("t");
      expect((await own.rpc("accept_invitation", { invitation_code: storedCode })).error).toBeTruthy();
    } finally { localSql(`delete from public.nuclei where id='${nucleus}';`); }
  });
});
