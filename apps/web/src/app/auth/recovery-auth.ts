import { inject, Injectable, signal } from '@angular/core';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { PreviewProfile } from '../preview-profile';
import { updateOwnUser } from './supabase-user';
import { callbackUrl, parseRecoveryCredentials, single } from './auth-flow';

const lifetime = 15 * 60 * 1000;
const invalid = 'Abra um link de recuperação válido para redefinir sua senha.';

@Injectable({ providedIn: 'root' })
export class RecoveryAuth {
  private readonly profile = inject(PreviewProfile);
  private client?: SupabaseClient;
  private sessionValue: string | null = null;
  private proof?: { sessionId: string; userId: string; expiresAt: number };
  readonly ready = signal(false);

  private async connect() {
    if (this.client) return this.client;
    const connection = await this.profile.connection();
    if (!connection) return undefined;
    if (this.client) return this.client;
    const prefix = 'nos-angular-recovery';
    const key = prefix + '-' + crypto.randomUUID();
    const verifierKey = (name: string) => prefix + name.slice(key.length);
    // O SDK persiste os verificadores PKCE entre abas. A sessão do usuário nunca sai da memória.
    const storage = {
      getItem: (name: string) => name === key ? this.sessionValue : localStorage.getItem(verifierKey(name)),
      setItem: (name: string, value: string) => {
        if (name === key) this.sessionValue = value;
        else localStorage.setItem(verifierKey(name), value);
      },
      removeItem: (name: string) => {
        if (name === key) this.sessionValue = null;
        else localStorage.removeItem(verifierKey(name));
      },
    };
    const {url, publicKey} = connection.config;
    this.client = createClient(url, publicKey, {auth: {
      flowType: 'pkce', autoRefreshToken: false, detectSessionInUrl: false, storage, storageKey: key,
    }});
    return this.client;
  }

  async request(email: string, next: string) {
    this.clear();
    const client = await this.connect();
    if (!client) return false;
    const {error} = await client.auth.resetPasswordForEmail(email, { redirectTo: callbackUrl('/auth/recovery', next) });
    return !error;
  }

  async accept(params: URLSearchParams) {
    this.clear();
    const credentials = parseRecoveryCredentials(params);
    if (!credentials || params.has('error') || params.getAll('sb_flow_id').length > 1) return false;
    const client = await this.connect();
    if (!client) return false;
    const result = credentials.code
      ? await client.auth.exchangeCodeForSession(credentials.code, {flowId: single(params, 'sb_flow_id') ?? undefined})
      : await client.auth.verifyOtp({type: 'recovery', token_hash: credentials.tokenHash!});
    const session = result.data.session;
    if (result.error || !session) { this.clear(); return false; }
    const {data, error} = await client.auth.getClaims(session.access_token);
    const claims = data?.claims;
    const recovery = claims?.amr?.some(entry => (typeof entry === 'string' ? entry : entry.method) === 'recovery');
    // Código PKCE comum, parâmetro type e eventos locais jamais provam recuperação.
    if (error || !claims?.session_id || claims.sub !== session.user.id || (credentials.code && !recovery)) {
      this.clear();
      return false;
    }
    this.proof = {sessionId: claims.session_id, userId: session.user.id, expiresAt: Date.now() + lifetime};
    this.ready.set(true);
    return true;
  }

  async replacePassword(password: string) {
    const client = this.client;
    const proof = this.proof;
    if (!client || !proof || Date.now() >= proof.expiresAt) {
      this.clear();
      return {error: invalid};
    }
    const connection = await this.profile.connection();
    const session = (await client.auth.getSession()).data.session;
    const claims = session ? (await client.auth.getClaims(session.access_token)).data?.claims : undefined;
    if (!connection || !session || this.proof !== proof || Date.now() >= proof.expiresAt ||
        claims?.session_id !== proof.sessionId || claims.sub !== proof.userId) {
      this.clear();
      return {error: invalid};
    }
    const changed = await updateOwnUser(connection.config, session.access_token, {password});
    if (!changed.ok) return {error: 'Não foi possível salvar a senha. Use uma senha diferente ou solicite outro link.'};
    let revocationFailed = false;
    try {
      const {error} = await client.auth.admin.signOut(session.access_token, 'global');
      revocationFailed = Boolean(error);
    } catch { revocationFailed = true; }
    this.clear();
    return {error: '', revocationFailed};
  }

  clear() {
    this.proof = undefined;
    this.sessionValue = null;
    this.ready.set(false);
  }
}
