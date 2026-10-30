import { test, expect } from '@playwright/test';
import { readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';
import { createElement, type ComponentType, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { transformSync } from 'next/dist/build/swc';

const requireModule = createRequire(process.cwd() + '/package.json');
// Usa os componentes reais; isola só o roteador e o shell, sem simular autenticação ou dados.
function load(file: string, overrides: Record<string, unknown> = {}) {
  const module = { exports: {} as Record<string, ComponentType<any>> };
  // A captura anterior usa a revisão publicada; não altera os arquivos de trabalho.
  const source = process.env.NOS_CAPTURE_BEFORE === '1' && (file.includes('route-state.tsx') || file.includes('loading.tsx')) ? execFileSync('git', ['show', `e77da4b:${file}`], { encoding: 'utf8' }) : readFileSync(file, 'utf8');
  const { code } = transformSync(source, { jsc: { parser: { syntax: 'typescript', tsx: true }, transform: { react: { runtime: 'automatic' } }, target: 'es2022' }, module: { type: 'commonjs' } });
  runInNewContext(code, { module, exports: module.exports, require: (name: string) => name in overrides ? overrides[name] : requireModule(name) });
  return module.exports;
}
const { LoadingIndicator } = load('src/shared/components/loading-indicator.tsx');
const { RouteState } = load('src/shared/components/route-state.tsx', {
  'next/link': ({ children, ...props }: { children: ReactNode }) => createElement('a', props, children),
  './application-shell': { ApplicationShell: ({ children }: { children: ReactNode }) => createElement('main', {}, children) },
  './loading-indicator': { LoadingIndicator },
});
const { default: Loading } = load('src/app/nucleos/[id]/loading.tsx', { '@/shared/components/route-state': { RouteState } });

test('carregamento ao selecionar Núcleo exibe informe sem atalhos', async ({ page }, info) => {
  await page.setViewportSize(info.project.name === 'desktop' ? { width: 1440, height: 1000 } : { width: 390, height: 844 });
  await page.setContent('<meta name="viewport" content="width=device-width, initial-scale=1">' + renderToStaticMarkup(createElement(Loading)));
  const globals = readFileSync('src/app/globals.css', 'utf8').replace('@import "tailwindcss";', '').replace('@theme {', ':root {');
  await page.addStyleTag({ content: globals + readFileSync('src/app/layout-system.css', 'utf8') });
  await expect(page.getByRole('heading', { name: 'Carregando seu Núcleo…' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Conferindo as informações…');
  await expect(page.locator('.route-state')).toHaveAttribute('aria-busy', 'true');
  const dir = 'Documentacao_Projeto_Nos/wireframes/comparacoes/v3.4.3-2026-10-30-carregamento-tela_12-tela_13';
  mkdirSync(dir, { recursive: true });
  const before = process.env.NOS_CAPTURE_BEFORE === '1';
  await page.locator('.route-state').screenshot({ path: `${dir}/${before ? 'antes' : 'depois'}-componente-${info.project.name}.png` });
  if (before) return;
  await expect(page.locator('.route-state').getByRole('link')).toHaveCount(0);
  await expect(page.locator('.route-state').getByRole('button')).toHaveCount(0);
  await expect(page.locator('.route-state-actions')).toHaveCount(0);
});

test('erro mantém tentativa e rotas de saída', async ({ page }) => {
  await page.setContent(renderToStaticMarkup(createElement(RouteState, { title: 'Não foi possível carregar', retry: () => {}, embedded: true })));
  await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Seus Núcleos' })).toHaveAttribute('href', '/nucleos');
  await expect(page.getByRole('link', { name: 'Minha conta' })).toHaveAttribute('href', '/conta');
});

const { default: ListLoading } = load('src/app/nucleos/loading.tsx', { '@/shared/components/route-state': { RouteState } });
test('lista de Núcleos carrega sem atalhos no informe', async ({ page }, info) => {
  await page.setViewportSize(info.project.name === 'desktop' ? { width: 1440, height: 1000 } : { width: 390, height: 844 });
  await page.setContent('<meta name="viewport" content="width=device-width, initial-scale=1">' + renderToStaticMarkup(createElement(ListLoading)));
  const globals = readFileSync('src/app/globals.css', 'utf8').replace('@import "tailwindcss";', '').replace('@theme {', ':root {');
  await page.addStyleTag({ content: globals + readFileSync('src/app/layout-system.css', 'utf8') });
  await expect(page.getByRole('heading', { name: 'Carregando seus Núcleos…' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Conferindo as informações…');
  const before = process.env.NOS_CAPTURE_BEFORE === '1';
  const dir = 'Documentacao_Projeto_Nos/wireframes/comparacoes/v3.4.3-2026-10-30-carregamento-tela_12-tela_13';
  mkdirSync(dir, { recursive: true });
  await page.locator('.route-state').screenshot({ path: dir + '/' + (before ? 'antes' : 'depois') + '-lista-' + info.project.name + '.png' });
  if (before) return;
  await expect(page.locator('.route-state').getByRole('link')).toHaveCount(0);
  await expect(page.locator('.route-state').getByRole('button')).toHaveCount(0);
});
