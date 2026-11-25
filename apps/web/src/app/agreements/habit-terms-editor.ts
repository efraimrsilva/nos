import { Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { Notice } from '../shared/notice';
import { HabitData, type HabitContext } from './habit-data';
import { canRespond } from './proposal-model';
import { readNewTerms } from './habit-model';

@Component({
  selector:'app-habit-terms-editor',
  templateUrl:'./habit-terms-editor.html',
})
export class HabitTermsEditor {
  readonly context = input.required<HabitContext>();
  readonly loading = input(false);
  private readonly data = inject(HabitData);
  private readonly notices = inject(Notice);
  private readonly destroy = inject(DestroyRef);
  protected readonly editable = computed(() => !this.loading() && canRespond(this.context().agreement));
  protected readonly draft = signal<HabitContext|null>(null);
  protected readonly pending = signal(false);
  protected readonly error = signal('');

  protected open(dialog:HTMLDialogElement) {
    if (this.pending() || !this.editable()) return;
    this.error.set('');
    this.draft.set(this.context());
    dialog.showModal();
  }

  protected cancel(dialog:HTMLDialogElement) {
    if (!dialog.open && !this.pending()) this.draft.set(null);
  }

  protected async submit(event:Event,dialog:HTMLDialogElement) {
    event.preventDefault();
    const draft = this.draft();
    if (!draft || this.pending() || !this.editable()) return;
    const form = new FormData(event.currentTarget as HTMLFormElement);
    if (!form.has('confirmed')) return;
    const terms = readNewTerms(form);
    if (!terms) {
      this.error.set('Preencha os campos dentro dos limites indicados.');
      return;
    }
    this.error.set('');
    this.pending.set(true);
    try {
      const error = await this.data.apply(draft,'terms',terms);
      if (this.destroy.destroyed || this.context().agreement.id !== draft.agreement.id) return;
      if (error) this.error.set(error);
      else {
        dialog.close();
        this.notices.show('Acordo atualizado.');
      }
    } catch {
      if (!this.destroy.destroyed) this.error.set('Não foi possível conferir a sessão.');
    } finally {
      this.pending.set(false);
      if (!this.destroy.destroyed) this.cancel(dialog);
    }
  }
}
