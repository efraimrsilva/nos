import { Component,effect,inject,resource,untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute,Router,RouterLink } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { Notice } from '../shared/notice';
import { AgreementsData } from './agreements-data';
import { HabitMomentEditor } from './habit-moment-editor';
import { type HabitContext } from './habit-data';
import { canRecordMoment } from './habit-model';
import { statusLabel } from './proposal-model';

@Component({
  imports:[RouterLink,HabitMomentEditor],
  host:{class:'agreement-detail-page'},
  template:`
    @if (state.error()) {
      <section class="surface"><h1 tabindex="-1">Registrar momento</h1>
        <p role="alert">Não foi possível consultar o acordo.</p><button class="button" type="button" (click)="state.reload()">Tentar novamente</button>
      </section>
    } @else if (state.isLoading() && !state.hasValue()) {
      <p class="loading-state route-loading" role="status">Carregando o acordo…</p>
    } @else if (state.value(); as view) {
      @if (!canRecord(view.agreement)) {
        <section class="surface"><h1 tabindex="-1">Registro indisponível</h1>
          <p>Para registrar, aceite os termos vigentes de um Hábito em teste ou ativo.</p>
          <a class="back-button" [routerLink]="['/nucleos',view.scope.id,'acordos',view.agreement.id]">Voltar ao Hábito</a>
        </section>
      } @else {
        <a class="back-button agreement-back" [routerLink]="['/nucleos',view.scope.id,'acordos',view.agreement.id]">Voltar ao Hábito</a>
        <header class="nucleus-header agreement-heading">
          <div><p class="kicker">Combinados do Núcleo · {{ view.name }}</p><h1 tabindex="-1">Registrar momento</h1><p>{{ view.agreement.title }}</p></div>
        </header>
        <section class="surface agreement-detail agreement-record-panel">
          <p><span class="badge">{{ status(view.agreement.status) }}</span></p>
          <p class="agreement-dialog-copy">Um registro do que vocês viveram na prática.</p>
          <app-habit-moment-editor [context]="view" (completed)="finishMoment(view,$event)" />
        </section>
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
  private readonly notices = inject(Notice);
  private readonly params = toSignal(this.route.paramMap,{initialValue:this.route.snapshot.paramMap});
  protected readonly canRecord = canRecordMoment;
  protected readonly status = statusLabel;

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
    if (kind !== 'saved') return;
    this.notices.show('Momento registrado.');
    void this.router.navigate(['/nucleos',context.scope.id,'acordos',context.agreement.id]);
  }
}
