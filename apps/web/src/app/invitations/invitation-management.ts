import { Component, computed, DestroyRef, effect, inject, resource, signal, viewChild, type ElementRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { pageNumber } from '../nuclei/nucleus-model';
import { NavIcon } from '../shared/nav-icon';
import { InvitationGenerator } from './invitation-generator';
import { InvitationsData, inviteDate, type InviteScope, type InviteSummary } from './invitations-data';
import { Notice } from '../shared/notice';

const filters = [
  {key:'ativos',title:'Ativos',label:'Ativo'},
  {key:'expirados',title:'Expirados',label:'Expirado'},
  {key:'revogados',title:'Revogados',label:'Revogado'},
] as const;

@Component({
  imports:[RouterLink,InvitationGenerator,NavIcon],
  templateUrl:'./invitation-management.html',
})
export class InvitationManagement {
  private readonly notices = inject(Notice);
  private readonly routerState = inject(ActivatedRoute);
  private readonly profile = inject(PreviewProfile);
  private readonly data = inject(InvitationsData);
  private readonly destroy = inject(DestroyRef);
  private readonly route = toSignal(this.routerState.paramMap,{initialValue:this.routerState.snapshot.paramMap});
  private readonly query = toSignal(this.routerState.queryParamMap,{initialValue:this.routerState.snapshot.queryParamMap});
  protected readonly filters = filters;
  protected readonly filter = computed(() => {
    const values = this.query().getAll('status');
    return (values.length === 1 && filters.find(item => item.key === values[0])) || filters[0];
  });
  protected readonly page = computed(() => pageNumber(this.query().getAll('pagina')));
  private readonly owner = computed(() => this.profile.user()?.id);
  private readonly nucleusId = computed(() => this.route().get('id'));
  private readonly scope = computed(() => {
    const owner = this.owner();
    const id = this.nucleusId();
    return owner && id ? {owner,id} : undefined;
  });
  private lastView?: NonNullable<Awaited<ReturnType<InvitationsData['list']>>> & {
    scope: InviteScope; filter: typeof filters[number]['key']; page: number;
  };
  protected readonly state = resource({
    params:() => {
      const scope = this.scope();
      return scope ? {scope,filter:this.filter().key,page:this.page()} : undefined;
    },
    loader:async ({params,abortSignal}) => {
      const result = await this.data.list(params.scope,params.filter,params.page,abortSignal);
      const view = result ? {...result,...params} : null;
      if (!abortSignal.aborted) this.lastView = view ?? undefined;
      return view;
    },
  });
  protected readonly view = computed(() => {
    const scope = this.scope();
    const current = this.state.hasValue() ? this.state.value() : null;
    if (current && scope?.id === current.scope.id && scope.owner === current.scope.owner) return current;
    const last = this.lastView;
    // O filtro pode mudar, mas os registros antigos só pertencem ao mesmo Núcleo e conta.
    return this.state.isLoading() && last && scope?.id === last.scope.id && scope.owner === last.scope.owner ? last : null;
  });
  protected readonly renderedFilter = computed(() => filters.find(filter => filter.key === this.view()?.filter) ?? filters[0]);
  protected readonly selectedId = signal<string|null>(null);
  protected readonly selected = computed(() => {
    const rows = this.view()?.rows;
    return rows?.find(item => item.id === this.selectedId()) ?? rows?.[0];
  });
  protected readonly preparing = signal(false);
  protected readonly revoking = signal(false);
  protected readonly error = signal('');
  protected readonly revokeTarget = signal<{scope:InviteScope; id:string}|null>(null);
  private readonly revokeDialog = viewChild<ElementRef<HTMLDialogElement>>('revokeDialog');
  protected readonly date = inviteDate;

  constructor() {
    effect(() => {
      // Abrir outra página ou filtro retira da tela o código e a confirmação anteriores.
      this.route().get('id');
      this.filter();
      this.page();
      this.selectedId.set(null);
      this.preparing.set(false);
      this.revokeTarget.set(null);
      this.error.set('');
    });
  }

  protected askRevoke(scope: InviteScope, item: InviteSummary, dialog: HTMLDialogElement) {
    if (this.revoking() || this.state.isLoading()) return;
    this.revokeTarget.set({scope,id:item.id});
    this.error.set('');
    dialog.showModal();
  }

  protected async revoke(event: Event) {
    event.preventDefault();
    const action = this.revokeTarget();
    if (!action || this.revoking()) return;
    this.revoking.set(true);
    this.error.set('');
    try {
      await this.data.revoke(action.scope,action.id);
      if (!this.stillCurrent(action.scope)) return;
      this.revokeDialog()?.nativeElement.close();
      this.notices.show('Convite revogado.');
      this.state.reload();
    } catch {
      if (this.stillCurrent(action.scope)) this.error.set('Não foi possível revogar o convite. Confira seu acesso e tente novamente.');
    } finally { this.revoking.set(false); }
  }

  private stillCurrent(scope: InviteScope) {
    return !this.destroy.destroyed && this.profile.user()?.id === scope.owner && this.route().get('id') === scope.id;
  }
}
