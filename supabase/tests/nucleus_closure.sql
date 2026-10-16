begin;
create extension if not exists pgtap with schema extensions;
set local search_path=public,extensions;
select no_plan();
select has_function('public','close_nucleus',array['uuid','text'],'encerramento administrativo existe');
insert into auth.users(id) values('12000000-0000-4000-8000-000000000001'),('12000000-0000-4000-8000-000000000002'),('12000000-0000-4000-8000-000000000003');
insert into public.nuclei(id,type,name,purpose,created_by) values
 ('22000000-0000-4000-8000-000000000001','amigos','Jardim preservado','Convivência','12000000-0000-4000-8000-000000000001'),
 ('22000000-0000-4000-8000-000000000002','amigos','Outro jardim','Convivência','12000000-0000-4000-8000-000000000003');
insert into public.nucleus_members(nucleus_id,user_id,role) values
 ('22000000-0000-4000-8000-000000000001','12000000-0000-4000-8000-000000000001','admin'),
 ('22000000-0000-4000-8000-000000000001','12000000-0000-4000-8000-000000000002','member'),
 ('22000000-0000-4000-8000-000000000002','12000000-0000-4000-8000-000000000003','admin');
insert into public.nucleus_invitations(nucleus_id,code,created_by,revoked_at) values
 ('22000000-0000-4000-8000-000000000001',repeat('a',32),'12000000-0000-4000-8000-000000000001',null),
 ('22000000-0000-4000-8000-000000000001',repeat('b',32),'12000000-0000-4000-8000-000000000001','2026-01-01Z');
insert into public.nucleus_agreements(id,nucleus_id,created_by,category,title,description,timing,frequency,status,trial_days) values
 ('32000000-0000-4000-8000-000000000001','22000000-0000-4000-8000-000000000001','12000000-0000-4000-8000-000000000001','habit','Caminhar','Presença','Manhã','Diária','active',7);
insert into public.nucleus_habit_moments(agreement_id,author_id,mood,note) values('32000000-0000-4000-8000-000000000001','12000000-0000-4000-8000-000000000002','good','História preservada');
insert into public.nucleus_events(id,nucleus_id,created_by,title,starts_at,ends_at,time_zone) values('42000000-0000-4000-8000-000000000001','22000000-0000-4000-8000-000000000001','12000000-0000-4000-8000-000000000002','Encontro',now()+interval '1 day',now()+interval '1 day 1 hour','UTC');
select ok(not has_function_privilege('anon','public.close_nucleus(uuid,text)','execute'),'anônimo não executa encerramento');
select ok(not has_table_privilege('authenticated','public.nuclei','update'),'cliente não altera fechamento diretamente');
set local role authenticated;
select set_config('request.jwt.claim.sub','12000000-0000-4000-8000-000000000003',true);
select throws_ok($$select public.close_nucleus('22000000-0000-4000-8000-000000000001','Jardim preservado')$$,'42501','not authorized','administrador de outro núcleo não encerra');
select set_config('request.jwt.claim.sub','12000000-0000-4000-8000-000000000002',true);
select throws_ok($$select public.close_nucleus('22000000-0000-4000-8000-000000000001','Jardim preservado')$$,'42501','not authorized','participante comum não encerra');
select set_config('request.jwt.claim.sub','12000000-0000-4000-8000-000000000001',true);
select throws_ok($$select public.close_nucleus('22000000-0000-4000-8000-000000000001',null)$$,'22023','confirmation name does not match','confirmação ausente é rejeitada');
select throws_ok($$select public.close_nucleus('22000000-0000-4000-8000-000000000001','Outro nome')$$,'22023','confirmation name does not match','nome incorreto é rejeitado');
select is((select count(*)::int from public.nuclei),1,'falhas preservam acesso ao núcleo');
reset role;
update public.nucleus_members set role='admin' where nucleus_id='22000000-0000-4000-8000-000000000001' and user_id='12000000-0000-4000-8000-000000000002';
set local role authenticated;
select set_config('request.jwt.claim.sub','12000000-0000-4000-8000-000000000002',true);
select lives_ok($$select public.close_nucleus('22000000-0000-4000-8000-000000000001','Jardim preservado')$$,'administrador que não criou o núcleo também encerra');
select is((select count(*)::int from public.nuclei),0,'administrador perde acesso após fechar');
select throws_ok($$select public.close_nucleus('22000000-0000-4000-8000-000000000001','Jardim preservado')$$,'42501','not authorized','repetição não reabre nem altera fechamento');
select set_config('request.jwt.claim.sub','12000000-0000-4000-8000-000000000002',true);
select is((select count(*)::int from public.nucleus_members),0,'outro participante também perde vínculo');
select is((select count(*)::int from public.nucleus_agreements),0,'histórico deixa de ser acessível ao ex-participante');
select throws_ok($$select * from public.nucleus_habit_moments$$,'42501','permission denied for table nucleus_habit_moments','momentos não vazam por leitura direta');
select throws_ok($$select * from public.nucleus_events$$,'42501','permission denied for table nucleus_events','agenda não vaza por leitura direta');
select throws_ok($$select public.accept_invitation(repeat('a',32))$$,'P0002','invitation unavailable','convite antigo não permite retorno');
reset role;
select ok((select closed_at is not null from public.nuclei where id='22000000-0000-4000-8000-000000000001'),'fechamento é persistido sem apagar núcleo');
select is((select count(*)::int from public.nucleus_invitations where nucleus_id='22000000-0000-4000-8000-000000000001' and revoked_at is null),0,'todos os convites revogados');
select is((select revoked_at from public.nucleus_invitations where code=repeat('b',32)),'2026-01-01Z'::timestamptz,'revogação antiga preserva data');
select is((select count(*)::int from public.nucleus_agreements where id='32000000-0000-4000-8000-000000000001'),1,'acordo permanece armazenado');
select is((select note from public.nucleus_habit_moments where agreement_id='32000000-0000-4000-8000-000000000001'),'História preservada','conteúdo do momento permanece');
select is((select count(*)::int from public.nucleus_events where id='42000000-0000-4000-8000-000000000001'),1,'agenda permanece armazenada');
select is((select count(*)::int from public.nucleus_members where nucleus_id='22000000-0000-4000-8000-000000000002'),1,'outro núcleo permanece intacto');
select is((select count(*)::int from auth.users where id::text like '12000000-%'),3,'contas não são apagadas');
select * from finish();
rollback;
