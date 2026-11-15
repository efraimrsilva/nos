import { Component, DestroyRef, ElementRef, inject, input, output, signal } from '@angular/core';
import { PreviewProfile } from '../preview-profile';
import { NucleusManagementData, type ManagementOperation, type ManagementScope } from './nucleus-management-data';

@Component({
  selector:'app-nucleus-action',
  template:`
    <form class="nucleus-action-form" (submit)="submit($event)" [attr.aria-busy]="pending()">
      <fieldset [disabled]="pending() || locked()">
        @if (field(); as detail) {
          <div class="nucleus-action-field">
            <label [attr.for]="'nucleus-action-'+operation()">{{ detail.label }}</label>
            @if (detail.multiline) {
              <textarea [id]="'nucleus-action-'+operation()" name="value" [defaultValue]="detail.initial ?? ''" rows="4" required></textarea>
            } @else {
              <input [id]="'nucleus-action-'+operation()" name="value" [attr.value]="detail.initial ?? ''" [attr.autocomplete]="operation()==='close' ? 'off' : null" required>
            }
          </div>
        }
        <label class="nucleus-confirm"><input type="checkbox" name="confirmed" required><span>{{ confirmation() }}</span></label>
        <button type="submit" class="button" [class.nucleus-danger]="danger()">{{ pending() ? 'Aguarde…' : label() }}</button>
      </fieldset>
      @if (error()) { <p class="form-error" role="alert">{{ error() }}</p> }
    </form>
  `,
})
export class NucleusAction {
  readonly scope = input.required<ManagementScope>();
  readonly operation = input.required<ManagementOperation>();
  readonly label = input.required<string>();
  readonly confirmation = input.required<string>();
  readonly field = input<{label:string;max:number;initial?:string;multiline?:boolean}>();
  readonly target = input<string>();
  readonly danger = input(false);
  readonly locked = input(false);
  readonly busy = output<boolean>();
  readonly completed = output<ManagementOperation>();
  private readonly destroy = inject(DestroyRef);
  private readonly data = inject(NucleusManagementData);
  private readonly profile = inject(PreviewProfile);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly pending = signal(false);
  protected readonly error = signal('');

  reset() {
    this.error.set('');
    this.host.nativeElement.querySelector('form')?.reset();
  }

  protected async submit(event: Event) {
    event.preventDefault();
    if (this.locked() || this.pending()) return;
    const form = event.currentTarget as HTMLFormElement;
    const values = new FormData(form);
    const scope = this.scope();
    const operation = this.operation();
    const value = String(values.get('value') ?? '').trim();
    const field = this.field();
    if (!values.has('confirmed')) return;
    if (field && (!value || Array.from(value).length > field.max)) {
      this.error.set(`Preencha o campo com até ${field.max} caracteres.`);
      return;
    }
    this.error.set('');
    this.pending.set(true);
    this.busy.emit(true);
    try {
      const failure = await this.data.apply(scope,operation,this.target(),value);
      if (this.destroy.destroyed || this.profile.user()?.id !== scope.owner || this.scope().id !== scope.id) return;
      if (failure) this.error.set(failure);
      else {
        (form.elements.namedItem('confirmed') as HTMLInputElement).checked = false;
        this.completed.emit(operation);
      }
    } catch {
      if (!this.destroy.destroyed) this.error.set('Não foi possível confirmar a ação. Confira sua sessão e tente novamente.');
    } finally {
      this.pending.set(false);
      if (!this.destroy.destroyed) this.busy.emit(false);
    }
  }
}
