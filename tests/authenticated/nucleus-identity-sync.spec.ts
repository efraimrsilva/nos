import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { test, expect, localSql } from "./fixtures";
import { withPeer } from "./peer";

const gallery = path.resolve(process.env.NOS_IDENTITY_SYNC_GALLERY || "artifacts/regression-captures/identity-sync");

test("integrante recebe nome e propósito sem recarregar nem fechar integrantes", async ({ page, account }, info) => {
  await withPeer(page, async peer => {
    const id = randomUUID();
    localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${id}','familia','Jardim inicial','Propósito inicial','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${id}','${account.id}','admin'),('${id}','${peer.id}','member');`);
    await page.goto(`/nucleos/${id}`);
    await peer.page.goto(`http://127.0.0.1:3200/nucleos/${id}`);
    mkdirSync(gallery, { recursive: true });
    await peer.page.screenshot({ path: path.join(gallery, `identidade-anterior-${info.project.name}.png`), fullPage: true });
    await peer.page.getByRole("button", { name: "Ver integrantes", exact: true }).click();
    const origin = await peer.page.evaluate(() => performance.timeOrigin);
    for (const [field, label, value] of [["name", "nome", "Jardim compartilhado"], ["purpose", "propósito", "Cultivar presença em conjunto"]]) {
      await page.getByRole("button", { name: `Editar ${label} do Núcleo`, exact: true }).click();
      const dialog = page.getByRole("dialog", { name: `Editar ${label} do Núcleo`, exact: true });
      await dialog.locator(`[name="${field}"]`).fill(value);
      await dialog.getByRole("checkbox").check();
      await dialog.getByRole("button", { name: `Salvar ${label}`, exact: true }).click();
      await expect(dialog.getByRole("status")).toContainText("atualizado");
      await page.keyboard.press("Escape");
      await expect(peer.page.locator(field === "name" ? ".nucleus-identity-line h1" : ".nucleus-purpose-line p")).toHaveText(value, { timeout: 15_000 });
    }
    await expect(peer.page.getByRole("dialog", { name: "Integrantes do Núcleo", exact: true })).toBeVisible();
    expect(await peer.page.evaluate(() => performance.timeOrigin)).toBe(origin);
    await expect(peer.page.getByRole("button", { name: /^Editar (nome|propósito) do Núcleo/ })).toHaveCount(0);
    await peer.page.keyboard.press("Escape");
    await peer.page.screenshot({ path: path.join(gallery, `identidade-sincronizada-${info.project.name}.png`), fullPage: true });
  });
});

test("recupera falha de consulta e conexão e atualiza seletor aberto da Conta", async ({ page, account }) => {
  await withPeer(page, async peer => {
    const id = randomUUID();
    localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${id}','familia','Jardim conectado','Escuta','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${id}','${account.id}','admin'),('${id}','${peer.id}','member');`);
    await peer.page.goto("http://127.0.0.1:3200/conta");
    await peer.page.locator(".account-workspace").getByRole("button", { name: /^Sair de um Núcleo/ }).click();
    const dialog = peer.page.getByRole("dialog", { name: "Sair de um Núcleo", exact: true });
    await expect(dialog.getByRole("heading", { name: "Jardim conectado", exact: true })).toBeVisible();
    const origin = await peer.page.evaluate(() => performance.timeOrigin);
    let failures = 0;
    await peer.page.route("**/*", async route => {
      if (route.request().headers()["next-action"]) { failures++; await route.abort("failed"); }
      else await route.continue();
    });
    expect((await peer.client.rpc("get_nucleus_management", { target_nucleus: id })).error).toBeNull();
    localSql(`update public.nuclei set name='Jardim recuperado' where id='${id}';`);
    await expect.poll(() => failures, { timeout: 10_000 }).toBeGreaterThan(0);
    await expect(dialog.getByRole("heading", { name: "Jardim conectado", exact: true })).toBeVisible();
    await peer.page.unrouteAll({ behavior: "wait" });
    await expect(dialog.getByRole("heading", { name: "Jardim recuperado", exact: true })).toBeVisible({ timeout: 15_000 });
    await peer.page.context().setOffline(true);
    localSql(`update public.nuclei set name='Jardim reconectado' where id='${id}';`);
    await peer.page.context().setOffline(false);
    await expect(dialog.getByRole("heading", { name: "Jardim reconectado", exact: true })).toBeVisible({ timeout: 15_000 });
    expect(await peer.page.evaluate(() => performance.timeOrigin)).toBe(origin);
    await expect(dialog).toBeVisible();
  });
});

test("lista, contexto e rascunho acompanham alterações de outra sessão", async ({ page, account }) => {
  await withPeer(page, async peer => {
    const id = randomUUID();
    localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${id}','familia','Jardim anterior','Escuta inicial','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${id}','${account.id}','admin'),('${id}','${peer.id}','admin');`);
    await page.goto(`/nucleos/${id}`);
    await peer.page.goto("http://127.0.0.1:3200/nucleos");
    const listOrigin = await peer.page.evaluate(() => performance.timeOrigin);
    await page.getByRole("button", { name: "Editar propósito do Núcleo", exact: true }).click();
    const draft = page.getByRole("dialog", { name: "Editar propósito do Núcleo", exact: true });
    await draft.getByRole("textbox").fill("Meu rascunho preservado");
    await draft.getByRole("checkbox").check();
    expect((await peer.client.rpc("update_nucleus_identity", { target_nucleus: id, identity_field: "name", identity_value: "Jardim sincronizado" })).error).toBeNull();
    await expect(peer.page.getByRole("heading", { name: "Jardim sincronizado", exact: true })).toBeVisible({ timeout: 15_000 });
    await expect(page.locator(".nucleus-identity-line h1")).toHaveText("Jardim sincronizado", { timeout: 15_000 });
    await expect(draft).toBeVisible();
    await expect(draft.getByRole("textbox")).toHaveValue("Meu rascunho preservado");
    await expect(draft.getByRole("checkbox")).toBeChecked();
    expect(await peer.page.evaluate(() => performance.timeOrigin)).toBe(listOrigin);
    await peer.page.goto(`http://127.0.0.1:3200/nucleos/${id}/acordos`);
    const contextOrigin = await peer.page.evaluate(() => performance.timeOrigin);
    expect((await peer.client.rpc("update_nucleus_identity", { target_nucleus: id, identity_field: "name", identity_value: "Jardim atual" })).error).toBeNull();
    await expect(peer.page.locator(".mobile-navigation:visible, .desktop-navigation:visible").getByRole("link", { name: "Início · Jardim atual", exact: true })).toBeVisible({ timeout: 15_000 });
    expect(await peer.page.evaluate(() => performance.timeOrigin)).toBe(contextOrigin);
  });
});
