import { afterNextRender, Component, ElementRef, effect, inject, Injector, resource, signal, untracked, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { NavIcon } from '../shared/nav-icon';
import { findNucleusType, formatCalendarEventDate, profileLetters } from './nucleus-model';
import { NucleiData, type Member } from './nuclei-data';
import { NucleusAction } from './nucleus-action';
import { type ManagementOperation, type ManagementScope } from './nucleus-management-data';
import { watchNucleusIdentity } from './nucleus-identity-sync';
import { NucleusRoleBadge } from './nucleus-role-badge';

@Component({
  imports:[RouterLink,NucleusAction,NavIcon,NucleusRoleBadge],
  templateUrl:'./nucleus-home.html',
})
export class NucleusHome {
  private readonly profile = inject(PreviewProfile);
  private readonly data = inject(NucleiData);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly params = toSignal(this.route.paramMap,{initialValue:this.route.snapshot.paramMap});
  private readonly query = toSignal(this.route.queryParamMap,{initialValue:this.route.snapshot.queryParamMap});
  private readonly people = viewChild<ElementRef<HTMLDialogElement>>('people');
  private readonly details = viewChild<ElementRef<HTMLDialogElement>>('details');
  private readonly editForm = viewChild<NucleusAction>('editForm');
  protected readonly editing = signal(false);
  private readonly stale = signal(false);
  protected readonly memberId = signal<string|null>(null);
  protected readonly identity = signal<{operation:'name'|'purpose';value:string}|null>(null);
  protected readonly feedback = signal('');
  protected readonly actionBusy = signal(false);
  protected readonly initials = profileLetters;
  private lastView?: NonNullable<Awaited<ReturnType<NucleiData['home']>>> & {scope:ManagementScope;version:string|null};
  protected readonly state = resource({
    params:() => {
      const user = this.profile.user();
      const id = this.params().get('id');
      return user && id ? {owner:user.id,id} : undefined;
    },
    loader:async ({params,abortSignal}) => {
      // Leia o resumo antes dos dados para a próxima conferência detectar mudanças durante o carregamento.
      const version = await this.data.identityVersion(params.owner,abortSignal).catch(() => null);
      try {
        const view = await this.data.home(params.owner,params.id,abortSignal);
        const snapshot = view ? {...view,version,scope:params} : null;
        // Uma resposta atrasada de outra rota ou sessão não muda a seleção desta conta.
        if (!abortSignal.aborted && this.profile.user()?.id === params.owner) {
          this.stale.set(false);
          this.lastView = snapshot ?? undefined;
          if (view) this.data.remember(params.owner,view.nucleus.id);
          else this.data.forget(params.owner,params.id);
        }
        return snapshot;
      } catch (error) {
        // Só falhas transitórias preservam a tela e o rascunho. Uma consulta sem vínculo retorna null.
        const last = this.lastView;
        if (!abortSignal.aborted && last?.scope.owner === params.owner && last.scope.id === params.id) {
          this.stale.set(true);
          return last;
        }
        throw error;
      }
    },
  });
  protected readonly date = formatCalendarEventDate;
  // A miniatura acompanha a grade UTC da Agenda; a descrição mantém o fuso do evento.
  protected readonly day = (date:string) => new Date(date).getUTCDate();
  protected readonly month = (date:string) => new Intl.DateTimeFormat('pt-BR',{month:'short',timeZone:'UTC'}).format(new Date(date));

  constructor() {
    watchNucleusIdentity(() => this.state.hasValue() ? this.state.value()?.version : undefined,
      () => this.state.isLoading() || this.actionPending(), () => this.state.reload(),
      async signal => {
        const view = this.state.hasValue() ? this.state.value() : null;
        if (this.stale()) return true;
        if (!view || !this.people()?.nativeElement.open) return false;
        const members = await this.data.members(view.scope.owner,view.scope.id,signal);
        return this.state.hasValue() && this.state.value() === view &&
          members !== null && JSON.stringify(members) !== JSON.stringify(view.members);
      });
    effect(() => {
      this.params().get('id');
      this.memberId.set(null);
      this.identity.set(null);
      this.feedback.set('');
      this.actionBusy.set(false);
      this.editing.set(false);
    });
    effect(() => {
      const id = this.memberId();
      if (id && this.state.hasValue() && !this.state.value()?.members.some(member => member.user_id === id)) {
        const detail = this.details()?.nativeElement;
        if (detail?.open) {
          detail.close();
          this.people()?.nativeElement.querySelector('button')?.focus();
        }
        this.memberId.set(null);
        this.actionBusy.set(false);
      }
    });
    effect(() => {
      if (this.query().get('integrantes') !== '1') return;
      const dialog = this.people()?.nativeElement;
      if (dialog && !dialog.open) untracked(() => dialog.showModal());
    });
  }

  protected openPeople(dialog: HTMLDialogElement) {
    if (!this.actionPending()) this.state.reload();
    dialog.showModal();
  }

  private actionPending() { return this.actionBusy() || this.editing(); }

  protected closePeople() {
    if (this.query().get('integrantes') === '1') {
      void this.router.navigate([], {relativeTo:this.route,queryParams:{integrantes:null},queryParamsHandling:'merge',replaceUrl:true});
    }
  }

  protected editIdentity(operation:'name'|'purpose',value:string,dialog:HTMLDialogElement) {
    this.feedback.set('');
    this.identity.set({operation,value});
    this.openAfterRender(dialog);
  }

  protected openMember(id:string,dialog:HTMLDialogElement) {
    this.feedback.set('');
    this.memberId.set(id);
    this.openAfterRender(dialog);
  }

  private openAfterRender(dialog:HTMLDialogElement) {
    // O navegador só aplica autofocus depois que o conteúdo condicional estiver no DOM.
    afterNextRender(() => {
      if (dialog.isConnected && !dialog.open) dialog.showModal();
    },{injector:this.injector});
  }

  protected resetIdentity() { this.editForm()?.reset(); }

  protected hasOtherAdmin(members: Member[], owner: string) {
    return members.some(member => member.user_id !== owner && member.role === 'admin');
  }

  protected finish(operation:ManagementOperation,dialog?:HTMLDialogElement) {
    if (dialog?.open) {
      dialog.close();
      // A linha removida deixa de existir; devolva o foco a um controle estável da lista.
      this.people()?.nativeElement.querySelector('button')?.focus();
    }
    this.feedback.set(operation==='name' ? 'Nome atualizado.' : operation==='purpose' ? 'Propósito atualizado.' : 'Alteração concluída.');
    this.state.reload();
  }
  protected typeLabel(value:string) { return findNucleusType(value)?.label ?? 'Núcleo'; }

  protected status(value:string) {
    const labels: Record<string,string> = {
      pending:'Proposta enviada',testing:'Em teste',active:'Acordo ativo',declined:'Proposta recusada',ended:'Encerrado',
    };
    return labels[value] ?? 'Acordo';
  }

}
