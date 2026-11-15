import { Component,DestroyRef,inject,input,signal } from '@angular/core';
import { HabitData,type HabitContext } from './habit-data';
import { cycleActions,cycleDescriptions,cycleLabels,type CycleAction } from './habit-model';

@Component({
  selector:'app-habit-administration',
  template:`
    <p>A administração organiza o ciclo. Cada pessoa decide sobre a própria participação.</p>
    <div class="agreement-actions habit-section-gap">
      @for (action of actions(context().agreement.status); track action) {
        <button type="button" class="button secondary" aria-haspopup="dialog" [disabled]="pending() || loading()"
          (click)="open(action,confirmation,form)">{{ labels[action] }}</button>
      }
    </div>
    @if (success()) { <p role="status">{{ success() }}</p> }
    <dialog #confirmation class="shared-dialog" aria-label="Administrar o ciclo">
      <header class="dialog-heading"><h2>Administrar o ciclo</h2>
        <form method="dialog"><button class="icon-button" aria-label="Fechar administração" autofocus>×</button></form>
      </header>
      @if (selected(); as choice) {
        <p class="badge">Termos v{{ choice.context.agreement.terms_version }}</p>
        <p>{{ descriptions[choice.action] }}</p>
      }
      <form #form class="agreement-form" (submit)="apply($event,confirmation)" [attr.aria-busy]="pending()">
        @if (selected(); as choice) {
          <label class="nucleus-confirm"><input type="checkbox" name="confirmed" [disabled]="pending()" required>
            <span>Entendi e quero confirmar esta ação.</span></label>
          @if (error()) { <p class="form-error" role="alert">{{ error() }}</p> }
          <button class="button" type="submit" [class.nucleus-danger]="choice.action==='end'" [disabled]="pending() || loading()">
            {{ pending()?'Confirmando…':labels[choice.action] }}
          </button>
        }
      </form>
    </dialog>
  `,
})
export class HabitAdministration {
  readonly context = input.required<HabitContext>();
  readonly loading = input(false);
  readonly pending = signal(false);
  protected readonly actions = cycleActions;
  protected readonly labels = cycleLabels;
  protected readonly descriptions = cycleDescriptions;
  protected readonly selected = signal<{action:CycleAction;context:HabitContext}|null>(null);
  protected readonly error = signal('');
  protected readonly success = signal('');
  private readonly data = inject(HabitData);
  private readonly destroy = inject(DestroyRef);

  protected open(action:CycleAction,dialog:HTMLDialogElement,form:HTMLFormElement) {
    if (this.pending()) return;
    form.reset();
    this.error.set('');
    this.success.set('');
    this.selected.set({action,context:this.context()});
    dialog.showModal();
  }

  protected async apply(event:Event,dialog:HTMLDialogElement) {
    event.preventDefault();
    const choice = this.selected();
    if (!choice || this.pending() || this.loading() || !new FormData(event.currentTarget as HTMLFormElement).has('confirmed')) return;
    this.pending.set(true);
    this.error.set('');
    try {
      const error = await this.data.apply(choice.context,choice.action);
      if (this.destroy.destroyed || this.context().agreement.id!==choice.context.agreement.id) return;
      if (error) this.error.set(error);
      else {
        if (dialog.open) dialog.close();
        this.success.set('Ciclo atualizado.');
      }
    } catch {
      if (!this.destroy.destroyed) this.error.set('Não foi possível conferir a sessão.');
    } finally {this.pending.set(false);}
  }
}
