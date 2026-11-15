import { Component,effect,inject,resource,untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute,Router,RouterLink } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { AgreementsData } from './agreements-data';
import { HabitAdministration } from './habit-administration';
import { HabitMomentEditor } from './habit-moment-editor';
import { HabitTermsHistory } from './habit-terms-history';
import { type HabitContext } from './habit-data';
import { canRecordMoment,habitDate } from './habit-model';
import { statusLabel } from './proposal-model';

@Component({
  imports:[RouterLink,HabitAdministration,HabitMomentEditor,HabitTermsHistory],
  template:`
    @if (state.error()) {
      <section class="surface"><h1 tabindex="-1">{{ title }}</h1>
        <p role="alert">Não foi possível consultar o acordo.</p><button class="button" type="button" (click)="state.reload()">Tentar novamente</button>
      </section>
    } @else if (state.isLoading() && !state.hasValue()) {
      <p role="status">Carregando o acordo…</p>
    } @else if (state.value(); as view) {
      @if (mode==='record' && !canRecord(view.agreement)) {
        <section class="surface"><h1 tabindex="-1">Registro indisponível</h1>
          <p>Para registrar, aceite os termos vigentes de um Hábito em teste ou ativo.</p>
          <a class="button" [routerLink]="['/nucleos',view.scope.id,'acordos',view.agreement.id]">Voltar ao Hábito</a>
        </section>
      } @else {
        <header class="nucleus-header agreement-heading">
          <div><p class="kicker">{{ view.name }}</p><h1 tabindex="-1">{{ title }}</h1><p>{{ view.agreement.title }}</p></div>
          <a class="text-link" [routerLink]="['/nucleos',view.scope.id,'acordos',view.agreement.id]">Voltar ao Hábito</a>
        </header>
        @switch (mode) {
          @case ('period') {
            <section class="surface agreement-detail">
              <h2>Situação atual</h2><p><span class="badge">{{ status(view.agreement.status) }}</span></p>
              <dl class="agreement-facts">
                <div><dt>Termos atuais</dt><dd>Versão {{ view.agreement.terms_version }}</dd></div>
                <div><dt>Duração planejada</dt><dd>{{ view.agreement.trial_days ? view.agreement.trial_days+' dias':'Não informada no registro histórico' }}</dd></div>
                @if (view.agreement.test_started_at) { <div><dt>Início do teste</dt><dd>{{ date(view.agreement.test_started_at) }}</dd></div> }
              </dl>
              <p>Um administrador inicia e conclui o teste. As respostas indicam escolhas de participação.</p>
            </section>
            @if (view.role==='admin') {
              <section class="surface agreement-detail habit-section-gap" aria-label="Administrar o ciclo">
                <h2>Administrar o ciclo</h2>
                @if (view.agreement.status==='ended' || view.agreement.status==='declined') { <p>O histórico permanece disponível para consulta.</p> }
                <app-habit-administration [context]="view" [loading]="state.isLoading()" />
              </section>
            }
          }
          @case ('record') {
            <section class="surface agreement-detail">
              <p><span class="badge">{{ status(view.agreement.status) }}</span></p>
              <app-habit-moment-editor [context]="view" (completed)="finishMoment(view,$event)" />
            </section>
          }
          @case ('terms') {
            <app-habit-terms-history [context]="view" [admin]="view.role==='admin'" />
          }
        }
      }
    } @else {
      <section class="surface"><h1 tabindex="-1">Acordo indisponível</h1>
        <p>Confira os Núcleos dos quais você faz parte.</p><a class="button" routerLink="/nucleos">Ver Seus Núcleos</a>
      </section>
    }
  `,
})
export class HabitWorkspace {
  private readonly profile = inject(PreviewProfile);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly data = inject(AgreementsData);
  private readonly params = toSignal(this.route.paramMap,{initialValue:this.route.snapshot.paramMap});
  protected readonly mode = this.route.snapshot.data['cycle'] as 'period'|'record'|'terms';
  protected readonly title = {period:'Período e administração do hábito',record:'Registrar momento',terms:'Termos e histórico do acordo'}[this.mode];
  protected readonly canRecord = canRecordMoment;
  protected readonly status = statusLabel;
  protected readonly date = habitDate;

  protected readonly state = resource({
    params:()=>{
      const owner = this.profile.user()?.id, id = this.params().get('id'), agreement = this.params().get('agreementId');
      return owner && id && agreement ? {scope:{owner,id},agreement}:undefined;
    },
    loader:({params,abortSignal})=>this.data.detail(params.scope,params.agreement,abortSignal),
  });

  constructor() {
    effect(()=>{
      const event = this.data.changes();
      if (event && event.owner===this.profile.user()?.id && event.id===this.params().get('id')) {
        untracked(()=>this.state.reload());
      }
    });
  }

  protected finishMoment(context:HabitContext,kind:'saved'|'unknown') {
    if (kind==='saved') void this.router.navigate(['/nucleos',context.scope.id,'acordos',context.agreement.id],
      {state:{habitMomentSaved:true}});
  }
}
