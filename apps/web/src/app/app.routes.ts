import { Component } from '@angular/core';
import { type Routes, type UrlMatcher } from '@angular/router';
import { PreviewHome } from './preview-home';
import { RouteState } from './shared/route-state';
import { safeAuthNext } from './auth/auth-flow';

@Component({
  imports: [RouteState],
  template: '<app-route-state kind="missing" />',
})
class NotFound {}

const matchAccess: UrlMatcher = parts => {
  if (parts[0]?.path !== 'conta') return null;
  if (parts.length === 1) return {consumed: parts};
  if (parts.length === 2 && ['confirmar-email','recuperar'].includes(parts[1].path)) {
    return {consumed: parts, posParams: {assistance: parts[1]}};
  }
  return null;
};

const pending: UrlMatcher = parts => {
  const path = '/' + parts.map(part => part.path).join('/');
  // Mantém o retorno de convite e de Núcleo mesmo antes de as páginas desses módulos chegarem.
  return parts.length > 0 && (path === '/nucleos' || safeAuthNext(path) === path) ? {consumed: parts} : null;
};
const loadEntry = () => import('./auth/entry-destination').then(module => module.EntryDestination);
const loadCallback = () => import('./auth/auth-callback').then(module => module.AuthCallback);

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: loadEntry, data:{entry:true}, title:'Nós — Cultive seus vínculos' },
  { path: 'boas-vindas', component: PreviewHome, title: 'Boas-vindas · Nós' },
  { matcher: matchAccess, loadComponent: () => import('./auth/access-page').then(module => module.AccessPage), title: 'Sua conta · Nós' },
  { path: 'conta/nova-senha', loadComponent: () => import('./auth/reset-password').then(module => module.ResetPassword), title: 'Redefinir senha · Nós' },
  { path: 'auth/confirm', loadComponent: loadCallback, data:{kind:'confirm'}, title: 'Confirmar e-mail · Nós' },
  { path: 'auth/recovery', loadComponent: loadCallback, data:{kind:'recovery'}, title: 'Recuperar acesso · Nós' },
  { path: 'auth/callback', loadComponent: loadCallback, data:{kind:'callback'}, title: 'Entrar · Nós' },
  { path: 'configuracoes/conta', loadComponent: () => import('./account').then(module => module.Account), title: 'Minha conta · Nós' },
  { matcher: pending, loadComponent: loadEntry, title: 'Meu espaço · Nós' },
  { path: '**', component: NotFound, title: 'Página não encontrada · Nós' },
];
