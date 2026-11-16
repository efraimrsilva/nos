import assert from 'node:assert/strict';
import {once} from 'node:events';
import {createServer} from 'node:http';
import {test} from 'node:test';
import {createSupportServer} from './angular-support.mjs';

async function listen(server) {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return 'http://127.0.0.1:' + server.address().port;
}

test('relato local valida entrada e conta antes de preparar o envio', async () => {
  const requests = [];
  const auth = createServer((request, response) => {
    requests.push({url: request.url, authorization: request.headers.authorization});
    const verified = request.headers.authorization === 'Bearer valid.test.token';
    response.writeHead(verified ? 200 : 401, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(verified
      ? {id: 'user-test', email: 'person@example.test', email_confirmed_at: '2026-11-16T10:00:00Z'}
      : {message: 'Invalid token'}));
  });
  const url = await listen(auth);
  const support = createSupportServer({url, publicKey: 'local-test-key', version: 'test'});
  const endpoint = (await listen(support)) + '/api/problem-report';
  const description = 'O formulário ficou indisponível durante o teste.';
  function post(body, token, contentType = 'application/json') {
    const headers = {'Content-Type': contentType};
    if (token) headers.Authorization = 'Bearer ' + token;
    return fetch(endpoint, {method: 'POST', headers, body});
  }

  try {
    assert.equal((await post('{}')).status, 401);
    assert.equal((await post('{}', 'valid.test.token', 'text/plain')).status, 415);
    assert.equal((await post('{', 'valid.test.token')).status, 400);
    assert.equal((await post(JSON.stringify({description:'curto'}), 'valid.test.token')).status, 400);
    assert.equal((await post(JSON.stringify({description:'x'.repeat(20_000)}), 'valid.test.token')).status, 413);
    assert.equal(requests.length, 0);
    assert.equal((await post(JSON.stringify({description}), 'denied.test.token')).status, 401);
    const unavailable = await post(JSON.stringify({description}), 'valid.test.token');
    assert.equal(unavailable.status, 503);
    assert.equal(unavailable.headers.get('cache-control'), 'no-store');
    assert.match((await unavailable.json()).error, /texto foi mantido/);
    assert.deepEqual(requests, [
      {url: '/auth/v1/user', authorization: 'Bearer denied.test.token'},
      {url: '/auth/v1/user', authorization: 'Bearer valid.test.token'},
    ]);
  } finally {
    support.close();
    auth.close();
  }
});
