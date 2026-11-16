import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { createClient, isAuthRetryableFetchError, type Session, type SupabaseClient, type User } from '@supabase/supabase-js';

import { updateOwnUser } from './auth/supabase-user';

const sessionKey = 'nos-angular-preview-session';
type Config = { url: string; publicKey: string; google?: boolean };
const sessionMessage = 'Não foi possível confirmar sua sessão. Entre novamente na conta.';
const saveMessage = 'Não foi possível salvar seu nome. Tente novamente.';

@Injectable({ providedIn: 'root' })
export class PreviewProfile {
  readonly user = signal<User | null>(null);
  readonly loading = signal(true);
  readonly google = signal(false);
  readonly notice = signal('');
  private readonly destroy = inject(DestroyRef);
  private config?: Config;
  private client?: SupabaseClient;
  private connecting?: Promise<void>;
  private accountId: string | null = null;
  private revision = 0;

  async connect() {
    if (this.client) return;
    // Reentrar na rota durante a primeira leitura compartilha o mesmo cliente e a assinatura de sessão.
    this.connecting ??= this.initialize().finally(() => { this.connecting = undefined; });
    return this.connecting;
  }

  async connection() {
    await this.connect();
    return this.client && this.config ? { client: this.client, config: this.config } : null;
  }

  private async initialize() {
    this.loading.set(true);
    try {
      const response = await fetch('/supabase.json', { cache: 'no-store' });
      if (!response.ok) throw new Error();
      const config: Config = await response.json();
      if (location.hostname !== '127.0.0.1' ||
          !/^http:\/\/(?:127\.0\.0\.1|localhost):\d+\/?$/.test(config.url) ||
          !config.publicKey) throw new Error();
      this.config = config;
      this.client = createClient(config.url, config.publicKey, {
        auth: { storageKey: sessionKey, flowType: 'pkce', detectSessionInUrl: false },
      });
      this.google.set(config.google === true);
      this.client.auth.onAuthStateChange((event, session) => {
        // A troca de identidade invalida operações pendentes antes de carregar a próxima conta.
        const id = session?.user.id ?? null;
        if (event !== 'INITIAL_SESSION' && id === this.accountId &&
            (!session || this.user() || this.loading())) return;
        this.reset(id, !id && Boolean(this.accountId));
        if (session) {
          const revision = this.revision;
          this.loading.set(true);
          queueMicrotask(() => void this.loadProfile(session, revision));
        }
      });
      const onStorage = (event: StorageEvent) => {
        if (event.key === sessionKey && event.newValue === null && !localStorage.getItem(sessionKey)) {
          this.reset(null);
        }
      };
      window.addEventListener('storage', onStorage);
      this.destroy.onDestroy(() => window.removeEventListener('storage', onStorage));
    } catch {
      this.notice.set('Inicie a prévia local com npm run start no pacote Angular.');
      this.loading.set(false);
    }
  }

  private async loadProfile(session: Session, revision: number) {
    try {
      const { data, error } = await this.client!.auth.getUser(session.access_token);
      if (this.revision !== revision) return;
      if (isAuthRetryableFetchError(error) || (error?.status ?? 0) >= 500) {
        this.notice.set('Não foi possível conferir sua sessão. Tente novamente em instantes.');
      } else if (error || data.user?.id !== session.user.id) this.reset(null, true);
      else this.user.set(data.user);
    } catch {
      if (this.revision === revision) this.notice.set('Não foi possível conferir sua sessão. Tente novamente em instantes.');
    } finally {
      if (this.revision === revision) this.loading.set(false);
    }
  }

  private reset(id: string | null, expired = false) {
    this.revision++;
    this.accountId = id;
    this.user.set(null);
    this.loading.set(false);
    this.notice.set(expired ? sessionMessage : '');
  }

  async signIn(email: string, password: string) {
    try {
      const result = await this.client?.auth.signInWithPassword({ email: email.trim(), password });
      if (result && !result.error) return '';
      if (result?.error?.status === 429) return 'Muitas tentativas de acesso. Aguarde um pouco antes de tentar novamente.';
      if (!result || isAuthRetryableFetchError(result.error) || (result.error?.status ?? 0) >= 500) {
        return 'Não foi possível acessar o serviço de autenticação. Tente novamente em instantes.';
      }
      if (result.error?.code === 'email_not_confirmed') return 'Confirme seu e-mail antes de entrar na conta.';
    } catch {
      return 'Não foi possível acessar o serviço de autenticação. Tente novamente em instantes.';
    }
    return 'Não foi possível entrar. Confira o e-mail e a senha.';
  }

