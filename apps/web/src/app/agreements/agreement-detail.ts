import { Component, computed, effect, inject, resource, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { AgreementsData } from './agreements-data';
import { AgreementTerms } from './agreement-terms';
import { watchAgreementCounts } from './agreement-counts';

@Component({
  imports:[RouterLink,AgreementTerms],
  host:{class:'agreement-detail-page'},
  template:`
    @if (state.error()) {
      <section class="surface">
        <h1 tabindex="-1">Detalhe do acordo</h1><p role="alert">Não foi possível consultar o acordo.</p>
        <button class="button" type="button" (click)="state.reload()">Tentar novamente</button>
      </section>
    } @else if (state.isLoading() && !state.hasValue()) {
      <p class="loading-state route-loading" role="status">Carregando o acordo…</p>
    } @else if (counts.denied() || !state.value()) {
      <section class="surface"><h1 tabindex="-1">Acordo indisponível</h1>
        <p>Confira os Núcleos dos quais você faz parte.</p><a class="button" routerLink="/nucleos">Ver Seus Núcleos</a>
      </section>
    } @else if (state.value(); as view) {
      <div class="agreement-detail-frame">
        <a class="back-button agreement-back" [routerLink]="['/nucleos',view.scope.id,'acordos']">Voltar a Acordos</a>
        <header class="nucleus-header agreement-heading">
          <div>
            <p class="kicker">{{ view.agreement.status === 'pending' ? 'Proposta' : 'Hábito' }} · {{ view.name }}</p>
            <h1 tabindex="-1">{{ view.agreement.title }}</h1>
          </div>
        </header>
        <section class="surface agreement-detail agreement-detail-card" aria-label="Detalhes do acordo">
          <app-agreement-terms [scope]="view.scope" [agreement]="view.agreement" [count]="counts.totals().get(view.agreement.id)"
            [countFailed]="counts.failed()" [countTick]="counts.received()" [link]="true"
            [loading]="state.isLoading() || stale()" (refreshed)="state.reload()">
            @if (stale()) {
              <p role="status">Não foi possível atualizar o acordo. <button type="button" class="text-link" (click)="state.reload()">Tentar novamente</button></p>
            }
          </app-agreement-terms>
        </section>
      </div>
    }
  `,
})
export class AgreementDetail {
  private readonly data = inject(AgreementsData);
  private readonly profile = inject(PreviewProfile);
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap,{initialValue:this.route.snapshot.paramMap});
  private lastView?: NonNullable<Awaited<ReturnType<AgreementsData['detail']>>>;
  protected readonly stale = signal(false);
  protected readonly state = resource({
    params:() => {
      const owner = this.profile.user()?.id, id = this.params().get('id'), agreement = this.params().get('agreementId');
      return owner && id && agreement ? {scope:{owner,id},agreement} : undefined;
    },
    loader:async ({params,abortSignal}) => {
      try {
        const view = await this.data.detail(params.scope,params.agreement,abortSignal);
        if (!abortSignal.aborted) {
          this.lastView = view ?? undefined;
          this.stale.set(false);
        }
        return view;
      } catch (error) {
        const previous = this.lastView;
        if (!abortSignal.aborted && previous?.agreement.id === params.agreement &&
            previous.scope.id === params.scope.id && previous.scope.owner === params.scope.owner) {
          this.stale.set(true);
          return previous;
        }
        throw error;
      }
    },
  });
  protected readonly counts = watchAgreementCounts(computed(() => {
    const view = this.state.hasValue() ? this.state.value() : null;
    return view ? {...view.scope,ids:[view.agreement.id]} : undefined;
  },{equal:(a,b)=>a?.owner === b?.owner && a?.id === b?.id && a?.ids[0] === b?.ids[0]}));

  constructor() {
    effect(() => {
      const request = this.data.changes();
      if (request && request.owner === this.profile.user()?.id && request.id === this.params().get('id')) {
        untracked(() => { this.state.reload(); this.counts.refresh(); });
      }
    });
  }
}
