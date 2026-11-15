import { Component, effect, inject, untracked } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { accessLink } from '../auth/auth-flow';

@Component({
  imports:[RouterOutlet,RouterLink],
  template:`
    @if (profile.loading()) {
      <p role="status">Conferindo sua sessão…</p>
    } @else if (profile.user(); as user) {
      @for (account of [user]; track account.id) {
        <router-outlet />
      }
    } @else if (profile.notice()) {
      <section class="surface">
        <h1 tabindex="-1">Sua conta</h1>
        <p role="alert">{{ profile.notice() }}</p>
        <a class="button" [routerLink]="login">Ir para a tela de acesso</a>
      </section>
    }
  `,
})
export class NucleiArea {
  protected readonly profile = inject(PreviewProfile);
  private readonly router = inject(Router);
  protected get login() {
    const path = this.router.currentNavigation()?.finalUrl?.toString() ?? this.router.url;
    return this.router.parseUrl(accessLink('/conta?modo=login',path));
  }

  constructor() {
    void this.profile.connect();
    effect(() => {
      if (!this.profile.loading() && !this.profile.user() && !this.profile.notice()) {
        // O redirecionamento observa somente a sessão. A própria navegação não dispara outro redirecionamento.
        untracked(() => void this.router.navigateByUrl(this.login,{replaceUrl:true}));
      }
    });
  }
}
