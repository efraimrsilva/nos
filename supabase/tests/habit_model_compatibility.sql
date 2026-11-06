begin;
create extension if not exists pgtap with schema extensions;
set local search_path=public,extensions;
select no_plan();

insert into auth.users(id) values
 ('16000000-0000-4000-8000-000000000001'),
 ('16000000-0000-4000-8000-000000000002'),
 ('16000000-0000-4000-8000-000000000003');
insert into public.nuclei(id,type,name,purpose,created_by) values
 ('26000000-0000-4000-8000-000000000001','familia','Compatibilidade Hábito','Cuidar','16000000-0000-4000-8000-000000000001');
insert into public.nucleus_members(nucleus_id,user_id,role) values
 ('26000000-0000-4000-8000-000000000001','16000000-0000-4000-8000-000000000001','admin'),
 ('26000000-0000-4000-8000-000000000001','16000000-0000-4000-8000-000000000002','member');
-- Simula o armazenamento antigo sem regravar termos, datas ou consentimentos.
insert into public.nucleus_agreements(id,nucleus_id,created_by,category,title,description,timing,frequency,status,terms_version) values
 ('36000000-0000-4000-8000-000000000001','26000000-0000-4000-8000-000000000001','16000000-0000-4000-8000-000000000001','experience','Jantar mensal','Estar presentes','Noite','Mensal','active',2);
insert into public.nucleus_agreement_versions(agreement_id,version,title,description,timing,frequency) values
 ('36000000-0000-4000-8000-000000000001',2,'Jantar mensal','Estar presentes','Noite','Mensal');
insert into public.nucleus_agreement_participants(agreement_id,user_id,response,accepted_version) values
 ('36000000-0000-4000-8000-000000000001','16000000-0000-4000-8000-000000000001','accepted',2);
create temporary table new_agreement(id uuid);
grant all on new_agreement to authenticated;
set local role authenticated;
select set_config('request.jwt.claim.sub','16000000-0000-4000-8000-000000000001',true);
select lives_ok($$select public.record_nucleus_habit_moment('26000000-0000-4000-8000-000000000001','36000000-0000-4000-8000-000000000001','good','Momento do mesmo Hábito')$$,'legado usa registro comum com aceite vigente');
select is((select count(*) from public.get_nucleus_habit_moments('36000000-0000-4000-8000-000000000001')),1::bigint,'um registro no histórico comum');
insert into new_agreement select public.create_nucleus_agreement('26000000-0000-4000-8000-000000000001','experience','Cliente antigo','Com cuidado','Noite','Mensal',null);
select is((select category from public.nucleus_agreements where id=(select id from new_agreement)),'habit','argumento antigo cria somente Hábito');
select is((select trial_days from public.nucleus_agreements where id=(select id from new_agreement)),null::integer,'compatibilidade não fabrica duração');
select is((select status from public.nucleus_agreements where id=(select id from new_agreement)),'pending','compatibilidade não promove proposta');
select is((select count(*) from public.nucleus_agreement_participants where agreement_id=(select id from new_agreement)),0::bigint,'publicar não aceita por ninguém');
select throws_ok($$select public.create_nucleus_agreement('26000000-0000-4000-8000-000000000001','habit','Sem prazo','Com cuidado','Noite','Mensal',null)$$,'22023','invalid agreement fields','formato atual ainda exige duração válida');
select throws_ok($$select public.create_nucleus_agreement('26000000-0000-4000-8000-000000000001','essence','Salto','Com cuidado','Noite','Mensal',7)$$,'22023','invalid agreement fields','não cria Essência por categoria');
select set_config('request.jwt.claim.sub','16000000-0000-4000-8000-000000000002',true);
select throws_ok($$select public.record_nucleus_habit_moment('26000000-0000-4000-8000-000000000001','36000000-0000-4000-8000-000000000001','good','Sem aceite')$$,'42501','not authorized or current terms not accepted','legado mantém exigência de aceite');
select set_config('request.jwt.claim.sub','16000000-0000-4000-8000-000000000003',true);
select throws_ok($$select public.get_nucleus_habit_moments('36000000-0000-4000-8000-000000000001')$$,'42501','not authorized','legado mantém isolamento');
reset role;
select is((select category from public.nucleus_agreements where id='36000000-0000-4000-8000-000000000001'),'experience','armazenamento legado preservado');
select is((select terms_version from public.nucleus_agreements where id='36000000-0000-4000-8000-000000000001'),2,'compatibilidade não muda versão');
select is((select accepted_version from public.nucleus_agreement_participants where agreement_id='36000000-0000-4000-8000-000000000001'),2,'aceite vigente preservado');
select is((select count(*) from public.nucleus_agreement_versions where agreement_id='36000000-0000-4000-8000-000000000001'),1::bigint,'histórico de termos não duplicado');
select * from finish();
rollback;
