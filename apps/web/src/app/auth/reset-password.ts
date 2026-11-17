import { Component, DestroyRef, inject, signal, type OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecoveryAuth } from './recovery-auth';
import { accessLink, isValidPassword, passwordHelp, safeAuthNext } from './auth-flow';

@Component({
  imports: [RouterLink],
  template: `
    <div class="auth-focused">
      <a class="auth-back" [routerLink]="link('/conta?modo=login')"><span aria-hidden="true">←</span> Voltar para Conta</a>
      <header>
        <p class="auth-kicker">Sua conta</p>
        <h1 tabindex="-1">Redefinir senha</h1>
        <p>Um novo acesso, com segurança.</p>
      </header>
      <section class="surface auth-card">
      @if (recovery.ready()) {
        <p>Crie uma nova senha para voltar à sua conta.</p>
        <form (submit)="save($event, password.value, confirmation.value)" [attr.aria-busy]="pending()">
          <label for="new-password">Nova senha</label>
          <div class="password-field">
            <input #password id="new-password" [type]="showPassword() ? 'text' : 'password'"
              autocomplete="new-password" maxlength="128" aria-describedby="password-help">
            <button type="button" class="icon-button" (click)="showPassword.update(show => !show)"
              [attr.aria-label]="showPassword() ? 'Ocultar nova senha' : 'Mostrar nova senha'">
              {{ showPassword() ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>
          <label for="confirm-password">Confirmar senha</label>
          <div class="password-field">
            <input #confirmation id="confirm-password" [type]="showConfirmation() ? 'text' : 'password'"
              autocomplete="new-password" maxlength="128">
            <button type="button" class="icon-button" (click)="showConfirmation.update(show => !show)"
              [attr.aria-label]="showConfirmation() ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'">
              {{ showConfirmation() ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>
          <p id="password-help" class="auth-note">{{ help }} Ao salvar, será necessário entrar novamente.</p>
          @if (error()) { <p role="alert" class="auth-error">{{ error() }}</p> }
          <button type="submit" class="button" [disabled]="pending()">Salvar nova senha</button>
        </form>
      } @else {
        <p role="alert">Abra um link de recuperação válido para redefinir sua senha.</p>
        <a class="button" [routerLink]="link('/conta/recuperar')">Solicitar outro link</a>
      }
      </section>
    </div>
  `,
  styleUrl: './auth.css',
})
export class ResetPassword implements OnDestroy {
  protected readonly recovery = inject(RecoveryAuth);
  private readonly destroy = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly help = passwordHelp;
  protected readonly pending = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly showConfirmation = signal(false);
  protected readonly error = signal('');
  protected readonly next = safeAuthNext(this.route.snapshot.queryParams['next']);
  protected link(path: string) { return this.router.parseUrl(accessLink(path, this.next)); }

  protected async save(event: Event, value: string, confirmation: string) {
    event.preventDefault();
    if (this.pending()) return;
    if (!isValidPassword(value)) { this.error.set(this.help); return; }
    if (value !== confirmation) { this.error.set('As senhas precisam ser iguais.'); return; }
    this.pending.set(true);
    this.error.set('');
    try {
      const result = await this.recovery.replacePassword(value);
      if (this.destroy.destroyed) return;
      if (result.error) this.error.set(result.error);
      else await this.router.navigateByUrl(this.link(result.revocationFailed
        ? '/conta?resultado=senha&erro=revogacao' : '/conta?resultado=senha'), {replaceUrl: true});
    } catch {
      this.error.set('Não foi possível conectar ao serviço de autenticação. Tente novamente.');
    } finally { this.pending.set(false); }
  }

  ngOnDestroy() { this.recovery.clear(); }
}
