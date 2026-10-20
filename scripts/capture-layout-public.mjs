import fs from "node:fs";
import { chromium, expect } from "@playwright/test";

const origin = process.env.NOS_VERIFY_ORIGIN || "http://127.0.0.1:3000";
if (!/^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/.test(origin)) throw new Error("Capturas restritas ao aplicativo local.");
const output = process.env.NOS_CAPTURE_DIR || "artifacts/layout-rebuild-public";
fs.mkdirSync(output, { recursive:true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ reducedMotion:"reduce" });
  const pages = [["conta-cadastro","/conta"],["conta-login","/conta?modo=login"],["boas-vindas","/boas-vindas"],["recuperar","/conta/recuperar"],["confirmar-email","/conta/confirmar-email"],["nova-senha","/conta/nova-senha"],["404","/pagina-inexistente"]];
  const titles = { "conta-cadastro":"Sua conta no Nós", "conta-login":"Sua conta no Nós", "boas-vindas":"Fortalecendo os laços que unem quem você ama.", recuperar:"Recuperar acesso", "confirmar-email":"Confirmar e-mail", "nova-senha":"Redefinir senha", "404":"404" };
  for (const [label,width,height] of [["desktop",1440,1000],["mobile",390,844],["640",640,1000]]) {
    await page.setViewportSize({width,height});
    for (const [name,route] of pages) {
      await page.goto(`${origin}${route}`);
      await expect(page.getByRole("main").getByRole("heading", {level:1})).toHaveText(titles[name]);
      if (!await page.locator('[data-layout-revision="3"]').count()) throw new Error(`Estrutura atual ausente: ${route}`);
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error(`Transbordamento: ${route} em ${width}px`);
      await page.screenshot({path:`${output}/${name}-${label}.png`,fullPage:true});
    }
  }
  console.log("21 capturas públicas:1440/390/640px, sem transbordamento.");
} finally { await browser.close(); }
