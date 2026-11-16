import { Component, DestroyRef, computed, effect, inject, signal, viewChild, type ElementRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Account } from '../account';
import { AccessAuth } from './access-auth';
import { accessLink, passwordHelp, safeAuthNext } from './auth-flow';

const errors: Record<string, string> = {
  confirmacao: 'Não foi possível confirmar o e-mail. Solicite outro link de confirmação ou tente entrar.',
  social: 'Não foi possível concluir o acesso. Tente novamente com Google ou use seu e-mail e senha.',
  revogacao: 'A senha foi alterada, mas não foi possível encerrar todas as sessões.',
  servico: 'Não foi possível conferir sua sessão. Tente novamente em instantes.',
};

@Component({
  imports: [RouterLink, Account],
  templateUrl: './access-page.html',
  styleUrl: './auth.css',
})
export class AccessPage {
  protected readonly access = inject(AccessAuth);
  protected readonly profile = this.access.profile;
  private readonly destroy = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly query = toSignal(this.route.queryParams, {initialValue: this.route.snapshot.queryParams});
  private readonly params = toSignal(this.route.params, {initialValue: this.route.snapshot.params});
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('assistance');
  protected readonly kind = computed(() => {
    const mode = this.params()['assistance'] ?? this.query()['acesso'];
    return mode === 'recuperar' || mode === 'recovery' ? 'recovery'
      : mode === 'confirmar-email' || mode === 'confirmation' ? 'confirmation' : null;
  });
  protected readonly dialogTitle = computed(() => this.kind() === 'recovery' ? 'Recuperar acesso' : 'Confirmar e-mail');
  private readonly fragment = toSignal(this.route.fragment, {initialValue: this.route.snapshot.fragment});
  protected readonly next = computed(() => {
    const fragment = this.fragment();
    const destination = fragment === 'privacidade' ? '/configuracoes/privacidade' : fragment === 'ajuda-e-suporte' ? '/ajuda' : undefined;
    return safeAuthNext(this.query()['next'] ?? destination);
  });
  protected readonly mode = computed(() => this.query()['modo'] === 'login' ||
    this.requiresLogin() || this.kind() === 'recovery' ||
    this.fragment() === 'privacidade' || this.fragment() === 'ajuda-e-suporte' ? 'login' : 'signup');
  protected readonly bannerError = computed(() => {
    const error: unknown = this.query()['erro'];
    return typeof error === 'string' && Object.hasOwn(errors, error) ? errors[error] : '';
  });
  protected readonly bannerStatus = computed(() => this.query()['resultado'] === 'senha'
    ? 'Senha atualizada. Entre com sua nova senha.'
    : this.query()['resultado'] === 'conta-excluida'
      ? 'Sua conta foi excluída.'
      : this.query()['erro'] === 'social-cancelado'
      ? 'O acesso foi cancelado. Você pode tentar novamente ou usar seu e-mail e senha.' : '');
  protected readonly completeName = computed(() => this.query()['completar'] === 'nome' && Boolean(this.profile.user()));
  protected readonly requiresLogin = computed(() => ['senha', 'conta-excluida'].includes(this.query()['resultado']));
  protected readonly pending = signal(false);
  protected readonly error = signal('');
  protected readonly emailMessage = signal<{message: string; success: boolean} | null>(null);
  protected readonly emailPending = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly help = passwordHelp;

  constructor() {
    void this.profile.connect();
    effect(() => {
      const kind = this.kind();
      const dialog = this.dialog()?.nativeElement;
      if (kind && dialog && !dialog.open) dialog.showModal();
      if (!kind && dialog?.open) dialog.close();
    });
  }

  protected link(path: string) { return this.router.parseUrl(accessLink(path, this.next())); }

  protected clearCredentials(password: HTMLInputElement) {
    password.value = '';
    this.error.set('');
    this.showPassword.set(false);
  }

  protected async submit(event: Event, name: string, email: string, password: string) {
    event.preventDefault();
    if (this.pending()) return;
    this.pending.set(true);
    this.error.set('');
    try {
      const result = await this.access.submit(this.mode(), name, email, password, this.next());
      if (this.destroy.destroyed) return;
      if (result.path) await this.router.navigateByUrl(result.path);
      else this.error.set(result.message);
    } finally { this.pending.set(false); }
  }

  protected async google() {
    if (this.pending()) return;
    this.pending.set(true);
    try { this.error.set(await this.access.startGoogle(this.next())); }
    finally { this.pending.set(false); }
  }

  protected async sendEmail(event: Event, email: string) {
    event.preventDefault();
    const kind = this.kind();
    if (!kind || this.emailPending()) return;
    this.emailPending.set(true);
    this.emailMessage.set(null);
    try { this.emailMessage.set(await this.access.sendEmail(kind, email, this.next())); }
    finally { this.emailPending.set(false); }
  }

  protected closeAssistance() {
    this.emailMessage.set(null);
    if (this.kind()) {
      const target = this.mode() === 'login' ? '/conta?modo=login' : '/conta';
      void this.router.navigateByUrl(this.link(target), {replaceUrl: true});
    }
  }

  protected async saveName(event: Event, name: string) {
    event.preventDefault();
    const id = this.profile.user()?.id;
    if (!id || this.pending()) return;
    this.pending.set(true);
    try {
      const error = await this.profile.rename(name, id);
      if (this.destroy.destroyed) return;
      if (error) this.error.set(error);
      else await this.router.navigateByUrl(this.next(), {replaceUrl: true});
    } finally { this.pending.set(false); }
  }
}
