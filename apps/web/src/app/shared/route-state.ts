import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-route-state',
  imports: [RouterLink],
  template: `
    @switch (kind()) {
      @case ('loading') { <p role="status">Carregando página…</p> }
      @case ('error') {
        <section class="surface">
          <p role="alert">Não foi possível abrir a página.</p>
          <a class="button" [href]="reloadUrl()">Recarregar página</a>
        </section>
      }
      @case ('missing') {
        <section class="surface">
          <h1 tabindex="-1">Página não encontrada</h1>
          <p>Confira o endereço ou volte ao início para continuar.</p>
          <a class="button" routerLink="/boas-vindas">Voltar ao início</a>
        </section>
      }
    }
  `,
})
export class RouteState {
  readonly kind = input.required<'loading' | 'error' | 'missing'>();
  readonly reloadUrl = input('');
}
