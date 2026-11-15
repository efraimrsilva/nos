import type { UserAttributes } from '@supabase/supabase-js';

// O token recebido é o mesmo que foi verificado antes da ação; a requisição não relê a sessão global.
export function updateOwnUser(config: {url: string; publicKey:string}, token: string, attributes: UserAttributes) {
  return fetch(new URL('/auth/v1/user', config.url), {
    method: 'PUT',
    headers: {apikey: config.publicKey, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'},
    body: JSON.stringify(attributes),
  });
}
