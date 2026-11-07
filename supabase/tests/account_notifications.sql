begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select no_plan();

select has_table('private', 'account_notifications', 'fila existe em schema privado');
insert into auth.users(id, email, raw_user_meta_data, raw_app_meta_data, encrypted_password)
values ('ab000000-0000-4000-8000-000000000001', 'signup@example.test', '{"name":"Nome local","password":"never-copy"}', '{"provider":"email"}', 'never-copy'),
       ('ab000000-0000-4000-8000-000000000002', 'google@example.test', '{"full_name":"Nome Google"}', '{"provider":"google"}', ''),
       ('ab000000-0000-4000-8000-000000000003', 'empty@example.test', '{}', '{}', '');
select is((select count(*) from private.account_notifications where id::text like 'ab000000%'), 3::bigint, 'cada conta gera um evento, incluindo Google');
select is((select name from private.account_notifications where id = 'ab000000-0000-4000-8000-000000000002'), 'Nome Google', 'nome do Google é reconhecido');
select is((select name from private.account_notifications where id = 'ab000000-0000-4000-8000-000000000003'), 'Não informado', 'ausência de nome não inventa identidade');
update auth.users set email_confirmed_at = now() where id = 'ab000000-0000-4000-8000-000000000001';
select is((select count(*) from private.account_notifications where id = 'ab000000-0000-4000-8000-000000000001'), 1::bigint, 'confirmação não cria segundo aviso');
select ok(not has_schema_privilege('anon', 'private', 'usage'), 'visitante não acessa fila');
select ok(not has_schema_privilege('authenticated', 'private', 'usage'), 'conta comum não acessa fila');
select ok(not has_function_privilege('authenticated', 'public.claim_account_notification(uuid)', 'execute'), 'conta comum não reserva envio');
select ok(not has_function_privilege('anon', 'public.finish_account_notification(uuid,boolean)', 'execute'), 'visitante não confirma envio');
select ok(has_function_privilege('service_role', 'public.claim_account_notification(uuid)', 'execute'), 'somente serviço administrativo pode reservar');

set local role service_role;
select is(public.claim_account_notification('ab000000-0000-4000-8000-000000000099')->>'state', 'missing', 'evento inexistente não envia');
select is(public.claim_account_notification('ab000000-0000-4000-8000-000000000001'), '{"state":"claimed","name":"Nome local","email":"signup@example.test"}'::jsonb, 'reserva retorna somente estado operacional, nome e email');
select is(public.claim_account_notification('ab000000-0000-4000-8000-000000000001')->>'state', 'busy', 'reserva simultânea não duplica');
select ok(public.finish_account_notification('ab000000-0000-4000-8000-000000000001', false), 'falha libera reserva');
select is(public.claim_account_notification('ab000000-0000-4000-8000-000000000001')->>'state', 'claimed', 'falha permite nova tentativa');
select ok(public.finish_account_notification('ab000000-0000-4000-8000-000000000001', true), 'aceite SMTP confirma envio');
select is(public.claim_account_notification('ab000000-0000-4000-8000-000000000001')->>'state', 'sent', 'reentrega já concluída é idempotente');
reset role;
select ok((select name is null and email is null from private.account_notifications where id = 'ab000000-0000-4000-8000-000000000001'), 'dados pessoais removidos da fila após envio');

-- Configuração descartável: requisições pg_net não saem antes do COMMIT; este teste dá ROLLBACK.
select vault.create_secret('http://host.docker.internal:3198/api/account-notifications', 'account_notification_url');
select vault.create_secret('test-only-secret-with-at-least-32-characters', 'account_notification_secret');
select lives_ok('select private.dispatch_account_notifications()', 'despachante enfileira requisições assíncronas');
select ok(exists(select 1 from net.http_request_queue where headers->>'X-Notification-Id' = 'ab000000-0000-4000-8000-000000000002'
  and convert_from(body, 'UTF8')::jsonb = '{}'::jsonb
  and headers->>'X-Notification-Signature' = encode(extensions.hmac((headers->>'X-Notification-Id') || '.' || (headers->>'X-Notification-Timestamp'), 'test-only-secret-with-at-least-32-characters', 'sha256'), 'hex')),
  'fila HTTP contém somente referência com assinatura válida e corpo vazio');
select ok(not exists(select 1 from net.http_request_queue where convert_from(body, 'UTF8') like '%never-copy%'), 'senhas e metadados não chegam à requisição');
select ok(not exists(select 1 from net.http_request_queue where headers->>'X-Notification-Id' like 'ab000000%' and
  (headers::text like '%test-only-secret%' or convert_from(body, 'UTF8') like '%@example.test%')), 'fila HTTP não guarda segredo reutilizável, nome ou email');
insert into auth.users(id,email,raw_user_meta_data) values
  ('ab000000-0000-4000-8000-000000000004','unicode@example.test',jsonb_build_object('name',repeat('🙂',201))),
  ('ab000000-0000-4000-8000-000000000005','controls@example.test',jsonb_build_object('name',E'\t\t'));
select is((select char_length(name) from private.account_notifications where id='ab000000-0000-4000-8000-000000000004'), 200, 'nome Unicode limitado a 200 pontos de código');
select is((select name from private.account_notifications where id='ab000000-0000-4000-8000-000000000005'), 'Não informado', 'nome só com controles usa fallback após limpeza');
update private.account_notifications set attempts = 5 where id = 'ab000000-0000-4000-8000-000000000002';
select private.dispatch_account_notifications();
select is((select attempts from private.account_notifications where id = 'ab000000-0000-4000-8000-000000000002'), 5, 'tentativas limitadas');
select * from finish();
rollback;
