import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { messages, renderEmail, managementPayload } from "./generate-auth-emails.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const gallery = path.join(root, "Documentacao_Projeto_Nos/wireframes/comparacoes/2026-10-27-emails-personalizados");
mkdirSync(gallery, { recursive: true });
const replacements = {
  ConfirmationURL: "https://example.test/auth/v1/verify?token=EXEMPLO-SEM-VALIDADE&type=recovery&redirect_to=https%3A%2F%2Fexample.test%2Fauth%2Frecovery%3Fnext%3D%252Fcomecar%252Fconvite",
  SiteURL: "https://example.test", Token: "123456", Email: "ana@example.test", NewEmail: "novo@example.test", OldEmail: "anterior@example.test",
  Phone: "+55 11 90000-0001", OldPhone: "+55 11 90000-0000", Provider: "Google", FactorType: "TOTP",
};
const authLinks = new Set(["confirmation", "recovery", "invite", "magic_link", "email_change"]);
const payload = managementPayload();
assert.equal(messages.length, 13);
assert.equal(Object.keys(payload).length, 26);
assert.ok(Object.keys(payload).every(key => /^mailer_(subjects_.+|templates_.+_content)$/.test(key)));
assert.ok(!Object.keys(payload).some(key => /enabled|smtp|redirect/.test(key)));
const browser = await chromium.launch();
try {
  for (const message of messages) {
    const source = readFileSync(path.join(root, `supabase/templates/${message.id}.html`), "utf8");
    assert.equal(source.replaceAll("\r\n", "\n"), renderEmail(message), `Modelo desatualizado: ${message.id}`);
    assert.ok(!/<script|<form|<iframe|<img|@import|<link|onerror\s*=|onclick\s*=/i.test(source));
    assert.ok(!source.includes(".Data"));
    assert.ok(!message.subject.includes(".Token"));
    const type = { confirmation: "email", recovery: "recovery", invite: "invite", magic_link: "magiclink", email_change: "email_change" }[message.id];
    replacements.ConfirmationURL = `https://example.test/auth/v1/verify?token=EXEMPLO-SEM-VALIDADE&type=${type || "email"}&redirect_to=${encodeURIComponent(`https://example.test/auth/${message.id === "recovery" ? "recovery" : "confirm"}?next=%2Fcomecar%2Fconvite`)}`;
    if (authLinks.has(message.id)) assert.equal((source.match(/href="{{ \.ConfirmationURL }}"/g) ?? []).length, 2);
    if (message.id === "reauthentication") assert.ok(source.includes("{{ .Token }}") && !source.includes(".ConfirmationURL"));
    const preview = source.replace(/{{ \.(\w+) }}/g, (_, key) => {
      assert.ok(Object.hasOwn(replacements, key), `Variável desconhecida: ${key}`);
      return replacements[key].replaceAll("&", "&amp;");
    });
    assert.ok(!preview.includes("{{"));
    const previewFile = path.join(gallery, `${message.id}.html`);
    writeFileSync(previewFile, preview);
    for (const [device, viewport] of [["desktop", { width: 900, height: 1200 }], ["mobile", { width: 390, height: 844 }]]) {
      const page = await browser.newPage({ viewport });
      const errors = [], externalRequests = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("request", request => { if (/^https?:/.test(request.url())) externalRequests.push(request.url()); });
      await page.goto(pathToFileURL(previewFile).href);
      assert.equal(await page.locator("h1").textContent(), message.title);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${message.id}: largura ${device}`);
      const text = await page.locator("body").innerText();
      assert.ok(text.includes("Equipe Nós") && text.includes("Precisa de ajuda?"));
      if (message.action) {
        const action = page.getByRole("link", { name: message.action, exact: true });
        assert.equal(await action.getAttribute("href"), message.href === "{{ .ConfirmationURL }}" ? replacements.ConfirmationURL : message.href.replace("{{ .SiteURL }}", replacements.SiteURL));
        const box = await action.boundingBox();
        assert.ok(box && box.height >= 44 && box.x >= 0 && box.x + box.width <= viewport.width);
      }
      assert.deepEqual(errors, []);
      assert.deepEqual(externalRequests, [], "Prévia não deve carregar rastreadores, fontes ou imagens remotas.");
      await page.screenshot({ path: path.join(gallery, `${message.id}-${device}.png`), fullPage: true });
      await page.close();
    }
  }
} finally { await browser.close(); }
const cards = messages.map(message => `<article data-kind="${message.category}"><p class="kicker">${message.category === "template" ? "AUTENTICAÇÃO" : "AVISO DE SEGURANÇA"}</p><h2>${message.label}</h2><p><strong>Assunto:</strong> ${message.subject}</p><p class="status">${message.status}</p><a href="${message.id}.html">Abrir e-mail completo</a><div class="pair"><a href="${message.id}-desktop.png"><img loading="lazy" src="${message.id}-desktop.png" alt="${message.label} no computador"></a><a href="${message.id}-mobile.png"><img loading="lazy" src="${message.id}-mobile.png" alt="${message.label} no celular"></a></div></article>`).join("\n");
writeFileSync(path.join(gallery, "index.html"), `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nós · E-mails personalizados</title><style>body{margin:32px auto;max-width:1200px;padding:0 20px;background:#f5f7f1;color:#293e35;font:16px/1.6 Arial,sans-serif}h1,h2{font-family:Georgia,serif;font-weight:normal}h1{font-size:36px}h2{font-size:27px}a{color:#345d44}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:24px}article{padding:24px;background:#fffefa;border:1px solid #dce3d6;border-radius:12px;min-width:0}.kicker{font-size:11px;letter-spacing:2px}.status{font-size:13px;color:#657368}.pair{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}.pair img{width:100%;height:460px;object-fit:contain;object-position:top;background:#f5f7f1}nav{display:flex;flex-wrap:wrap;gap:12px;margin:24px 0}button{padding:10px 16px;background:#fffefa;border:1px solid #345d44;border-radius:6px;color:#345d44;cursor:pointer}[hidden]{display:none!important}</style><h1>Um cuidado em cada mensagem.</h1><p>13 modelos do Nós · 6 de autenticação e 7 avisos de segurança · 27/10/2026.</p><p>Prévias com dados fictícios e links sem validade. Confirmação e recuperação são fluxos existentes; os demais modelos não criam novas funcionalidades. Personalizar os avisos não os ativa.</p><p><strong>Aplicação no Supabase em27/10/2026:</strong> 13 assuntos e13 HTMLs aplicados e lidos de volta iguais aos arquivos locais; sete avisos mantidos desativados. Estas prévias não comprovam recebimento em uma caixa postal.</p><nav aria-label="Filtrar modelos"><button data-filter="all">Todos</button><button data-filter="template">Autenticação</button><button data-filter="notification">Segurança</button></nav><div class="grid">${cards}</div><script>document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>document.querySelectorAll('[data-kind]').forEach(card=>card.hidden=button.dataset.filter!=='all'&&card.dataset.kind!==button.dataset.filter)));</script></html>`);
console.log("13 modelos e 26 capturas aprovados: variáveis, links seguros, botões acessíveis, largura móvel e ausência de carregamentos externos.");
