import { Component, DestroyRef, effect, inject, input, signal, viewChild, type ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { parseProblemReport } from '../../../../src/features/support/input';
import { NavIcon } from './shared/nav-icon';
import { PreviewProfile } from './preview-profile';

@Component({
  selector: 'app-problem-report',
  imports:[NavIcon],
  templateUrl: './problem-report.html',
  styleUrl: './account-preferences.css',
})
export class ProblemReport {
  readonly prefix = input.required<string>();
  readonly iconOnly = input(false);
  private readonly profile = inject(PreviewProfile);
  private readonly router = inject(Router);
  private readonly destroy = inject(DestroyRef);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  protected readonly description = signal('');
  protected readonly steps = signal('');
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  protected readonly sent = signal(false);
  protected readonly coolingDown = signal(false);
  private owner: string | undefined;
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    effect(() => {
      const id = this.profile.user()?.id;
      if (this.owner && this.owner !== id) this.dialog().nativeElement.close();
    });
    this.destroy.onDestroy(() => { clearTimeout(this.timer); this.owner = undefined; });
  }

  protected open() {
    this.owner = this.profile.user()?.id;
    if (this.owner) this.dialog().nativeElement.showModal();
  }

  protected reset() {
    this.owner = undefined;
    this.description.set('');
    this.steps.set('');
    this.sent.set(false);
    this.error.set('');
  }

  protected async submit(event: SubmitEvent) {
    event.preventDefault();
    const owner = this.owner;
    if (!owner || this.busy() || this.coolingDown() || this.sent()) return;
    const form = new FormData();
    form.set('description', this.description());
    form.set('steps', this.steps());
    form.set('route', this.router.url);
    const input = parseProblemReport(form);
    if (!input) {
      this.error.set('Descreva o problema com 10 a 2.000 caracteres. Os passos podem ter até 1.000 caracteres.');
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      const connection = await this.profile.connection();
      const session = (await connection?.client.auth.getSession())?.data.session;
      if (!session || session.user.id !== owner || this.profile.user()?.id !== owner) throw new Error();
      if (this.owner !== owner || !this.dialog().nativeElement.open) return;
      const response = await fetch('/api/problem-report', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + session.access_token},
        body: JSON.stringify(input),
        redirect: 'error',
      });
      const result = await response.json();
      if (this.owner !== owner || this.profile.user()?.id !== owner) return;
      if (typeof result.retryAt === 'number' && Number.isFinite(result.retryAt)) {
        this.coolingDown.set(true);
        this.timer = setTimeout(() => this.coolingDown.set(false), Math.min(60_000, Math.max(0, result.retryAt - Date.now())));
      }
      if (response.ok && result.success === true) {
        this.description.set('');
        this.steps.set('');
        this.sent.set(true);
      } else {
        this.error.set(typeof result.error === 'string' ? result.error : 'Não foi possível confirmar o envio. Seu texto foi mantido.');
      }
    } catch {
      if (this.owner === owner) this.error.set('Não foi possível confirmar o envio. Seu texto foi mantido.');
    } finally {
      this.busy.set(false);
    }
  }
}
