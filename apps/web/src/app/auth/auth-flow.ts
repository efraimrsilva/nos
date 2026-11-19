export { isValidEmail, isValidPassword, passwordHelp, safeAuthNext, withAuthNext } from '../../domain/auth/input';
export { parseRecoveryCredentials } from '../../domain/auth/recovery-credentials';
import { safeAuthNext, withAuthNext } from '../../domain/auth/input';

export const defaultDestination = '/nucleos';
export const accessLink = (path: string, next: string) => withAuthNext(path, safeAuthNext(next));

export function callbackUrl(path: string, next: string) {
  return new URL(accessLink(path, next), location.origin).href;
}

export function single(params: URLSearchParams, name: string) {
  return params.getAll(name).length === 1 ? params.get(name) : null;
}

export function callbackCode(params: URLSearchParams) {
  const code = single(params, 'code');
  return code && code.length <= 4096 && !/\s/.test(code) ? code : null;
}
