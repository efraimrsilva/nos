import { Injectable, inject, signal } from '@angular/core';
import { PreviewProfile } from '../preview-profile';
import { RecoveryAuth } from './recovery-auth';
import { callbackCode, callbackUrl, isValidEmail, isValidPassword, accessLink, single } from './auth-flow';

const unavailable = 'Não foi possível acessar o serviço de autenticação. Tente novamente em instantes.';
const signupError = 'Não foi possível criar a conta agora. Confira os dados e tente novamente.';
const duplicate = 'Este e-mail já possui uma conta. Use Já tenho conta para entrar ou recuperar o acesso.';
type EmailKind = 'confirmation' | 'recovery';
type Result = {message: string; success: boolean; path?: string};
const fail = (message: string): Result => ({message, success: false});

@Injectable({providedIn:'root'})
export class AccessAuth {
  readonly profile = inject(PreviewProfile);
  private readonly recovery = inject(RecoveryAuth);
  readonly pendingEmail = signal('');
  private readonly emailAttempts: Partial<Record<EmailKind, number>> = {};

  async submit(mode: 'login' | 'signup', name: string, email: string, password: string, next: string): Promise<Result> {
    email = email.trim().toLowerCase();
    name = name.trim();
    if (!isValidEmail(email)) return fail('Informe um e-mail válido.');
    if (!password || password.length > 128) return fail('Informe uma senha de até 128 caracteres.');
    const connection = await this.profile.connection();
    if (!connection) return fail(unavailable);
    this.recovery.clear();
    if (mode === 'login') {
      const message = await this.profile.signIn(email, password);
      if (message) return fail(message);
      this.pendingEmail.set('');
      return {message: '', success: true, path: next};
    }
    if (!name || name.length > 80 || !isValidPassword(password)) {
      return fail('Informe um nome de até 80 caracteres e uma senha com letra, número e símbolo, de 8 a 128 caracteres.');
    }
    try {
      const {data, error} = await connection.client.auth.signUp({email, password, options: {
        data: {name}, emailRedirectTo: callbackUrl('/auth/confirm', next),
      }});
      if (error?.code === 'user_already_exists' || error?.code === 'email_exists' ||
          (!error && !data.session && data.user?.identities?.length === 0)) return fail(duplicate);
      if (error || !data.user) return fail(signupError);
      this.pendingEmail.set(data.session ? '' : email);
      return {message: '', success: true, path: data.session ? next : accessLink('/conta/confirmar-email', next)};
    } catch { return fail(signupError); }
  }

  async sendEmail(kind: EmailKind, value: string, next: string): Promise<Result> {
    const email = value.trim().toLowerCase();
    if (!isValidEmail(email)) return fail('Informe um e-mail válido.');
    const connection = await this.profile.connection();
    if (!connection) return fail(unavailable);
    const {client} = connection;
    try {
      const {data, error} = await client.rpc('get_email_confirmation_status', {account_email: email});
      if (error || !['confirmed','pending','missing'].includes(data)) {
        return fail('Não foi possível verificar o e-mail. Tente novamente em instantes.');
      }
      if (data === 'missing') return fail('Não encontramos uma conta para este e-mail. Confira o endereço ou crie sua conta.');
      if (kind === 'confirmation' && data === 'confirmed') {
        return {message: 'Este e-mail já está confirmado. Você já pode entrar na sua conta.', success: true};
      }
      // O intervalo na interface complementa os limites do Auth no servidor.
      if (Date.now() < (this.emailAttempts[kind] ?? 0)) return fail('Aguarde 60 segundos antes de solicitar outro link.');
      this.emailAttempts[kind] = Date.now() + 60_000;
      const sent = kind === 'recovery'
        ? await this.recovery.request(email, next)
        : !(await client.auth.resend({type: 'signup', email, options: {emailRedirectTo: callbackUrl('/auth/confirm', next)}})).error;
      if (!sent) return fail('Não foi possível enviar o link. Tente novamente em instantes.');
      return {message: kind === 'recovery'
        ? 'Enviamos as instruções de recuperação. Confira sua caixa de entrada e também o spam.'
        : 'Enviamos a confirmação para o seu e-mail. Confira sua caixa de entrada e também o spam.', success: true};
    } catch { return fail('Não foi possível enviar o link. Tente novamente em instantes.'); }
  }

  async startGoogle(next: string) {
    const connection = await this.profile.connection();
    if (!connection?.config.google) return unavailable;
    this.recovery.clear();
    try {
      const {error} = await connection.client.auth.signInWithOAuth({
        provider: 'google', options: {redirectTo: callbackUrl('/auth/callback', next)},
      });
      if (!error) return '';
    } catch { /* Mostra a mesma mensagem para falha no provedor e no transporte. */ }
    return 'Não foi possível iniciar o acesso com Google. Tente novamente ou use seu e-mail e senha.';
  }

  async finishCallback(kind: 'confirm' | 'callback', params: URLSearchParams, next: string) {
    const fallback = (code: string) => accessLink('/conta?modo=login&erro=' + code, next);
    const failure = fallback(kind === 'confirm' ? 'confirmacao' : 'social');
    const fields = ['code', 'type', 'token_hash', 'error', 'sb_flow_id'];
    if (fields.some(field => params.getAll(field).length > 1)) return failure;
    if (kind === 'callback' && params.get('error') === 'access_denied' && !params.has('code')) return fallback('social-cancelado');
    if (params.has('error') || params.has('error_description') ||
        (params.has('code') && params.has('token_hash')) ||
        (kind === 'callback' && (params.has('type') || params.has('token_hash')))) return failure;
    const connection = await this.profile.connection();
    if (!connection) return failure;
    this.recovery.clear();
    const auth = connection.client.auth;
    try {
      const code = callbackCode(params);
      const token = params.get('token_hash');
      const result = code
        ? await auth.exchangeCodeForSession(code, {flowId: single(params, 'sb_flow_id') ?? undefined})
        : kind === 'confirm' && !params.has('code') && token && params.get('type') === 'email'
          ? await auth.verifyOtp({type: 'email', token_hash: token})
          : null;
      const user = result?.data.user;
      if (!result || result.error || !user || !result.data.session) return failure;
      this.pendingEmail.set('');
      if (kind === 'callback') {
        const name: unknown = user.user_metadata['name'];
        if (typeof name !== 'string' || !name.trim() || name.trim().length > 80) {
          const rawName: unknown = user.user_metadata['full_name'];
          const providerName = typeof rawName === 'string' ? rawName.trim() : '';
          if (!providerName || providerName.length > 80 ||
              !await this.profile.copyProviderName(user, result.data.session.access_token, providerName)) {
            return accessLink('/conta?completar=nome', next);
          }
        }
      }
      return next;
    } catch { return failure; }
  }
}
