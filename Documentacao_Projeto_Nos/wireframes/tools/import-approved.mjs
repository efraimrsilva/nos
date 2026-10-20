import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { chromium } from '@playwright/test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as icons from 'lucide-react';

const root = path.resolve('Documentacao_Projeto_Nos');
const source = fs.readFileSync(path.join(root, 'Telas/Layout inicial/Nos_App.dc.html'), 'utf8');
const logic = source.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
// O código de referência é interpretado somente nesta ferramenta local. O atlas recebe HTML estático.
const context = vm.createContext({ DCLogic: class {}, React: { createElement: (tag, props, ...children) => ({ tag, props, children }) } });
vm.runInContext(`${logic};globalThis.component = new Component();`, context);
const definitions = {
  72: { screen: 'splash' }, 13: { screen: 'home' }, 18: { screen: 'acordos' },
  24: { screen: 'habitDetail' }, 25: { screen: 'habitDetail', habitTab: 'historico' },
  26: { screen: 'habitDetail', habitTab: 'reflexoes' },
  19: { screen: 'novoAcordo', novoStep: 0 }, 20: { screen: 'novoAcordo', novoStep: 1 },
  21: { screen: 'novoAcordo', novoStep: 2 }, 22: { screen: 'novoAcordo', novoStep: 3 },
  38: { screen: 'arvore' }, 40: { screen: 'memorias' }, 42: { screen: 'memorias', memoTab: 'fotos' },
  39: { screen: 'memorias', memoTab: 'marcos' }, 49: { screen: 'perfil' },
  12: { screen: 'nucleos' }, 58: { screen: 'convite' }, 60: { screen: 'notificacoes' },
  27: { screen: 'registrar' }, 43: { screen: 'gratidao' }, 11: { screen: 'aceitar' },
  45: { screen: 'membro' }, 34: { screen: 'experiencia' }, 30: { screen: 'revisao' },
  37: { screen: 'promocao' }, 61: { screen: 'desencontro' }, 55: { screen: 'manifesto' },
  66: { screen: 'config' }, 51: { screen: 'sobremim' }, 47: { screen: 'vinculos' },
  48: { screen: 'jornada' }, 44: { screen: 'conexoes' }, 23: { screen: 'aprovacoes' },
  62: { screen: 'dialogo' },
  'acordos-experiencias': { screen: 'acordos', acordosTab: 'experiencias' },
  'acordos-essencia': { screen: 'acordos', acordosTab: 'essencia' },
  'memorias-agradecimentos': { screen: 'memorias', memoTab: 'agradecimentos' },
  'document-conta': { screen: 'onboarding', obStep: 0 },
  'document-caminho': { screen: 'onboarding', obStep: 1 },
  'document-tipo': { screen: 'onboarding', obStep: 2, obPath: 'create' },
  'document-convite-entrada': { screen: 'onboarding', obStep: 2, obPath: 'join' },
  'document-proposito': { screen: 'onboarding', obStep: 3 },
  'document-convite-inicial': { screen: 'onboarding', obStep: 4 },
};
const base = { ...context.component.state };
for(const vinculo of ['conhecendo','namorada','esposa','pai','mae','irmao','amigo','primo','tio'])definitions[`vinculo-${vinculo}`]={screen:'vinculos',vinculo};
const browser = await chromium.launch();
const page = await browser.newPage();
const layouts = {};
try {
  for (const [key, patch] of Object.entries(definitions)) {
    context.component.state = { ...base, ...patch };
    const values = context.component.renderVals();
    const data = JSON.parse(JSON.stringify(values));
    await page.setContent('<!doctype html><html><body></body></html>');
    layouts[key] = await page.evaluate(({ source, data }) => {
      const doc = new DOMParser().parseFromString(source, 'text/html');
      const frame = doc.querySelector('[data-phone-frame]');
      const read = (expression, scope) => expression.trim() === 'true' ? true : expression.trim().split('.').reduce((value, part) => value?.[part], scope);
      const expression = value => value.match(/\{\{\s*(.*?)\s*\}\}/)?.[1];
      const bind = (value, scope) => value.replace(/\{\{\s*(.*?)\s*\}\}/g, (_, key) => read(key, scope) ?? '');
      const svgTree = tree => {
        if (typeof tree !== 'object' || tree === null) return doc.createTextNode(String(tree ?? ''));
        const el = doc.createElementNS('http://www.w3.org/2000/svg', tree.tag);
        for (const [key, value] of Object.entries(tree.props || {})) {
          if (key === 'key') continue;
          if (key === 'onClick') continue;
          if (key === 'style') { Object.assign(el.style, value); continue; }
          el.setAttribute(({ strokeWidth: 'stroke-width', strokeLinecap: 'stroke-linecap', strokeDasharray: 'stroke-dasharray', textAnchor: 'text-anchor', fontSize: 'font-size', fontWeight: 'font-weight', fontFamily: 'font-family' })[key] || key, value);
        }
        // A árvore vetorial também referencia a mesma ilustração local do aplicativo.
        if (tree.tag === 'image') el.setAttribute('href', 'assets/tree.png');
        tree.children.flat(Infinity).forEach(child => el.append(svgTree(child)));
        return el;
      };
      const walk = (node, scope) => {
        if (node.nodeType === Node.COMMENT_NODE) return [];
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.textContent.trim() === '{{ connTree }}') return [svgTree(data.connTree)];
          return [doc.createTextNode(bind(node.textContent, scope))];
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return [];
        if (node.tagName === 'SC-IF') return read(expression(node.getAttribute('value')), scope) ? [...node.childNodes].flatMap(child => walk(child, scope)) : [];
        if (node.tagName === 'SC-FOR') return (read(expression(node.getAttribute('list')), scope) || []).flatMap(item => [...node.childNodes].flatMap(child => walk(child, { ...scope, [node.getAttribute('as')]: item })));
        const el = node.cloneNode(false);
        for (const attr of [...el.attributes]) {
          if (attr.name.toLowerCase() === 'onclick') { el.removeAttribute(attr.name); el.setAttribute('data-source-action', expression(attr.value));if(expression(attr.value)==='chip.onClick')el.setAttribute('data-layout',`vinculo-${scope.chip.key}`); }
          else el.setAttribute(attr.name, bind(attr.value, scope));
        }
        if (el.tagName === 'BUTTON') {
          el.setAttribute('type', 'button');
          if (!el.hasAttribute('data-source-action')) el.setAttribute('data-demo', 'true');
        }
        if (el.tagName === 'IMG') { el.setAttribute('src', 'assets/tree.png'); if (!el.hasAttribute('alt')) el.setAttribute('alt', 'Árvore simbólica do Nós'); }
        if (el.tagName.toLowerCase() === 'image') el.setAttribute('href', 'assets/tree.png');
        [...node.childNodes].flatMap(child => walk(child, scope)).forEach(child => el.append(child));
        return [el];
      };
      const result = doc.createElement('div');
      // Retém o corpo aprovado e a navegação; status e moldura pertencem ao atlas.
      [...frame.children].filter(node => node.tagName === 'SC-IF').flatMap(node => walk(node, data)).forEach(node => result.append(node));
      return result.innerHTML.trim();
    }, { source, data });
  }
} finally { await browser.close(); }
const sha256 = crypto.createHash('sha256').update(source).digest('hex');
fs.writeFileSync(path.join(root, 'wireframes/atlas/approved-layouts.js'), `/* Gerado por tools/import-approved.mjs a partir de Telas/Layout inicial/Nos_App.dc.html. Não editar manualmente. */\nconst approvedSourceHash = ${JSON.stringify(sha256)};\nconst approvedLayoutDefinitions = ${JSON.stringify(definitions, null, 2)};\nconst approvedLayouts = ${JSON.stringify(layouts, null, 2)};\n`);
const names = ['Sprout','Heart','Plus','UsersRound','ChevronRight','ArrowLeft','ArrowRight','Leaf','House','HandHeart','Smile','BriefcaseBusiness','Network','Church','Lightbulb','CalendarDays','Handshake','Images','UserRound','ShieldCheck','Mail','LockKeyhole','Bell','Settings','NotebookPen','Compass','CircleCheck','Info','Sparkles','TreeDeciduous'];
const svg = Object.fromEntries(names.map(name => [name, renderToStaticMarkup(createElement(icons[name], { size: 24, strokeWidth: 1.8, 'aria-hidden': true }))]));
fs.writeFileSync(path.join(root, 'wireframes/atlas/icons.js'), `/* SVG Lucide da versão instalada; sem biblioteca ou rede no atlas. */\nconst atlasIcons = ${JSON.stringify(svg, null, 2)};\n`);
fs.copyFileSync('node_modules/lucide-react/LICENSE', path.join(root, 'wireframes/atlas/assets/LICENSE-lucide.txt'));
for (const [pkg, stem, weights] of [['plus-jakarta-sans', 'jakarta', [400,500,600,700,800]], ['fredoka', 'fredoka', [400,500,600,700]]]) {
  for (const weight of weights) fs.copyFileSync(`node_modules/@fontsource/${pkg}/files/${pkg}-latin-${weight}-normal.woff2`, path.join(root, `wireframes/atlas/assets/${stem}-${weight}.woff2`));
}
console.log(JSON.stringify({ layouts: Object.keys(layouts).length, sourceSha256: sha256, icons: names.length }));
