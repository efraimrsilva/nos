import { Component, computed, DestroyRef, effect, inject, resource, signal, viewChild, type ElementRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { pageNumber } from '../nuclei/nucleus-model';
import { InvitationGenerator } from './invitation-generator';
import { InvitationsData, inviteDate, type InviteScope, type InviteSummary } from './invitations-data';

const filters = [
  {key:'ativos',title:'Ativos',label:'Ativo'},
  {key:'expirados',title:'Expirados',label:'Expirado'},
  {key:'revogados',title:'Revogados',label:'Revogado'},
] as const;

@Component({
  imports:[RouterLink,InvitationGenerator],
  templateUrl:'./invitation-management.html',
})
export class InvitationManagement {
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
  protected readonly state = resource({
    params:() => {
      const owner = this.profile.user()?.id;
      const id = this.route().get('id');
      return owner && id ? {scope:{owner,id},filter:this.filter().key,page:this.page()} : undefined;
    },
    loader:async ({params,abortSignal}) => {
      const result = await this.data.list(params.scope,params.filter,params.page,abortSignal);
      return result ? {...result,scope:params.scope,filter:params.filter,page:params.page} : null;
    },
  });
  protected readonly selectedId = signal<string|null>(null);
  protected readonly selected = computed(() => {
    const rows = this.state.hasValue() ? this.state.value()?.rows : null;
    return rows?.find(item => item.id === this.selectedId()) ?? rows?.[0];
  });
  protected readonly preparing = signal(false);
  protected readonly revoking = signal(false);
  protected readonly success = signal('');
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
      this.success.set('');
      this.error.set('');
    });
  }

  protected askRevoke(scope: InviteScope, item: InviteSummary, dialog: HTMLDialogElement) {
    if (this.revoking()) return;
    this.revokeTarget.set({scope,id:item.id});
    this.error.set('');
    this.success.set('');
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
      this.success.set('Convite revogado. Quem já participa continua no Núcleo.');
      this.state.reload();
    } catch {
      if (this.stillCurrent(action.scope)) this.error.set('Não foi possível revogar o convite. Confira seu acesso e tente novamente.');
    } finally { this.revoking.set(false); }
  }

  private stillCurrent(scope: InviteScope) {
    return !this.destroy.destroyed && this.profile.user()?.id === scope.owner && this.route().get('id') === scope.id;
  }
}
