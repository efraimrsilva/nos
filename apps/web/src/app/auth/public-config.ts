export type PublicConfig = { url: string; publicKey: string; google: boolean };

function isPublicKey(value: string) {
  if (/^sb_publishable_[\w-]+$/.test(value)) return true;
  if (!/^[\w-]+\.[\w-]+\.[\w-]+$/.test(value)) return false;
  try {
    // Classifica a chave legada antes de expor o arquivo; o Supabase continua validando a assinatura.
    const payload = atob(value.split('.')[1].replaceAll('-', '+').replaceAll('_', '/'));
    return JSON.parse(payload)?.role === 'anon';
  } catch {
    return false;
  }
}

export function readPublicConfig(value: unknown, mode: 'local' | 'hosted'): PublicConfig | null {
  if (!value || typeof value !== 'object' || !('url' in value) || !('publicKey' in value) ||
      typeof value.url !== 'string' || typeof value.publicKey !== 'string' || !isPublicKey(value.publicKey)) return null;
  try {
    const url = new URL(value.url);
    if (url.pathname !== '/' || url.username || url.password || url.search || url.hash) return null;
    const host = url.hostname.replace(/\.$/, '');
    const localHost = host === '127.0.0.1' || host === 'localhost';
    const loopback = localHost || host.endsWith('.localhost') || host.startsWith('127.') || host === '[::1]';
    if (mode === 'local' ? !localHost || url.protocol !== 'http:' || !url.port
      : loopback || url.protocol !== 'https:') return null;
    return {url: url.origin, publicKey: value.publicKey, google: 'google' in value && value.google === true};
  } catch {
    return null;
  }
}
