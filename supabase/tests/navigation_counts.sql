begin;
create extension if not exists pgtap with schema extensions;
set local search_path=public,extensions;
select no_plan();
select has_function('public','get_navigation_counts',array[]::text[],'totais pessoais disponíveis');
insert into auth.users(id) select ('13000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid from generate_series(1,4) i;
insert into public.nuclei(id,type,name,purpose,created_by,closed_at)
select ('23000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,'amigos','Núcleo de teste','Convivência','13000000-0000-4000-8000-000000000001',case when i=3 then now() end from generate_series(1,4) i;
insert into public.nucleus_members(nucleus_id,user_id,role) values
('23000000-0000-4000-8000-000000000001','13000000-0000-4000-8000-000000000001','admin'),
('23000000-0000-4000-8000-000000000002','13000000-0000-4000-8000-000000000001','admin'),
('23000000-0000-4000-8000-000000000003','13000000-0000-4000-8000-000000000001','admin'),
('23000000-0000-4000-8000-000000000001','13000000-0000-4000-8000-000000000002','member'),
('23000000-0000-4000-8000-000000000002','13000000-0000-4000-8000-000000000002','member'),
('23000000-0000-4000-8000-000000000002','13000000-0000-4000-8000-000000000003','member'),
('23000000-0000-4000-8000-000000000003','13000000-0000-4000-8000-000000000004','member');
-- Inclui aceite antigo, resposta pendente/recusada, encerrado, outro Núcleo e vínculo ausente.
insert into public.nucleus_agreements(id,nucleus_id,created_by,category,title,description,timing,frequency,status,terms_version)
select ('33000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,
('23000000-0000-4000-8000-'||lpad((case when i=8 then 3 when i=9 then 4 when i=2 then 2 else 1 end)::text,12,'0'))::uuid,
'13000000-0000-4000-8000-000000000001','habit','Caminhar','Presença','Manhã','Diária',
case when i=5 then 'ended' when i=6 then 'declined' when i=2 then 'testing' when i=3 then 'active' else 'pending' end,2 from generate_series(1,10) i;
insert into public.nucleus_agreement_participants(agreement_id,user_id,response,accepted_version)
select ('33000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,'13000000-0000-4000-8000-000000000001',
case when i=4 then 'pending' when i=7 then 'declined' else 'accepted' end,case when i=3 then 1 else 2 end from generate_series(1,9) i;
insert into public.nucleus_events(id,nucleus_id,created_by,title,starts_at,ends_at,time_zone)
select ('43000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,
('23000000-0000-4000-8000-'||lpad((case when i=6 then 3 when i=7 then 4 when i=2 then 2 else 1 end)::text,12,'0'))::uuid,
'13000000-0000-4000-8000-000000000001','Encontro',now()-interval '1 hour',
case when i=4 then now()-interval '1 minute' when i=5 then now() else now()+interval '1 hour' end,'UTC' from generate_series(1,8) i;
insert into public.nucleus_event_participants(event_id,user_id,response)
select ('43000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,'13000000-0000-4000-8000-000000000001',case when i=3 then 'declined' when i=2 then 'pending' else 'accepted' end from generate_series(1,7) i;
select ok(not has_function_privilege('anon','public.get_navigation_counts()','execute'),'anônimo sem permissão');
select ok(not has_table_privilege('authenticated','public.nucleus_events','select'),'privacidade da agenda preservada');
set local role authenticated;
select set_config('request.jwt.claim.sub','',true);
select throws_ok('select public.get_navigation_counts()','42501','not authorized','sem identidade não consulta');
select set_config('request.jwt.claim.sub','13000000-0000-4000-8000-000000000001',true);
select is((public.get_navigation_counts()->>'nuclei')::int,2,'somente Núcleos atuais e abertos');
select is((public.get_navigation_counts()->>'agreements')::int,2,'aceite vigente em propostas/testes, excluindo demais casos');
select is((public.get_navigation_counts()->>'events')::int,2,'incluído pendente/aceito, em andamento, sem recusados/passados/encerrados');
select is((public.get_navigation_counts()->>'people')::int,2,'pessoas distintas, sem a própria pessoa ou Núcleo fechado');
select set_config('request.jwt.claim.sub','13000000-0000-4000-8000-000000000004',true);
select is(public.get_navigation_counts(),'{"nuclei":0,"agreements":0,"events":0,"people":0}'::jsonb,'pessoa sem vínculo atual recebe zeros reais');
reset role;
delete from public.nucleus_members where user_id='13000000-0000-4000-8000-000000000001' and nucleus_id='23000000-0000-4000-8000-000000000002';
set local role authenticated;
select set_config('request.jwt.claim.sub','13000000-0000-4000-8000-000000000001',true);
select is(public.get_navigation_counts(),'{"nuclei":1,"agreements":1,"events":1,"people":1}'::jsonb,'saída atualiza os quatro totais sem apagar histórico');
select * from finish();
rollback;
