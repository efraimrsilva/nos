import { Component } from '@angular/core';
import { type Routes } from '@angular/router';
import { PreviewHome } from './preview-home';
import { RouteState } from './shared/route-state';

@Component({
  imports: [RouteState],
  template: '<app-route-state kind="missing" />',
})
class NotFound {}

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: PreviewHome, title: 'Nós — Cultive seus vínculos' },
  {
    path: 'configuracoes/conta',
    loadComponent: () => import('./account').then(module => module.Account),
    title: 'Minha conta · Nós',
  },
  { path: '**', component: NotFound, title: 'Página não encontrada · Nós' },
];
