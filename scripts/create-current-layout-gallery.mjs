// Consome capturas das suítes locais; nunca modifica as galerias de versões anteriores.
import fs from "node:fs";
import path from "node:path";

const { version } = JSON.parse(fs.readFileSync("package.json", "utf8"));
const date = "2026-10-18";
const folder = `v${version}-${date}-layout-atual-tela_01-a-tela_73`;
const root = path.resolve("Documentacao_Projeto_Nos/wireframes/comparacoes", folder);
if (fs.existsSync(root)) throw new Error("A galeria já existe; não sobrescrever evidência histórica.");
fs.mkdirSync(root);
const files = [];
const ids = { nucleos:12, inicio:13, agenda:14, pessoas:73, convites:59, acordos:18, habito:24, registrar:27, revisar:31, confirmar:28, arvore:38, memorias:40, conexoes:44, perfis:49, manifesto:55, cuidado:61, comecar:6, tipo:7, proposito:8, convite:10, conta:1, configuracoes:66, privacidade:67, seguranca:69, ajuda:70, sair:71, "conta-cadastro":1, "conta-login":2, "boas-vindas":72, recuperar:4, "confirmar-email":3, "nova-senha":5 };
function add(source, name, group, label) {
  if (!fs.existsSync(source)) throw new Error(`Captura ausente: ${source}`);
  const target = `v${version}-${date}-${name}.png`;
  fs.copyFileSync(source, path.join(root, target), fs.constants.COPYFILE_EXCL);
  files.push({ name:target, group, label });
}
for (const sourceFolder of ["artifacts/current-layout", "artifacts/current-layout-public"]) {
  const captures = fs.readdirSync(sourceFolder).filter(file => file.endsWith(".png")).sort();
  if (!captures.length) throw new Error(`Sem capturas em ${sourceFolder}`);
  for (const file of captures) {
    const match = /^(.*)-(desktop|mobile|640|768|1024)\.png$/.exec(file);
    if (!match) throw new Error(`Nome de captura inesperado: ${file}`);
    const [,label,width] = match;
    const screen = ids[label] ? `tela_${String(ids[label]).padStart(2,"0")}` : "estado-404";
    add(path.join(sourceFolder,file),`${screen}-${label}-depois-${width}`,"Aplicativo",`${label} · ${width} · aplicativo local`);
  }
}
for (let id = 1; id <= 73; id++) {
  const screen = `tela_${String(id).padStart(2,"0")}`;
  add(`artifacts/atlas-current-all/${screen}-mobile.png`,`${screen}-atlas-mobile`,"Atlas",`${screen} · Atlas vivo ilustrativo`);
}
for (const name of ["desktop", "mobile", "panels"]) add(`artifacts/atlas-layout-current-${name}.png`,`tela_${name === "mobile" ? "38" : "18"}-atlas-composicao-${name}`,"Atlas",`Composição compartilhada · ${name}`);
for (const [id,source] of [
  [13,"v1.0.0-2026-10-14-mvp-05-administracao/app-13-desktop.png"],
  [18,"v1.0.0-2026-10-14-mvp-05-administracao/app-18-desktop.png"],
  [73,"v1.1.0-2026-10-15-encerramento/app-73-desktop.png"],
  [1,"v1.0.1-2026-10-15-arvore/app-conta-1440.png"],
]) add(path.join("Documentacao_Projeto_Nos/wireframes/comparacoes",source),`tela_${String(id).padStart(2,"0")}-antes-arquivo-historico`,"Antes",`Tela ${id} · captura histórica preservada; dados/altura podem diferir`);
add("artifacts/reference-overview.png","tela_13-referencia-fornecida","Referência","Início · referência fornecida pelo usuário, dados ilustrativos");
add("artifacts/reference-agreements.png","tela_18-referencia-fornecida","Referência","Acordos · referência fornecida pelo usuário, dados ilustrativos");
const escape = value => String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;");
const counts = Object.fromEntries(["Aplicativo","Atlas","Antes","Referência"].map(group => [group,files.filter(file => file.group === group).length]));
fs.writeFileSync(path.join(root,"manifest.json"),JSON.stringify({ version,date,counts,files },null,2));
fs.writeFileSync(path.join(root,"index.html"),`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Layout atual — v${version}</title><style>
*{box-sizing:border-box}body{margin:0;background:#f5f7f1;color:#293e35;font:15px/1.8 Arial,sans-serif}header,main{max-width:1500px;margin:auto;padding:30px}header{border-bottom:1px solid #dce3d6}h1{font:38px/1.2 Georgia,serif}a{color:#345d44}button,input{font:inherit;padding:10px 15px;border:1px solid #b7c8ad;border-radius:7px;background:#fffefa;color:#345d44}button{cursor:pointer}button[aria-pressed=true]{background:#345d44;color:white}nav{display:flex;flex-wrap:wrap;gap:10px;position:sticky;top:0;background:#f5f7f1f5;padding:15px 0;z-index:1}input{min-width:0;flex:1}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}figure{margin:0;padding:20px;background:#fffefa;border:1px solid #dce3d6;border-radius:12px}figcaption{margin-bottom:14px}img{width:100%;height:540px;object-fit:contain;object-position:top;background:#edf1e8;border-radius:7px}.note{background:#f3edf9;border:1px solid #d8c7ea;padding:18px;border-radius:10px}button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid #7955a5;outline-offset:4px}[hidden]{display:none!important}@media(max-width:700px){header,main{padding:22px}.grid{grid-template-columns:1fr}h1{font-size:30px}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
</style><header><p>PROJETO NÓS · v${version} · 18/10/2026</p><h1>Um novo espaço para cultivar vínculos.</h1><p>Migração integral para a referência <a href="../../../Telas/Layout%20atual/index.html">Layout atual</a>. As 73 fichas do Atlas foram capturadas; o aplicativo apresenta as rotas reais e os seis esboços protegidos descritos no registro.</p><p class="note">Atlas e referência têm dados ilustrativos. No aplicativo, Árvore, memórias, conexões, perfis, manifesto e cuidado são esboços sem persistência. Capturas autenticadas usam contas temporárias do banco local. As imagens “Antes” são arquivos históricos; suas alturas e dados podem diferir, portanto não constituem uma medição pixel a pixel.</p><p>Aplicativo: 1440×1000 e 390×844; recortes adicionais em 640/768/1024 px. Sem transbordamento nos estados verificados. Clique em uma imagem para abrir a captura completa.</p></header><main><nav aria-label="Filtrar capturas"><button data-group="Todos" aria-pressed="true">Todas</button>${Object.entries(counts).map(([group,count])=>`<button data-group="${group}" aria-pressed="false">${group} · ${count}</button>`).join("")}<label>Buscar <input type="search" id="search" placeholder="agenda, tela_38, mobile…"></label></nav><p id="count" role="status"></p><div class="grid">${files.map(file=>`<figure data-group="${escape(file.group)}" data-search="${escape(file.label+" "+file.name)}"><figcaption><strong>${escape(file.group)}</strong> · ${escape(file.label)}</figcaption><a href="${escape(file.name)}"><img src="${escape(file.name)}" alt="${escape(file.label)}" loading="lazy"></a></figure>`).join("")}</div></main><script>
let group="Todos";const search=document.querySelector("#search");function filter(){let count=0;document.querySelectorAll("figure").forEach(item=>{item.hidden=(group!=="Todos"&&item.dataset.group!==group)||!item.dataset.search.toLowerCase().includes(search.value.toLowerCase());if(!item.hidden)count++;});document.querySelector("#count").textContent=count+" capturas exibidas";}document.querySelectorAll("button[data-group]").forEach(button=>button.addEventListener("click",()=>{group=button.dataset.group;document.querySelectorAll("button[data-group]").forEach(item=>item.setAttribute("aria-pressed",String(item===button)));filter();}));search.addEventListener("input",filter);filter();
</script></html>`);
console.log(JSON.stringify({ root,images:files.length,counts }));
