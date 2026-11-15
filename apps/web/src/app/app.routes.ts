import { type Routes } from '@angular/router';
import { Account } from './account';

export const routes: Routes = [
  { path: 'configuracoes/conta', component: Account, title: 'Minha conta · Nós' },
  { path: '**', redirectTo: 'configuracoes/conta' },
];