  async signOut() {
    const client = this.client;
    if (!client) return 'Não foi possível sair da conta. Tente novamente.';
    try {
      const {data, error} = await client.auth.getSession();
      if (error) return 'Não foi possível sair da conta. Tente novamente.';
      const session = data.session;
      if (!session) { this.reset(null); return ''; }
      const revoked = await client.auth.admin.signOut(session.access_token, 'global');
      if (revoked.error && ![401,403,404].includes(revoked.error.status ?? 0)) {
        return 'Não foi possível sair da conta. Tente novamente.';
      }
      // A revogação usa o token observado. A limpeza local preserva uma sessão nova de outra aba.
      const stored = JSON.parse(localStorage.getItem(sessionKey) ?? 'null');
      if (stored?.refresh_token === session.refresh_token) {
        localStorage.removeItem(sessionKey);
        this.reset(null);
      } else if (!stored) this.reset(null);
      return '';
    } catch {
      return 'Não foi possível sair da conta. Tente novamente.';
    }
  }

  async copyProviderName(user: User, token: string, name: string) {
    if (!this.config) return false;
    try {
      const response = await updateOwnUser(this.config, token, {data: {name}});
      if (!response.ok) return false;
      const updated: User = await response.json();
      if (updated.id !== user.id || updated.user_metadata['name'] !== name) return false;
      if (this.user()?.id === updated.id) this.user.set(updated);
      return true;
    } catch { return false; }
  }

  async rename(value: string, expectedId: string) {
    const name = value.trim();
    if (!name || name.length > 80) return 'Informe um nome de 1 a 80 caracteres.';
    return this.saveMetadata('name', name, expectedId, saveMessage);
  }

  async saveMetadata(key: 'name' | 'appearance_theme', value: string, expectedId: string, failure: string) {
    const revision = this.revision;
    const client = this.client;
    const config = this.config;
    if (!client || !config || this.user()?.id !== expectedId) return sessionMessage;
    try {
      const { data: { session }, error: sessionError } = await client.auth.getSession();
      if (this.revision !== revision) return sessionMessage;
      if (isAuthRetryableFetchError(sessionError)) return failure;
      if (!session || (sessionError && (sessionError.status === 401 || sessionError.status === 403))) {
        this.reset(null, true);
        return sessionMessage;
      }
      if (sessionError) return failure;
      if (session.user.id !== expectedId) return sessionMessage;
      const token = session.access_token;
      const { data, error } = await client.auth.getUser(token);
      if (this.revision !== revision) return sessionMessage;
      if (error && error.status !== 401 && error.status !== 403 && !['session_not_found', 'bad_jwt'].includes(error.code ?? '')) return failure;
      if (error || data.user?.id !== expectedId) {
        this.reset(null, true);
        return sessionMessage;
      }

      const response = await updateOwnUser(config, token, {data: {[key]: value}});
      if (this.revision !== revision) return sessionMessage;
      if (response.status === 401 || response.status === 403) {
        this.reset(null, true);
        return sessionMessage;
      }
      if (!response.ok) return failure;
      const updated: User = await response.json();
      if (this.revision !== revision) return sessionMessage;
      if (updated.id !== expectedId || updated.user_metadata?.[key] !== value) return failure;
      this.user.set(updated);
      return '';
    } catch {
      return failure;
    }
  }

  clearDeletedAccount(owner: string) {
    // A RPC já revogou a conta. A remoção local preserva uma conta que acabou de entrar em outra aba.
    if (this.user()?.id !== owner) return false;
    try {
      const stored = JSON.parse(localStorage.getItem(sessionKey) ?? 'null');
      if (stored && stored.user?.id !== owner) return false;
      localStorage.removeItem(sessionKey);
    } catch {
      // O serviço já confirmou a exclusão, mesmo se o armazenamento estiver indisponível.
    }
    this.reset(null);
    return true;
  }
}

export function displayName(user: User | null) {
  for (const key of ['name', 'full_name', 'display_name']) {
    const name: unknown = user?.user_metadata?.[key];
    if (typeof name === 'string' && name.trim()) return name.trim();
  }
  return '';
}
