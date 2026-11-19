import { Component, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { PreviewProfile } from '../preview-profile';
import { NavIcon } from '../shared/nav-icon';
import { InvitationsData, inviteDate, type InviteCode, type InviteScope } from './invitations-data';

@Component({
  selector:'app-invitation-generator',
  imports:[NavIcon],
  template:`
    @if (visible()) {
    <section class="invite-generator" aria-label="Preparar convite">
      <p>Quem tiver o código pode conferir o Núcleo. Cada pessoa escolhe se quer participar, e o convite expira em sete dias.</p>
      @if (generated() ?? initial(); as invitation) {
        <p class="invite-code-label"><app-nav-icon name="key" />Código de convite</p>
        <p class="invite-code" data-testid="invitation-code" data-invitation-secret>{{ invitation.code }}</p>
        <p>Expira em {{ date(invitation.expires_at) }}</p>
        <div class="invite-actions">
          <button class="button invite-icon-action" type="button" (click)="share(invitation.code)">Compartilhar código <app-nav-icon name="diagonal" /></button>
          <button class="button secondary invite-icon-action" type="button" (click)="copy(invitation.code)"><app-nav-icon name="copy" />Copiar código</button>
        </div>
      } @else {
        <button class="button invite-icon-action" type="button" [disabled]="pending()" (click)="generate()">
          <app-nav-icon name="key" />
          {{ pending() ? 'Gerando…' : 'Gerar convite' }}
        </button>
      }
      @if (feedback()) { <p role="status">{{ feedback() }}</p> }
      @if (error()) { <p role="alert" class="form-error">{{ error() }}</p> }
    </section>
    }
  `,
})
export class InvitationGenerator {
  readonly scope = input.required<InviteScope>();
  readonly initial = input<InviteCode|null>(null);
  readonly visible = input(true);
  readonly changed = output<void>();
  private readonly data = inject(InvitationsData);
  private readonly profile = inject(PreviewProfile);
  private readonly lifetime = new AbortController();
  protected readonly pending = signal(false);
  protected readonly generated = signal<InviteCode|null>(null);
  protected readonly error = signal('');
  protected readonly feedback = signal('');
  protected readonly date = inviteDate;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.lifetime.abort());
    effect(() => {
      if (this.visible()) return;
      this.generated.set(null);
      this.feedback.set('');
      this.error.set('');
    });
  }

  protected async generate() {
    if (this.pending()) return;
    const scope = this.scope();
    this.pending.set(true);
    this.error.set('');
    try {
      const result = await this.data.generate(scope,this.lifetime.signal);
      if (this.lifetime.signal.aborted || this.profile.user()?.id !== scope.owner) return;
      if (this.visible()) this.generated.set(result);
    } catch {
      if (!this.lifetime.signal.aborted && this.visible()) this.error.set('Não foi possível gerar ou confirmar o código. Tente novamente.');
    } finally {
      this.pending.set(false);
      // Fechar a caixa remove o código da tela. A lista ainda deve refletir a operação confirmada.
      if (!this.lifetime.signal.aborted) this.changed.emit();
    }
  }

  protected async copy(code: string) {
    this.feedback.set('');
    try {
      await navigator.clipboard.writeText(code);
      this.feedback.set('Código copiado para compartilhar.');
    } catch {
      this.feedback.set('Não foi possível copiar. Selecione o código para copiá-lo manualmente.');
    }
  }

  protected async share(code: string) {
    if (!navigator.share) { await this.copy(code); return; }
    this.feedback.set('');
    try {
      await navigator.share({title:'Convite para o Nós',text:'Meu convite para o Núcleo: ' + code});
    } catch (error) {
      this.feedback.set(error instanceof Error && error.name === 'AbortError'
        ? 'Compartilhamento cancelado.' : 'Não foi possível compartilhar. Você pode copiar o código.');
    }
  }
}
