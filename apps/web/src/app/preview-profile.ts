import { Injectable, signal } from '@angular/core';
import { createClient, isAuthRetryableFetchError, type Session, type SupabaseClient, type User } from '@supabase/supabase-js';

type Config = { url: string; publicKey: string };
const sessionMessage = 'Não foi possível confirmar sua sessão. Entre novamente na prévia.';
const saveMessage = 'Não foi possível salvar seu nome. Tente novamente.';

@Injectable({ providedIn: 'root' })
export class PreviewProfile {
  readonly user = signal<User | null>(null);
  readonly loading = signal(true);
  readonly available = signal(false);
  readonly notice = signal('');
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
        auth: { storageKey: 'nos-angular-preview-session', detectSessionInUrl: false },
      });
      this.available.set(true);
      this.client.auth.onAuthStateChange((event, session) => {
        // A troca de identidade invalida operações pendentes antes de carregar a próxima conta.
        const id = session?.user.id ?? null;
        if (event !== 'INITIAL_SESSION' && id === this.accountId) return;
        this.reset(id, !id && Boolean(this.accountId));
        if (session) {
          const revision = this.revision;
          this.loading.set(true);
          queueMicrotask(() => void this.loadProfile(session, revision));
        }
      });
    } catch {
      this.notice.set('Inicie a prévia local com npm run start no pacote Angular.');
      this.loading.set(false);
    }
  }

  private async loadProfile(session: Session, revision: number) {
    try {
      const { data, error } = await this.client!.auth.getUser(session.access_token);
      if (this.revision !== revision) return;
      if (error || data.user?.id !== session.user.id) this.reset(null, true);
      else this.user.set(data.user);
    } catch {
      if (this.revision === revision) this.reset(null, true);
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
    } catch {
      return 'Não foi possível conectar ao Supabase local.';
    }
    return 'Não foi possível entrar. Confira os dados da conta local.';
  }

  async signOut() {
    try {
      const result = await this.client?.auth.signOut({ scope: 'local' });
      if (result && !result.error) {
        this.notice.set('');
        return '';
      }
    } catch { /* Mantém o estado atual se o Auth estiver indisponível. */ }
    return 'Não foi possível sair da prévia. Tente novamente.';
  }

  async rename(value: string, expectedId: string) {
    const name = value.trim();
    if (!name || name.length > 80) return 'Informe um nome de 1 a 80 caracteres.';
    const revision = this.revision;
    const client = this.client;
    const config = this.config;
    if (!client || !config || this.user()?.id !== expectedId) return sessionMessage;
    try {
      const { data: { session }, error: sessionError } = await client.auth.getSession();
      if (this.revision !== revision) return sessionMessage;
      if (isAuthRetryableFetchError(sessionError)) return saveMessage;
      if (!session || (sessionError && (sessionError.status === 401 || sessionError.status === 403))) {
        this.reset(null, true);
        return sessionMessage;
      }
      if (sessionError) return saveMessage;
      const token = session.access_token;
      const { data, error } = await client.auth.getUser(token);
      if (this.revision !== revision) return sessionMessage;
      if (error && error.status !== 401 && error.status !== 403 && !['session_not_found', 'bad_jwt'].includes(error.code ?? '')) return saveMessage;
      if (error || data.user?.id !== expectedId) {
        this.reset(null, true);
        return sessionMessage;
      }

      // O PUT usa o mesmo token verificado acima; não relê a sessão compartilhada no momento da escrita.
      const response = await fetch(new URL('/auth/v1/user', config.url), {
        method: 'PUT',
        headers: { apikey: config.publicKey, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { name } }),
      });
      if (this.revision !== revision) return sessionMessage;
      if (response.status === 401 || response.status === 403) {
        this.reset(null, true);
        return sessionMessage;
      }
      if (!response.ok) return saveMessage;
      const updated: User = await response.json();
      if (this.revision !== revision) return sessionMessage;
      if (updated.id !== expectedId || updated.user_metadata?.['name'] !== name) return saveMessage;
      this.user.set(updated);
      return '';
    } catch {
      return saveMessage;
    }
  }
}

export function displayName(user: User | null) {
  for (const key of ['name', 'full_name', 'display_name']) {
    const name: unknown = user?.user_metadata?.[key];
    if (typeof name === 'string' && name.trim()) return name.trim();
  }
  return '';
}
