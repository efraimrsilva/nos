import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { handleAccountNotification } from '../src/features/account-notifications/handler.ts';

const secret = 'test-only-secret-with-at-least-32-characters';
const id = 'aa000000-0000-4000-8000-000000000001';
const payload = { name: 'Pessoa de teste', email: 'person@example.test' };
function request(body = {}, key = secret, eventId = id, age = 0) {
  const timestamp = String(Math.floor(Date.now() / 1000) - age);
  const signature = createHmac('sha256', key).update(`${eventId}.${timestamp}`).digest('hex');
  return new Request('http://localhost/api/account-notifications', {
    method: 'POST', headers: { 'x-notification-signature': signature, 'x-notification-timestamp': timestamp, 'content-type': 'application/json', 'x-notification-id': eventId },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}
function setup(overrides = {}) {
  const calls = [];
  return { calls, deps: { secret, ready: true,
    claim: async (...args) => { calls.push(['claim', ...args]); return { state: 'claimed', ...payload }; },
    send: async (...args) => { calls.push(['send', ...args]); },
    finish: async (...args) => { calls.push(['finish', ...args]); }, ...overrides,
  } };
}
test('sends only name and email and records SMTP acceptance', async () => {
  const { calls, deps } = setup();
  assert.equal((await handleAccountNotification(request(), deps)).status, 200);
  assert.deepEqual(calls, [['claim', id], ['send', payload], ['finish', id, true]]);
});
test('unauthorized callers cannot trigger mail or database access', async () => {
  for (const token of ['', 'Bearer wrong', `Bearer ${secret}x`]) {
    const { calls, deps } = setup();
    assert.equal((await handleAccountNotification(request({}, token), deps)).status, 401);
    assert.deepEqual(calls, []);
  }
});
test('rejects all supplied account fields, invalid JSON, oversized payload and missing event id', async () => {
  for (const body of [{ ...payload, password: 'must-never-be-forwarded' }, payload, 'not json', 'x'.repeat(2049)]) {
    const { calls, deps } = setup();
    assert.equal((await handleAccountNotification(request(body), deps)).status, 400);
    assert.deepEqual(calls, []);
  }
  assert.equal((await handleAccountNotification(request({}, secret, ''), setup().deps)).status, 400);
});
test('duplicate, busy, and unknown events never send another message', async () => {
  for (const [result, status] of [['sent', 200], ['busy', 409], ['missing', 404]]) {
    const { calls, deps } = setup({ claim: async () => ({ state: result }) });
    assert.equal((await handleAccountNotification(request(), deps)).status, status);
    assert.deepEqual(calls, []);
  }
});
test('expired, future and tampered signatures never reach the database', async () => {
  for (const age of [301, -60]) {
    const { calls, deps } = setup();
    assert.equal((await handleAccountNotification(request({}, secret, id, age), deps)).status, 401);
    assert.deepEqual(calls, []);
  }
  const req = request();
  req.headers.set('x-notification-id', 'aa000000-0000-4000-8000-000000000002');
  assert.equal((await handleAccountNotification(req, setup().deps)).status, 401);
});
test('Unicode names use code point length and invalid database payload is not mailed', async () => {
  const { calls, deps } = setup({ claim: async () => ({ state: 'claimed', name: '🙂'.repeat(200), email: payload.email }) });
  assert.equal((await handleAccountNotification(request(), deps)).status, 200);
  assert.equal(calls[0][1].name, '🙂'.repeat(200));
  for (const account of [{ name: 'Name\nInjected', email: payload.email }, { name: ' ', email: payload.email }, { ...payload, email: 'invalid' }]) {
    const test = setup({ claim: async () => ({ state: 'claimed', ...account }) });
    assert.equal((await handleAccountNotification(request(), test.deps)).status, 503);
    assert.deepEqual(test.calls, [['finish', id, false]]);
  }
});
test('SMTP failure releases reservation and returns an error without exposing details', async () => {
  const { calls, deps } = setup({ send: async () => { throw new Error('private provider detail'); } });
  const response = await handleAccountNotification(request(), deps);
  assert.equal(response.status, 503);
  assert.deepEqual(calls.at(-1), ['finish', id, false]);
  assert.doesNotMatch(await response.text(), /private provider detail/);
});
test('incomplete configuration and database failure do not report success', async () => {
  for (const overrides of [{ ready: false }, { secret: '' }, { claim: async () => { throw new Error('db'); } },
    { finish: async () => { throw new Error('db'); } }]) {
    const { deps } = setup(overrides);
    assert.equal((await handleAccountNotification(request(), deps)).status, 503);
  }
});
