import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { accessLink, safeAuthNext } from './auth-flow';

@Component({
  imports: [RouterLink],
  template: `
    @if (profile.loading()) {
      <p role="status">Conferindo sua sessão…</p>
    } @else if (profile.notice()) {
      <section class="surface">
        <h1 tabindex="-1">Sua conta</h1>
        <p role="alert">{{ profile.notice() }}</p>
        <a [routerLink]="login">Ir para a tela de acesso</a>
      </section>
    } @else if (profile.user() && !isEntry) {
      <section class="surface">
        <h1 tabindex="-1">{{ title }}</h1>
        <p>Esta área será disponibilizada nas próximas etapas da prévia.</p>
        <a class="button" routerLink="/configuracoes/conta">Minha conta</a>
      </section>
    }
  `,
})
export class EntryDestination {
  protected readonly profile = inject(PreviewProfile);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly isEntry = Boolean(this.route.snapshot.data['entry']);
  private readonly next = safeAuthNext(this.router.getCurrentNavigation()?.finalUrl?.toString());
  protected readonly title = this.next === '/nucleos' || this.next.startsWith('/nucleos?')
    ? 'Seus Núcleos' : this.next.startsWith('/comecar/convite') ? 'Entrar por convite' : 'Meu espaço';
  protected readonly login = this.router.parseUrl(accessLink('/conta?modo=login', this.next));
  private readonly destination = computed(() => this.profile.loading() || this.profile.notice() ? '' :
    this.profile.user() ? this.isEntry ? this.next : '' : this.isEntry ? '/conta' : this.login.toString());

  constructor() {
    void this.profile.connect();
    effect(() => {
      const path = this.destination();
      if (path) void this.router.navigateByUrl(path, {replaceUrl: true});
    });
  }
}
