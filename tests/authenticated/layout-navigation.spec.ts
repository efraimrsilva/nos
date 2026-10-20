import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { test, expect, localSql } from "./fixtures";

test("layout vigente integra áreas reais, esboços, busca, menu e isolamento", async ({ page, account }, testInfo) => {
  test.setTimeout(180_000);
  await page.setViewportSize(testInfo.project.name === "desktop" ? { width: 1440, height: 1000 } : { width: 390, height: 844 });
  const nucleus = randomUUID(), habit = randomUUID(), proposal = randomUUID(), event = randomUUID();
  localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','familia','Nosso jardim de teste','Ter presença nos pequenos gestos, com espaço para cada pessoa.','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','admin'); insert into public.nucleus_agreements(id,nucleus_id,created_by,category,title,description,timing,frequency,status,trial_days) values('${habit}','${nucleus}','${account.id}','habit','Uma refeição com presença','Um tempo tranquilo, sem distrações.','No jantar','Três vezes por semana','testing',7),('${proposal}','${nucleus}','${account.id}','habit','Uma caminhada para conversar','Estar juntos ao ar livre.','Domingo','Semanal','pending',7); insert into public.nucleus_events(id,nucleus_id,created_by,title,intention,starts_at,ends_at,time_zone) values('${event}','${nucleus}','${account.id}','Café e conversa','Uma pausa para estar perto.',now()+interval '1 day',now()+interval '1 day 1 hour','America/Sao_Paulo'); insert into public.nucleus_event_participants(event_id,user_id,response) values('${event}','${account.id}','pending');`);
  const base = `/nucleos/${nucleus}`;
  // A rota de registro só pode abrir para quem aceitou os termos vigentes do hábito.
  localSql(`insert into public.nucleus_agreement_participants(agreement_id,user_id,response,accepted_version,responded_at) values('${habit}','${account.id}','accepted',1,now()) on conflict(agreement_id,user_id) do update set response='accepted',accepted_version=1,responded_at=now();`);
  await page.goto(base);
  await expect(page.getByRole("main").getByRole("heading", { name: "Nosso jardim de teste", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Buscar uma área" }).click();
  const searchDialog = page.getByRole("dialog", { name: "Encontre seu caminho" });
  await expect(searchDialog).toBeVisible();
  await searchDialog.getByLabel("Buscar uma área do Nós").fill("Agenda");
  await searchDialog.getByRole("link", { name: "Agenda", exact: true }).click();
  await expect(page).toHaveURL(`${testInfo.project.use.baseURL ?? "http://127.0.0.1:3200"}${base}/agenda`);
  await expect(page.getByRole("heading", { name: "Tempo para o que importa.", exact: true })).toBeVisible();
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Mais áreas e preferências" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Árvore e memórias" }).click();
  } else await page.getByRole("navigation", { name: "Áreas do Nós" }).getByRole("link", { name: "Árvore e memórias" }).click();
  await expect(page).toHaveURL(new RegExp(`${base}/arvore$`));
  await expect(page.getByRole("note").getByText("Esboço de funcionalidade · ainda não desenvolvido", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Notificações — esboço" }).click();
  await expect(page.getByRole("dialog", { name: "Novidades, no seu tempo." })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto(`${base}/acordos`);
  if (testInfo.project.name === "desktop") {
    await page.getByRole("button", { name: "Painéis · Lado a lado" }).click();
    await page.getByRole("navigation", { name: "Selecionar acordo" }).getByRole("button", { name: /Uma refeição com presença/ }).click();
    await expect(page.locator("#selected-agreement").getByRole("heading", { name: "Uma refeição com presença", exact: true })).toBeVisible();
    await page.getByLabel("Buscar nos acordos desta página").fill("caminhada");
    await expect(page.locator("#selected-agreement").getByRole("heading", { name: "Uma caminhada para conversar", exact: true })).toBeVisible();
    await page.getByLabel("Buscar nos acordos desta página").fill("");
    await page.getByRole("button", { name: "Kanban · Fluxo" }).click();
  } else await expect(page.locator(".agreements-view-switch")).toBeHidden();
  if (testInfo.project.name === "desktop") await expect(page.getByRole("main").getByRole("heading", { name: "Propostas", exact: true })).toBeVisible();
  else { await expect(page.getByRole("list", {name:"Lista de acordos"})).toBeVisible(); await expect(page.locator(".agreements-board")).toHaveCount(0); }

  const gallery = process.env.NOS_LAYOUT_GALLERY;
  if (gallery) mkdirSync(gallery, { recursive: true });
  // O conjunto visita todas as famílias de páginas; não envia os formulários durante as capturas.
  const routes: [string, string][] = [
    ["nucleos", "/nucleos"], ["inicio", base], ["agenda", `${base}/agenda`], ["pessoas", `${base}/pessoas`], ["convites", `${base}/convites`],
    ["acordos", `${base}/acordos`], ["habito", `${base}/acordos/${habit}`], ["registrar", `${base}/acordos/${habit}/registrar`], ["revisar", `${base}/acordos/${habit}/revisar`], ["confirmar", `${base}/acordos/${habit}/confirmar`],
    ...["arvore", "memorias", "conexoes", "perfis", "manifesto", "cuidado"].map(section => [section, `${base}/${section}`] as [string, string]),
    ["comecar", "/comecar"], ["tipo", "/comecar/tipo"], ["proposito", "/comecar/proposito?tipo=familia"], ["convite", "/comecar/convite"], ["conta", "/conta"], ["configuracoes", "/configuracoes"], ["privacidade", "/configuracoes/privacidade"], ["seguranca", "/configuracoes/conta"], ["ajuda", "/ajuda"], ["sair", `${base}/sair`],
  ];
  const titles: Record<string, string> = {
    nucleos:"Seus Núcleos", inicio:"Nosso jardim de teste", agenda:"Tempo para o que importa.", pessoas:"Cada pessoa tem seu lugar.", convites:"Um convite para estar perto.", acordos:"Cada combinado no seu tempo.", habito:"Uma refeição com presença", registrar:"Registrar momento", revisar:"Termos e histórico do acordo", confirmar:"Período e administração do hábito",
    arvore:"Raízes no que vivemos.", memorias:"Há instantes que ficam.", conexoes:"Conhecer para cuidar.", perfis:"Um jeito único de estar no Nós.", manifesto:"O que escolhemos cultivar.", cuidado:"Conversar também é um cuidado.",
    comecar:"Como você quer começar?", tipo:"Que relação vocês têm?", proposito:"Qual o propósito de vocês?", convite:"Você recebeu um convite?", conta:"Seu espaço também merece cuidado.", configuracoes:"Privacidade com clareza.", privacidade:"Privacidade e visibilidade", seguranca:"Conta e segurança", ajuda:"Ajuda e suporte", sair:"Sair de um Núcleo",
  };
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [label, route] of routes) {
    await page.goto(route);
    await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toHaveText(titles[label]);
    // O Next pode manter um fallback oculto durante o streaming; conte a estrutura realmente visível.
    await expect(page.locator("[data-layout='current']:visible")).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label} sem transbordamento`).toBe(true);
    if (gallery) await page.screenshot({ path: path.join(gallery, `${label}-${testInfo.project.name}.png`), fullPage: true });
  }
  if (testInfo.project.name === "desktop") {
    for (const width of [768, 1024]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const [label, route] of routes.filter(([label]) => ["inicio", "agenda", "acordos", "conexoes", "cuidado"].includes(label))) {
        await page.goto(route);
        await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toHaveText(titles[label]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label} em ${width}px`).toBe(true);
        if (gallery) await page.screenshot({ path: path.join(gallery, `${label}-${width}.png`), fullPage: true });
      }
    }
  }
  await page.goto(`${base}/cuidado`);
  await page.getByLabel("O que você quer expressar?").fill("Quero um tempo para escutar.");
  await page.getByRole("button", { name: "Explorar preparação" }).click();
  await expect(page.getByRole("region", { name: "Preparação ilustrativa" })).toContainText("nada foi enviado");
  await page.reload();
  await expect(page.getByLabel("O que você quer expressar?")).toHaveValue("");
  for (const section of ["arvore", "memorias", "conexoes", "perfis", "manifesto", "cuidado"]) {
    await page.goto(`/nucleos/${randomUUID()}/${section}`);
    await expect(page.getByRole("heading", { name: "404", exact: true })).toBeVisible();
  }
  expect(localSql(`select count(*) from public.nucleus_agreements where nucleus_id='${nucleus}'`).trim()).toBe("2");
  expect(localSql(`select count(*) from public.nucleus_habit_moments where agreement_id='${habit}'`).trim()).toBe("0");
});
