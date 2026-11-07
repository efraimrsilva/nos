begin;
create extension if not exists pgtap with schema extensions;
set local search_path=public,extensions;
select no_plan();
insert into auth.users(id,raw_user_meta_data) values
 ('12000000-0000-4000-8000-000000000001','{"name":"Observador"}'),
 ('12000000-0000-4000-8000-000000000002','{"name":"Pessoa visível"}'),
 ('12000000-0000-4000-8000-000000000003','{"name":"Pessoa isolada"}');
insert into public.nuclei(id,type,name,purpose,created_by) values
 ('22000000-0000-4000-8000-000000000001','amigos','Núcleo visível','Presença','12000000-0000-4000-8000-000000000001'),
 ('22000000-0000-4000-8000-000000000002','amigos','Núcleo isolado','Escuta','12000000-0000-4000-8000-000000000003');
insert into public.nucleus_members(nucleus_id,user_id,role) values
 ('22000000-0000-4000-8000-000000000001','12000000-0000-4000-8000-000000000001','admin'),
 ('22000000-0000-4000-8000-000000000001','12000000-0000-4000-8000-000000000002','member'),
 ('22000000-0000-4000-8000-000000000002','12000000-0000-4000-8000-000000000003','admin');
select ok(not has_function_privilege('anon','public.get_nucleus_identity_version()','execute'),'anônimo sem execução');
set local role authenticated;
select set_config('request.jwt.claim.sub','',true);
select throws_ok($$select public.get_nucleus_identity_version()$$,'42501','not authenticated','identidade ausente rejeitada');
select set_config('request.jwt.claim.sub','12000000-0000-4000-8000-000000000001',true);
select set_config('test.identity_before',public.get_nucleus_identity_version(),true);
select matches(public.get_nucleus_identity_version(),'^[0-9a-f]{32}$','somente resumo opaco');
select is(public.get_nucleus_identity_version(),current_setting('test.identity_before'),'sem mudança é estável');
reset role;
update auth.users set raw_user_meta_data='{"name":"Outro nome isolado"}' where id='12000000-0000-4000-8000-000000000003';
update public.nuclei set name='Outro Núcleo isolado' where id='22000000-0000-4000-8000-000000000002';
set local role authenticated;
select is(public.get_nucleus_identity_version(),current_setting('test.identity_before'),'pessoas e Núcleos externos não afetam resumo');
reset role;
update auth.users set email='synthetic@example.test',raw_user_meta_data=raw_user_meta_data||'{"theme":"ocean"}' where id='12000000-0000-4000-8000-000000000002';
set local role authenticated;
select is(public.get_nucleus_identity_version(),current_setting('test.identity_before'),'e-mail e tema não afetam resumo');
reset role;
update auth.users set raw_user_meta_data=raw_user_meta_data||'{"name":"Pessoa atualizada"}' where id='12000000-0000-4000-8000-000000000002';
set local role authenticated;
select isnt(public.get_nucleus_identity_version(),current_setting('test.identity_before'),'nome de integrante altera resumo');
select set_config('test.identity_before',public.get_nucleus_identity_version(),true);
reset role;
update public.nuclei set purpose='Propósito atualizado' where id='22000000-0000-4000-8000-000000000001';
set local role authenticated;
select isnt(public.get_nucleus_identity_version(),current_setting('test.identity_before'),'propósito do Núcleo continua sincronizado');
reset role;
delete from public.nucleus_members where user_id='12000000-0000-4000-8000-000000000002';
set local role authenticated;
select set_config('test.identity_before',public.get_nucleus_identity_version(),true);
reset role;
update auth.users set raw_user_meta_data=raw_user_meta_data||'{"name":"Fora do Núcleo"}' where id='12000000-0000-4000-8000-000000000002';
set local role authenticated;
select is(public.get_nucleus_identity_version(),current_setting('test.identity_before'),'quem saiu não afeta mais o resumo');
reset role;
update auth.users set raw_user_meta_data=raw_user_meta_data||'{"name":"Meu nome novo"}' where id='12000000-0000-4000-8000-000000000001';
set local role authenticated;
select isnt(public.get_nucleus_identity_version(),current_setting('test.identity_before'),'nome próprio também altera resumo');
select * from finish();
rollback;
