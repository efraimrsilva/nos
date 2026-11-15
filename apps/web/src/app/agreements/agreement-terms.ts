import { Component, DestroyRef, computed, inject, input, output, signal, effect, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AgreementTotals } from './agreement-totals';
import { AgreementsData } from './agreements-data';
import { accepted, canRespond, participationLabel,statusLabel,type Agreement,type AgreementCount,type AgreementScope,type Response } from './proposal-model';

@Component({
  selector:'app-agreement-terms',
  imports:[AgreementTotals,RouterLink],
  templateUrl:'./agreement-terms.html',
})
export class AgreementTerms {
  readonly scope = input.required<AgreementScope>();
  readonly agreement = input.required<Agreement>();
  readonly count = input<AgreementCount>();
  readonly countFailed = input(false);
  readonly link = input(false);
  readonly loading = input(false);
  readonly countTick = input(0);
  readonly live = input(true);
  readonly refreshed = output<void>();
  private readonly data = inject(AgreementsData);
  private readonly destroy = inject(DestroyRef);
  protected readonly status = statusLabel;
  protected readonly responseLabel = participationLabel;
  protected readonly accepts = accepted;
  protected readonly canRespond = canRespond;
  protected readonly pending = signal(false);
  protected readonly error = signal('');
  protected readonly feedback = signal('');
  protected readonly confirming = signal<Agreement|null>(null);
  private readonly id = computed(() => this.agreement().id);

  constructor() {
    effect(() => {
      this.id();
      this.error.set('');
      this.feedback.set('');
    });
    effect(onCleanup => {
      const tick = this.countTick(), id = this.id();
      if (!tick || !this.live()) return;
      const scope = this.scope();
      const snapshot = untracked(this.agreement);
      if (untracked(() => this.loading() || this.pending() || this.confirming())) return;
      const request = new AbortController();
      onCleanup(() => request.abort());
      // Contagens e termos podem mudar em outra sessão; confira apenas o acordo aberto.
      void this.data.termsChanged(scope,snapshot,request.signal).then(changed => {
        if (changed && !request.signal.aborted && this.id() === id && !this.pending() && !this.confirming() && !this.loading()) {
          this.feedback.set('');
          this.refreshed.emit();
        }
      }).catch(() => { /* Falha de leitura mantém os termos em tela até a próxima conferência. */ });
    });
  }

  protected openDecline(dialog:HTMLDialogElement) {
    this.confirming.set(this.agreement());
    dialog.showModal();
  }

  protected async respond(response:Response, dialog?:HTMLDialogElement) {
    if (this.pending() || this.loading()) return;
    // A confirmação só vale para os termos lidos antes de abrir a recusa.
    const scope = this.scope(), agreement = dialog ? this.confirming() : this.agreement();
    if (!agreement) return;
    this.pending.set(true);
    this.error.set('');
    this.feedback.set('');
    try {
      const result = await this.data.respond(scope,agreement,response);
      if (this.destroy.destroyed || this.scope().id !== scope.id || this.agreement().id !== agreement.id) return;
      if (result === 'saved') this.feedback.set('Sua resposta foi registrada.');
      else if (result === 'changed') this.error.set('Os termos mudaram. Confira a versão atual antes de responder.');
      else if (result === 'unavailable') this.error.set('O acordo não recebe esta resposta ou seu acesso mudou.');
      else this.error.set('Não foi possível confirmar a resposta. Confira sua participação atual antes de repetir.');
      if (dialog?.open) dialog.close();
    } catch {
      if (!this.destroy.destroyed) {
        if (dialog?.open) dialog.close();
        this.error.set('Não foi possível conferir sua sessão. Entre novamente e tente outra vez.');
      }
    } finally { this.pending.set(false); }
  }
}
