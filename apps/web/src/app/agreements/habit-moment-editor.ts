import { Component,DestroyRef,inject,input,output,signal } from '@angular/core';
import { HabitData,type HabitContext } from './habit-data';
import { habitMoodLabels,parseHabitMoment } from './habit-model';

@Component({
  selector:'app-habit-moment-editor',
  template:`
    <form class="agreement-form" (submit)="save($event)" [attr.aria-busy]="pending()">
      <p>Um registro compartilhado com o Núcleo. Escolha como foi o momento. A nota é opcional.</p>
      <p><span class="badge">Termos v{{ context().agreement.terms_version }}</span></p>
      <fieldset class="habit-moods" [disabled]="pending() || uncertain()">
        <legend>Como foi o momento?</legend>
        @for (mood of moods; track mood.key) {
          <label><input type="radio" name="mood" [value]="mood.key" required><span>{{ mood.label }}</span></label>
        }
      </fieldset>
      <label class="habit-note-field">Nota opcional
        <textarea class="habit-note" name="note" rows="4" maxlength="500" aria-describedby="habit-note-visibility" [disabled]="pending() || uncertain()"></textarea>
      </label>
      <p class="habit-field-help" id="habit-note-visibility">A nota fica visível às pessoas do Núcleo.</p>
      @if (error()) { <p class="form-error" role="alert">{{ error() }}</p> }
      <button class="button" type="submit" [disabled]="pending() || uncertain()">{{ pending()?'Salvando…':'Salvar momento' }}</button>
    </form>
  `,
})
export class HabitMomentEditor {
  readonly context = input.required<HabitContext>();
  readonly completed = output<'saved'|'unknown'>();
  readonly pending = signal(false);
  protected readonly uncertain = signal(false);
  protected readonly moods = Object.entries(habitMoodLabels).map(([key,label])=>({key,label}));
  protected readonly error = signal('');
  private readonly data = inject(HabitData);
  private readonly destroy = inject(DestroyRef);

  protected async save(event:Event) {
    event.preventDefault();
    if (this.pending() || this.uncertain()) return;
    const form = new FormData(event.currentTarget as HTMLFormElement);
    const moment = parseHabitMoment({mood:String(form.get('mood') ?? ''),note:String(form.get('note') ?? '')});
    if (!moment) {
      this.error.set('Selecione como foi o momento e escreva uma nota de até 500 caracteres.');
      return;
    }
    const context = this.context();
    this.error.set('');
    this.pending.set(true);
    try {
      const {kind} = await this.data.record(context,moment);
      if (this.destroy.destroyed || this.context().agreement.id!==context.agreement.id) return;
      if (kind==='changed') this.error.set('Os termos mudaram ou o acordo ficou indisponível. Abra um novo formulário após conferir a versão atual.');
      else if (kind==='blocked') this.error.set('Não foi possível registrar. Confira se o Hábito está em teste ou ativo e se você aceitou os termos atuais.');
      else {
        if (kind==='unknown') {
          this.uncertain.set(true);
          this.error.set('O registro não foi confirmado. Confira o histórico antes de enviar outro momento.');
        }
        this.completed.emit(kind);
      }
    } catch {
      if (!this.destroy.destroyed) this.error.set('Não foi possível conferir a sessão. Entre novamente antes de salvar.');
    } finally {this.pending.set(false);}
  }
}
