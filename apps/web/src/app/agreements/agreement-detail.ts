import { Component, computed, effect, inject, resource, signal, untracked, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { AgreementsData } from './agreements-data';
import { AgreementTerms } from './agreement-terms';
import { watchAgreementCounts } from './agreement-counts';
import { HabitMomentEditor } from './habit-moment-editor';
import { HabitMoments } from './habit-moments';
import { canRecordMoment } from './habit-model';
import { type HabitContext } from './habit-data';

@Component({
  imports:[RouterLink,AgreementTerms,HabitMomentEditor,HabitMoments],
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
      <header class="nucleus-header agreement-heading">
        <div><p class="kicker">{{ view.agreement.status==='pending'?'Proposta':'Hábito' }} · {{ view.name }}</p>
          <h1 tabindex="-1">{{ view.agreement.title }}</h1><p>Confira a prática, os termos e sua participação.</p></div>
        <a class="text-link" [routerLink]="['/nucleos',view.scope.id,'acordos']">Voltar a Acordos</a>
      </header>
      @if (momentNotice()) { <p class="surface agreement-feedback" role="status">{{ momentNotice() }}</p> }
      <div class="habit-detail-layout">
      <section class="surface agreement-detail" aria-label="Termos do acordo">
        <h2>O combinado</h2>
        <app-agreement-terms [scope]="view.scope" [agreement]="view.agreement" [count]="counts.totals().get(view.agreement.id)"
          [countFailed]="counts.failed()" [countTick]="counts.received()" [loading]="state.isLoading() || stale()" (refreshed)="state.reload()">
          @if (stale()) { <p role="status">Confira os termos atuais antes de responder. <button type="button" class="text-link" (click)="state.reload()">Atualizar termos</button></p> }
        </app-agreement-terms>
      </section>
      <aside class="surface habit-detail-context" aria-labelledby="habit-context-heading">
        <p class="kicker">Seu lugar aqui</p>
        <h2 id="habit-context-heading">No seu tempo.</h2>
        @if (view.agreement.status==='ended') {
          <p>O histórico permanece disponível. Este Hábito não recebe novos momentos.</p>
        } @else if (canRecord(view.agreement)) {
          <p>Você participa dos termos atuais e pode registrar um momento da prática.</p>
        } @else {
          <p>Confira os termos atuais e sua participação antes de registrar um momento.</p>
        }
        <nav class="habit-context-actions" aria-label="Ações do Hábito">
          @if (canRecord(view.agreement)) {
            <button type="button" class="button" aria-haspopup="dialog" [disabled]="editorPending() || stale() || state.isLoading()"
              (click)="openMoment(view,recordDialog)">Registrar momento</button>
          }
          <a class="button secondary" [routerLink]="['/nucleos',view.scope.id,'acordos',view.agreement.id,'confirmar']">Período e administração do hábito</a>
          <a class="button secondary" [routerLink]="['/nucleos',view.scope.id,'acordos',view.agreement.id,'revisar']">Termos e histórico</a>
        </nav>
        <details class="agreement-consent">
          <summary>Próximas possibilidades · esboços</summary>
          <p>Reflexões, fotos, vínculo com eventos e a passagem para Essência ainda dependem de critérios de acesso, autoria e consentimento. Registrar momentos não promove o Hábito automaticamente.</p>
        </details>
      </aside>
      @if (['testing','active','ended'].includes(view.agreement.status)) {
        <app-habit-moments [context]="view" [refresh]="momentRefresh()" />
      }
      </div>
      <dialog #recordDialog class="shared-dialog agreement-wide-dialog" aria-label="Registrar momento" (close)="closeMoment(recordDialog)">
        <header class="dialog-heading"><h2>Registrar momento</h2>
          <form method="dialog"><button class="dialog-close" aria-label="Fechar registro de momento" autofocus></button></form>
        </header>
        @if (momentContext(); as snapshot) {
          <app-habit-moment-editor #momentEditor [context]="snapshot" (completed)="finishMoment($event,recordDialog)" />
        }
      </dialog>
    }
  `,
})
export class AgreementDetail {
  private readonly data = inject(AgreementsData);
  private readonly profile = inject(PreviewProfile);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly params = toSignal(this.route.paramMap,{initialValue:this.route.snapshot.paramMap});
  private lastView?: NonNullable<Awaited<ReturnType<AgreementsData['detail']>>>;
  protected readonly stale = signal(false);
  protected readonly canRecord = canRecordMoment;
  protected readonly momentRefresh = signal(0);
  protected readonly momentNotice = signal(this.router.currentNavigation()?.extras.state?.['habitMomentSaved']===true
    ? 'Momento registrado no histórico do Hábito.' : '');
  protected readonly momentContext = signal<HabitContext|null>(null);
  private readonly editor = viewChild<HabitMomentEditor>('momentEditor');
  protected readonly editorPending = computed(()=>this.editor()?.pending() ?? false);
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

  protected openMoment(context:HabitContext,dialog:HTMLDialogElement) {
    this.momentNotice.set('');
    this.momentContext.set(context);
    dialog.showModal();
  }

  protected closeMoment(dialog:HTMLDialogElement) {
    if (!dialog.open && !this.editorPending()) this.momentContext.set(null);
  }

  protected finishMoment(kind:'saved'|'unknown',dialog:HTMLDialogElement) {
    this.momentRefresh.update(value=>value+1);
    if (kind==='saved') {
      if (dialog.open) dialog.close();
      this.momentContext.set(null);
      this.momentNotice.set('Momento registrado no histórico do Hábito.');
    } else this.momentNotice.set('O registro não foi confirmado. Confira o histórico antes de enviar outro momento.');
    if (this.route.snapshot.queryParamMap.has('antes')) {
      void this.router.navigate([], {relativeTo:this.route,queryParams:{antes:null},queryParamsHandling:'merge',replaceUrl:true});
    }
  }
}
