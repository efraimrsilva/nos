import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';

// Executa a ação real, isolando somente Auth e invalidação do cache.
function action(auth: object, revalidatePath = (_path: string, _type: string) => {}) {
  const source = stripTypeScriptTypes(readFileSync('src/features/controls/profile-name-action.ts', 'utf8'))
    .replace(/^import .*;\r?\n/gm, '').replace('export async function', 'async function');
  return runInNewContext(`${source}\nsaveProfileName;`, {
    createSupabaseServerClient: async () => ({ auth }), revalidatePath,
  }) as (value: unknown, userId: string) => Promise<{ error: string; name?: string }>;
}
const user = { id: 'own-account', user_metadata: { name: 'Antes' } };

test('nome inválido é rejeitado antes de acessar Auth', async () => {
  const save = action({ getUser: () => { throw new Error('Não deve consultar Auth'); } });
  for (const value of ['', '   ', 'a'.repeat(81), null, 123, {}]) {
    expect((await save(value, user.id)).error).toContain('1 a 80');
  }
});

test('sessão ausente, inválida ou de outra conta não pode gravar', async () => {
  let writes = 0;
  for (const session of [
    { data: { user: null }, error: null },
    { data: { user }, error: { message: 'expired' } },
    { data: { user: { ...user, id: 'other-account' } }, error: null },
  ]) {
    const result = await action({ getUser: async () => session, updateUser: () => { writes++; } })('Nome', user.id);
    expect(result.error).toContain('sessão');
  }
  expect(writes).toBe(0);
});

test('grava somente name com trim e atualiza páginas após confirmação', async () => {
  let payload: unknown;
  const invalidations: string[] = [];
  const result = await action({
    getUser: async () => ({ data: { user }, error: null }),
    updateUser: async (value: unknown) => { payload = value; return { data: { user: { ...user, user_metadata: { name: 'Nome Novo' } } }, error: null }; },
  }, (path, type) => { invalidations.push(`${path}:${type}`); })('  Nome Novo  ', user.id);
  expect(JSON.parse(JSON.stringify(payload))).toEqual({ data: { name: 'Nome Novo' } });
  expect(result.error).toBe('');
  expect(result.name).toBe('Nome Novo');
  expect(invalidations).toEqual(['/:layout']);
});

test('falha, resposta divergente e conexão interrompida não confirmam sucesso', async () => {
  for (const update of [
    async () => ({ data: { user: null }, error: { message: 'failure' } }),
    async () => ({ data: { user }, error: null }),
    async () => ({ data: { user: { ...user, id: 'other-account', user_metadata: { name: 'Novo' } } }, error: null }),
    async () => { throw new Error('Network'); },
  ]) {
    const invalidations: string[] = [];
    const result = await action({ getUser: async () => ({ data: { user }, error: null }), updateUser: update }, path => { invalidations.push(path); })('Novo', user.id);
    expect(result.error).not.toBe('');
    expect(result.name).toBeUndefined();
    expect(invalidations).toEqual([]);
  }
});
