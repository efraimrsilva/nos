import { Component, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NucleusSteps } from '../nuclei/nucleus-steps';
import { PreviewProfile } from '../preview-profile';
import { InvitationGenerator } from './invitation-generator';
import { InvitationsData } from './invitations-data';

@Component({
  imports:[RouterLink,InvitationGenerator,NucleusSteps],
  styles:`
    .initial-invitation-panel { padding: 1.625rem; }
    @media (max-width: 680px) {
      .initial-invitation-panel { padding: 1.25rem; }
    }
  `,
  template:`
    @if (state.isLoading()) { <p class="loading-state route-loading" role="status">Conferindo o convite inicial…</p> }
    @else if (state.error()) {
      <section class="surface">
        <h1 tabindex="-1">Convite inicial</h1>
        <p role="alert">Não foi possível consultar o convite.</p>
        <button class="button" type="button" (click)="state.reload()">Tentar novamente</button>
      </section>
    } @else if (state.value(); as view) {
      <app-nucleus-steps [current]="3" />
      <header class="nucleus-header">
        <div><p class="kicker">Núcleo criado</p><h1 tabindex="-1">Convide quem faz parte</h1>
          <p>{{ view.name }} já é seu espaço privado. Convidar alguém agora é opcional.</p></div>
      </header>
      @for (item of [view]; track item.scope.id) {
        <div class="surface initial-invitation-panel">
          <app-invitation-generator [scope]="item.scope" [initial]="item.active" />
          <a class="text-link" [routerLink]="['/nucleos',item.scope.id,'convites']">Gerenciar convites</a>
        </div>
        <p class="invite-note"><a class="button secondary" [routerLink]="['/nucleos',item.scope.id]">Concluir por enquanto</a></p>
      }
    } @else {
      <section class="surface"><h1 tabindex="-1">Convites indisponíveis</h1>
        <p>Confira os Núcleos dos quais você faz parte.</p>
        <a class="button" routerLink="/nucleos">Ver Seus Núcleos</a></section>
    }
  `,
})
export class InitialInvitation {
  private readonly route = inject(ActivatedRoute);
  private readonly profile = inject(PreviewProfile);
  private readonly data = inject(InvitationsData);
  private readonly params = toSignal(this.route.paramMap,{initialValue:this.route.snapshot.paramMap});
  protected readonly state = resource({
    params:() => {
      const owner = this.profile.user()?.id;
      const id = this.params().get('id');
      return owner && id ? {owner,id} : undefined;
    },
    loader:async ({params,abortSignal}) => {
      const result = await this.data.initial(params,abortSignal);
      return result ? {...result,scope:params} : null;
    },
  });
}
