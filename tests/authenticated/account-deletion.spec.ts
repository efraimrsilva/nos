import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { test, expect, localSql } from "./fixtures";
import { withPeer } from "./peer";

test("titular confirma por frase, cancela e apaga sem remover história da outra pessoa", async ({ page, account }, info) => {
  const nucleus = randomUUID(), agreement = randomUUID(), event = randomUUID();
  await withPeer(page, async peer => {
    try {
      localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','amigos','Núcleo preservado','Presença','${account.id}');
        insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','admin'),('${nucleus}','${peer.id}','member');
        insert into public.nucleus_agreements(id,nucleus_id,created_by,category,title,description,timing,frequency,status) values('${agreement}','${nucleus}','${account.id}','habit','Caminhada','Presença','Manhã','Diária','active');
        insert into public.nucleus_habit_moments(agreement_id,author_id,mood,note) values('${agreement}','${account.id}','good','História que permanece');
        insert into public.nucleus_events(id,nucleus_id,created_by,title,starts_at,ends_at,time_zone) values('${event}','${nucleus}','${account.id}','Encontro preservado',now()+interval '1 day',now()+interval '1 day 1 hour','UTC');
        insert into public.nucleus_event_participants(event_id,user_id,response) values('${event}','${account.id}','declined'),('${event}','${peer.id}','accepted');`);
      await page.goto("/configuracoes/conta");
      const trigger = page.getByRole("button", { name: /Apagar minha conta Ação definitiva/ });
      await expect(trigger).toBeVisible();
      expect(await trigger.locator("strong").evaluate(element => getComputedStyle(element).color)).toBe("rgb(134, 51, 58)");
      if (process.env.NOS_DELETION_GALLERY) {
        mkdirSync(process.env.NOS_DELETION_GALLERY, { recursive: true });
        await trigger.scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(process.env.NOS_DELETION_GALLERY, `app-69-opcao-${info.project.name}.png`), animations: "disabled" });
      }
      await trigger.click();
      const dialog = page.getByRole("dialog", { name: "Apagar minha conta", exact: true });
      const phrase = dialog.getByLabel("Para confirmar, digite APAGAR CONTA");
      const submit = dialog.getByRole("button", { name: "Apagar minha conta definitivamente", exact: true });
      await expect(submit).toBeDisabled();
      await phrase.fill("apagar conta");
      await expect(submit).toBeDisabled();
      await phrase.fill("APAGAR CONTA");
      await expect(submit).toBeEnabled();
      await dialog.getByRole("button", { name: "Cancelar", exact: true }).click();
      await expect(dialog).not.toBeVisible();
      expect(localSql(`select count(*) from auth.users where id='${account.id}'`).trim()).toBe("1");
      await trigger.click();
      await expect(phrase).toHaveValue("");
      await phrase.fill("APAGAR CONTA");
      await page.keyboard.press("Escape");
      await trigger.click();
      await expect(phrase).toHaveValue("");
      await phrase.fill("APAGAR CONTA");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (process.env.NOS_DELETION_GALLERY) {
        mkdirSync(process.env.NOS_DELETION_GALLERY, { recursive: true });
        await submit.scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(process.env.NOS_DELETION_GALLERY, `app-69-confirmacao-${info.project.name}.png`), animations: "disabled" });
      }
      await submit.click();
      await expect(page).toHaveURL(/\/conta\?resultado=conta-excluida$/);
      await expect(page.getByRole("status").filter({ hasText: "Sua conta foi apagada" })).toBeVisible();
      expect(localSql(`select count(*) from auth.users where id='${account.id}'`).trim()).toBe("0");
      await page.goto("/configuracoes/conta");
      await expect(page).toHaveURL(/\/conta\?.*modo=login/);
      await peer.page.goto(`http://127.0.0.1:3200/nucleos/${nucleus}/acordos/${agreement}`);
      await expect(peer.page.getByText("História que permanece", { exact: true })).toBeVisible();
      await expect(peer.page.locator(".agreement-history-author")).toContainText("Conta excluída");
      await peer.page.goto(`http://127.0.0.1:3200/nucleos/${nucleus}/agenda#evento-${event}`);
      await expect(peer.page.getByText("Criado por Conta excluída.", { exact: true })).toBeVisible();
      await expect(peer.page.getByText("1 com presença confirmada", { exact: true })).toBeVisible();
      await expect(peer.page.getByText("1 resposta(s) histórica(s) de Conta excluída.", { exact: true })).toBeVisible();
      await expect(peer.page.locator(".calendar-detail .ui-badge")).toHaveText("Confirmado");
      expect(localSql(`select role from public.nucleus_members where nucleus_id='${nucleus}' and user_id='${peer.id}'`).trim()).toBe("admin");
    } finally {
      // A autoria vira NULL na exclusão; a limpeza usa o ID específico da fixture.
      localSql(`delete from public.nuclei where id='${nucleus}'`);
    }
  });
});
