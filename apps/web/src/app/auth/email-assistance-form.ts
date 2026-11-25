import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { AccessAuth, type EmailKind } from './access-auth';
import { Notice } from '../shared/notice';

@Component({
  selector: 'app-email-assistance-form',
  templateUrl: './email-assistance-form.html',
  styleUrl: './email-assistance-form.css',
})
export class EmailAssistanceForm {
  readonly kind = input.required<EmailKind>();
  readonly prefix = input.required<string>();
  readonly next = input.required<string>();
  readonly email = input('');
  private readonly access = inject(AccessAuth);
  private readonly notices = inject(Notice);
  private readonly destroy = inject(DestroyRef);
  protected readonly emailPending = signal(false);
  protected readonly emailError = signal('');

  protected async sendEmail(event: Event, email: string) {
    event.preventDefault();
    if (this.emailPending()) return;
    this.emailPending.set(true);
    this.emailError.set('');
    try {
      // Login e conta autenticada seguem a mesma validação e o mesmo intervalo de envio.
      const result = await this.access.sendEmail(this.kind(), email, this.next());
      if (this.destroy.destroyed) return;
      if (result.success) this.notices.show(result.message);
      else this.emailError.set(result.message);
    } finally {
      if (!this.destroy.destroyed) this.emailPending.set(false);
    }
  }
}
