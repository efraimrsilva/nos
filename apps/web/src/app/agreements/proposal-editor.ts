import { afterNextRender, Component, DestroyRef, ElementRef, inject, Injector, input, output, signal, viewChild } from '@angular/core';
import { AgreementsData } from './agreements-data';
import { type AgreementScope, proposalTerms } from './proposal-model';

@Component({
  selector:'app-proposal-editor',
  templateUrl:'./proposal-editor.html',
})
export class ProposalEditor {
  readonly scope = input.required<AgreementScope>();
  readonly completed = output<'created'|'unknown'>();
  readonly pending = signal(false);
  private readonly data = inject(AgreementsData);
  private readonly destroy = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly form = viewChild<ElementRef<HTMLFormElement>>('proposalForm');
  private readonly headline = viewChild<ElementRef<HTMLElement>>('reviewHeading');
  private readonly first = viewChild<ElementRef<HTMLInputElement>>('firstField');
  protected readonly review = signal<ReturnType<typeof proposalTerms>>(null);
  protected readonly error = signal('');
  protected readonly unknown = signal(false);

  reset() {
    if (this.pending()) return;
    this.form()?.nativeElement.reset();
    this.review.set(null);
    this.error.set('');
    this.unknown.set(false);
  }

  protected edit() {
    if (this.pending()) return;
    this.review.set(null);
    this.error.set('');
    afterNextRender(() => this.first()?.nativeElement.focus(),{injector:this.injector});
  }

  protected async submit(event:Event) {
    event.preventDefault();
    if (this.pending() || this.unknown()) return;
    this.error.set('');
    if (!this.review()) {
      const form = event.currentTarget as HTMLFormElement;
      const terms = proposalTerms(new FormData(form));
      if (!terms) {
        this.error.set('Preencha os termos da proposta e informe uma duração inteira de 7 a 30 dias.');
        return;
      }
      // Conferir e voltar à edição são operações locais. Só o segundo envio grava.
      this.review.set(terms);
      afterNextRender(() => this.headline()?.nativeElement.focus(),{injector:this.injector});
      return;
    }
    const terms = this.review()!;
    const scope = this.scope();
    this.pending.set(true);
    try {
      const {kind} = await this.data.create(scope,terms);
      if (this.destroy.destroyed || this.scope().id !== scope.id) return;
      if (kind === 'unknown') {
        this.unknown.set(true);
        this.error.set('O envio não foi confirmado. Feche esta janela e confira a lista antes de criar outra proposta.');
        this.completed.emit(kind);
      } else if (kind === 'created') this.completed.emit(kind);
      else this.error.set('Não foi possível enviar a proposta. Confira se você ainda participa do Núcleo e tente novamente.');
    } catch {
      if (!this.destroy.destroyed) this.error.set('Não foi possível conferir a sessão. Entre novamente e tente enviar a proposta.');
    } finally { this.pending.set(false); }
  }
}
