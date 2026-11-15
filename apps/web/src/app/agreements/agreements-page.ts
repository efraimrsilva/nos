import { NgTemplateOutlet } from '@angular/common';
import { afterNextRender, Component, computed, DestroyRef, effect, inject, Injector, resource, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { pageNumber } from '../nuclei/nucleus-model';
import { InvitationGenerator } from '../invitations/invitation-generator';
import { AgreementTerms } from './agreement-terms';
import { AgreementTotals } from './agreement-totals';
import { AgreementsData } from './agreements-data';
import { watchAgreementCounts } from './agreement-counts';
import { agreementColumn,filterAgreementCards,participationLabel,statusLabel } from './proposal-model';
import { ProposalEditor } from './proposal-editor';

@Component({
  imports:[RouterLink,NgTemplateOutlet,AgreementTerms,AgreementTotals,ProposalEditor,InvitationGenerator],
  templateUrl:'./agreements-page.html',
})
export class AgreementsPage {
  private readonly data = inject(AgreementsData);
  private readonly profile = inject(PreviewProfile);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly params = toSignal(this.route.paramMap,{initialValue:this.route.snapshot.paramMap});
  private readonly query = toSignal(this.route.queryParamMap,{initialValue:this.route.snapshot.queryParamMap});
  private lastView?: {view:NonNullable<Awaited<ReturnType<AgreementsData['list']>>>;page:number};
  protected readonly stale = signal(false);
  protected readonly page = computed(() => {
    const current = pageNumber(this.query().getAll('pagina'));
    return current <= 1000 ? current : 1;
  });
  protected readonly state = resource({
    params:() => {
      const owner = this.profile.user()?.id, id = this.params().get('id');
      return owner && id ? {scope:{owner,id},page:this.page()} : undefined;
    },
    loader:async ({params,abortSignal}) => {
      try {
        const view = await this.data.list(params.scope,params.page,abortSignal);
        if (!abortSignal.aborted) {
          this.lastView = view ? {view,page:params.page} : undefined;
          this.stale.set(false);
        }
        return view;
      } catch (error) {
        // Só uma falha de leitura preserva o rascunho naquele Núcleo e página.
        const previous = this.lastView;
        if (!abortSignal.aborted && previous?.page === params.page &&
            previous.view.scope.id === params.scope.id && previous.view.scope.owner === params.scope.owner) {
          this.stale.set(true);
          return previous.view;
        }
        throw error;
      }
    },
  });
  protected readonly counts = watchAgreementCounts(computed(() => {
    const view = this.state.hasValue() ? this.state.value() : null;
    return view ? {...view.scope,ids:view.rows.map(row=>row.id).sort()} : undefined;
  },{equal:(a,b)=>a?.owner === b?.owner && a?.id === b?.id && a?.ids.join() === b?.ids.join()}));
  protected readonly search = signal('');
  protected readonly mode = signal<'kanban'|'panels'>('kanban');
  protected readonly desktop = signal(false);
  protected readonly active = signal<string|null>(null);
  protected readonly openAgreement = signal<string|null>(null);
  protected readonly showing = signal(false);
  protected readonly inviteOpen = signal(false);
  protected readonly notice = signal('');
  protected readonly uncertain = signal(false);
  protected readonly visible = computed(() => filterAgreementCards(this.state.hasValue() ? this.state.value()?.rows ?? [] : [],this.search(),'all'));
  protected readonly proposals = computed(() => this.visible().filter(card=>agreementColumn(card)==='proposal'));
  protected readonly habits = computed(() => this.visible().filter(card=>agreementColumn(card)==='habit'));
  protected readonly selected = computed(() => this.visible().find(card=>card.id===this.active()) ?? this.visible()[0]);
  protected readonly dialogItem = computed(() => {
    const view = this.state.hasValue() ? this.state.value() : null;
    return view?.rows.find(card=>card.id===this.openAgreement());
  });
  protected readonly status = statusLabel;
  protected readonly responseLabel = participationLabel;

  constructor() {
    const media = matchMedia('(min-width: 701px)');
    const update = () => this.desktop.set(media.matches);
    update();
    media.addEventListener('change',update);
    inject(DestroyRef).onDestroy(() => media.removeEventListener('change',update));
    effect(() => {
      this.params().get('id');
      this.search.set('');
      this.active.set(null);
      this.openAgreement.set(null);
      this.showing.set(false);
      this.notice.set('');
      this.uncertain.set(false);
      this.inviteOpen.set(false);
    });
    effect(() => {
      const request = this.data.changes();
      if (request && request.owner === this.profile.user()?.id && request.id === this.params().get('id')) {
        untracked(() => this.refreshResponses());
      }
    });
  }

  protected showDetails(id:string,dialog:HTMLDialogElement) {
    this.openAgreement.set(id);
    this.showing.set(true);
    // A lista pode ter ficado aberta desde a última resposta ou revisão.
    this.state.reload();
    afterNextRender(() => {
      if (dialog.isConnected && !dialog.open) dialog.showModal();
    },{injector:this.injector});
  }

  protected refreshResponses() {
    this.state.reload();
    this.counts.refresh();
  }

  protected finishProposal(kind:'created'|'unknown',dialog:HTMLDialogElement) {
    this.uncertain.set(kind==='unknown');
    if (kind === 'unknown') {
      this.notice.set('O envio não foi confirmado. Confira a primeira página antes de criar outra proposta.');
      this.state.reload();
      return;
    }
    this.notice.set('Proposta enviada. Escolha se deseja participar dos termos.');
    this.search.set('');
    if (dialog.open) dialog.close();
    if (this.page() !== 1) {
      void this.router.navigate([], {relativeTo:this.route,queryParams:{},replaceUrl:true});
    } else this.state.reload();
  }
}
