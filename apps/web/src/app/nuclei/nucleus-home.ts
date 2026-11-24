import { afterNextRender, Component, ElementRef, effect, inject, Injector, resource, signal, untracked, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { NavIcon } from '../shared/nav-icon';
import { findNucleusType, formatCalendarEventDate, profileLetters } from './nucleus-model';
import { NucleiData, type Member } from './nuclei-data';
import { NucleusAction } from './nucleus-action';
import { NucleusManagementData, type ManagementOperation, type ManagementScope } from './nucleus-management-data';
import { watchNucleusIdentity } from './nucleus-identity-sync';
import { NucleusRoleBadge } from './nucleus-role-badge';

type MemberOperation = 'promote' | 'demote' | 'remove';

@Component({
  imports:[RouterLink,NucleusAction,NavIcon,NucleusRoleBadge],
  templateUrl:'./nucleus-home.html',
})
export class NucleusHome {
  private readonly profile = inject(PreviewProfile);
  private readonly data = inject(NucleiData);
  private readonly management = inject(NucleusManagementData);
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
  protected readonly memberAction = signal<{id:string;operation:MemberOperation}|null>(null);
  protected readonly memberActions = {
    promote:{title:'Tornar administrador',confirmation:'Confirmo que esta pessoa passará a administrar o Núcleo.'},
    demote:{title:'Retirar administração',confirmation:'Confirmo que esta pessoa continuará no Núcleo como participante.'},
    remove:{title:'Remover do Núcleo',confirmation:'Entendi que esta pessoa perderá o acesso ao Núcleo.'},
  };
  protected readonly peopleTarget = signal<{id:string;name:string}|null>(null);
  protected readonly peopleFeedback = signal('');
  protected readonly leaveReview = signal(false);
  protected readonly leaveState = resource({
    params:() => {
      const owner = this.profile.user()?.id;
      const target = this.peopleTarget();
      return this.leaveReview() && owner && target ? {owner,id:target.id} : undefined;
    },
    loader:({params,abortSignal}) => this.management.leaveContext(params,abortSignal),
  });
  protected readonly peopleState = resource({
    params:() => {
      const owner = this.profile.user()?.id;
      const target = this.peopleTarget();
      return owner && target ? {owner,id:target.id} : undefined;
    },
    loader:async ({params,abortSignal}) => {
      // A consulta do modal revalida o vínculo com o Núcleo escolhido, sem trocar a rota.
      const members = await this.data.members(params.owner,params.id,abortSignal);
      const me = members?.find(member => member.user_id === params.owner);
      if (!members || !me) throw new Error('A lista de integrantes está indisponível.');
      return {scope:params,members,role:me.role};
    },
  });
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
        if (this.stale()) return true;
        const view = this.peopleState.hasValue() ? this.peopleState.value() : null;
        if (!view || !this.people()?.nativeElement.open) return false;
        const members = await this.data.members(view.scope.owner,view.scope.id,signal);
        if (this.peopleState.hasValue() && this.peopleState.value() === view &&
            JSON.stringify(members) !== JSON.stringify(view.members)) this.peopleState.reload();
        return false;
      });
    effect(() => {
      this.params().get('id');
      untracked(() => this.people()?.nativeElement.close());
      this.memberAction.set(null);
      this.identity.set(null);
      this.feedback.set('');
      this.actionBusy.set(false);
      this.editing.set(false);
    });
    effect(() => {
      const id = this.memberAction()?.id;
      if (id && this.peopleState.hasValue() && !this.peopleState.value()?.members.some(member => member.user_id === id)) {
        const detail = this.details()?.nativeElement;
        if (detail?.open) {
          detail.close();
          this.people()?.nativeElement.querySelector('button')?.focus();
        }
        this.memberAction.set(null);
        this.actionBusy.set(false);
      }
    });
    effect(() => {
      if (this.query().get('integrantes') !== '1') return;
      // O atalho de outro Núcleo só abre o modal após a consulta autorizada do destino.
      const view = this.state.hasValue() ? this.state.value() : null;
      if (!view || view.scope.id !== this.params().get('id')) return;
      const dialog = this.people()?.nativeElement;
      if (dialog && !dialog.open) untracked(() => this.openPeople(view.nucleus,dialog));
    });
  }

  protected openPeople(target:{id:string;name:string},dialog:HTMLDialogElement) {
    this.peopleFeedback.set('');
    this.peopleTarget.set(target);
    dialog.showModal();
  }

  private actionPending() { return this.actionBusy() || this.editing(); }

  protected closePeople() {
    if (this.people()?.nativeElement.open) return;
    this.details()?.nativeElement.close();
    this.peopleTarget.set(null);
    this.leaveReview.set(false);
    this.memberAction.set(null);
    this.actionBusy.set(false);
    if (this.query().get('integrantes') === '1') {
      void this.router.navigate([], {relativeTo:this.route,queryParams:{integrantes:null},queryParamsHandling:'merge',replaceUrl:true});
    }
  }

  protected editIdentity(operation:'name'|'purpose',value:string,dialog:HTMLDialogElement) {
    this.feedback.set('');
    this.identity.set({operation,value});
    this.openAfterRender(dialog);
  }

  protected openMember(id:string,operation:MemberOperation,dialog:HTMLDialogElement) {
    this.peopleFeedback.set('');
    this.memberAction.set({id,operation});
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

  protected finish(operation:ManagementOperation) {
    this.feedback.set(operation==='name' ? 'Nome atualizado.' : operation==='purpose' ? 'Propósito atualizado.' : 'Alteração concluída.');
    this.state.reload();
  }

  protected finishMember(dialog:HTMLDialogElement) {
    dialog.close();
    this.peopleFeedback.set('Alteração concluída.');
    this.peopleState.reload();
    this.state.reload();
  }

  protected finishLeave(scope:ManagementScope,dialog:HTMLDialogElement) {
    this.data.forget(scope.owner,scope.id);
    dialog.close();
    if (scope.id === this.params().get('id')) {
      void this.router.navigate(['/nucleos'],{replaceUrl:true});
    } else {
      this.feedback.set('Você saiu do Núcleo.');
      this.state.reload();
    }
  }
  protected typeLabel(value:string) { return findNucleusType(value)?.label ?? 'Núcleo'; }

  protected status(value:string) {
    const labels: Record<string,string> = {
      pending:'Proposta enviada',testing:'Em teste',active:'Acordo ativo',declined:'Proposta recusada',ended:'Encerrado',
    };
    return labels[value] ?? 'Acordo';
  }

}
