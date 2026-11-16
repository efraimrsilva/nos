import { Component, inject } from '@angular/core';
import { Router, type Routes, type UrlMatcher } from '@angular/router';
import { PreviewHome } from './preview-home';
import { RouteState } from './shared/route-state';
import { sections } from './previews/examples';

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
  { path: 'configuracoes', pathMatch: 'full', redirectTo: 'conta' },
  { path: 'configuracoes/privacidade', pathMatch: 'full', redirectTo: '/conta#privacidade' },
  { path: 'ajuda', pathMatch: 'full', redirectTo: '/conta#ajuda-e-suporte' },
  { path: 'configuracoes/conta', loadComponent: () => import('./account').then(module => module.Account), title: 'Minha conta · Nós' },
  {
    path: '',
    loadComponent: () => import('./nuclei/nuclei-area').then(module => module.NucleiArea),
    children: [
      {path:'nucleos/:id/pessoas',redirectTo:({params}) => inject(Router).createUrlTree(['/nucleos',params['id']],{queryParams:{integrantes:1}})},
      {path:'nucleos/:id/sair',loadComponent:() => import('./nuclei/nucleus-leave').then(module => module.NucleusLeave),title:'Sair de um Núcleo · Nós'},
      {path:'nucleos',loadComponent:() => import('./nuclei/nuclei-list').then(module => module.NucleiList),title:'Seus Núcleos · Nós'},
      {path:'nucleos/:id',loadComponent:() => import('./nuclei/nucleus-home').then(module => module.NucleusHome),title:'Início do Núcleo · Nós'},
      {path:'comecar',loadComponent:() => import('./nuclei/nucleus-wizard').then(module => module.ChoosePath),title:'Escolher caminho · Nós'},
      {path:'comecar/tipo',loadComponent:() => import('./nuclei/nucleus-wizard').then(module => module.ChooseType),title:'Tipo de Núcleo · Nós'},
      {path:'comecar/proposito',loadComponent:() => import('./nuclei/nucleus-wizard').then(module => module.NucleusPurpose),title:'Propósito do Núcleo · Nós'},
      {path:'comecar/convite',loadComponent:() => import('./invitations/invitation-entry').then(module => module.InvitationEntry),title:'Entrar por convite · Nós'},
      {path:'comecar/convite-inicial/:id',loadComponent:() => import('./invitations/initial-invitation').then(module => module.InitialInvitation),title:'Convite inicial · Nós'},
      {path:'nucleos/:id/convites',loadComponent:() => import('./invitations/invitation-management').then(module => module.InvitationManagement),title:'Gerenciar convites · Nós'},
      ...Object.entries(sections).map(([preview, section]) => ({
        path: 'nucleos/:id/' + preview,
        loadComponent: () => import('./previews/nucleus-preview').then(module => module.NucleusPreview),
        data: {preview},
        title: section.label + ' · Nós',
      })),
      {path:'nucleos/:id/agenda',loadComponent:() => import('./calendar/calendar-page').then(module => module.CalendarPage),title:'Agenda do Núcleo · Nós'},
      {path:'nucleos/:id/acordos',loadComponent:() => import('./agreements/agreements-page').then(module => module.AgreementsPage),title:'Acordos do Núcleo · Nós'},
      {path:'nucleos/:id/acordos/:agreementId',loadComponent:() => import('./agreements/agreement-detail').then(module => module.AgreementDetail),title:'Detalhe do acordo · Nós'},
      {path:'nucleos/:id/acordos/:agreementId/confirmar',loadComponent:() => import('./agreements/habit-workspace').then(module => module.HabitWorkspace),data:{cycle:'period'},title:'Período e administração · Nós'},
      {path:'nucleos/:id/acordos/:agreementId/registrar',loadComponent:() => import('./agreements/habit-workspace').then(module => module.HabitWorkspace),data:{cycle:'record'},title:'Registrar momento · Nós'},
      {path:'nucleos/:id/acordos/:agreementId/revisar',loadComponent:() => import('./agreements/habit-workspace').then(module => module.HabitWorkspace),data:{cycle:'terms'},title:'Termos e histórico · Nós'},
    ],
  },
  { path: '**', component: NotFound, title: 'Página não encontrada · Nós' },
];
