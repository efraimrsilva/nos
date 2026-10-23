begin;
create extension if not exists pgtap with schema extensions;
set local search_path=public,extensions;
select no_plan();
select has_function('public','delete_my_account',array['text'],'exclusão da própria conta existe');
insert into auth.users(id,email,raw_user_meta_data) values
 ('13000000-0000-4000-8000-000000000001','delete-local@example.test','{"name":"Nome removido"}'),
 ('13000000-0000-4000-8000-000000000002','remain-local@example.test','{"name":"Pessoa preservada"}');
insert into auth.sessions(id,user_id) values('93000000-0000-4000-8000-000000000001','13000000-0000-4000-8000-000000000001');
insert into public.nuclei(id,type,name,purpose,created_by) values
 ('23000000-0000-4000-8000-000000000001','amigos','Compartilhado','Convivência','13000000-0000-4000-8000-000000000001'),
 ('23000000-0000-4000-8000-000000000002','amigos','Individual','Convivência','13000000-0000-4000-8000-000000000001');
insert into public.nucleus_members(nucleus_id,user_id,role) values
 ('23000000-0000-4000-8000-000000000001','13000000-0000-4000-8000-000000000001','admin'),
 ('23000000-0000-4000-8000-000000000001','13000000-0000-4000-8000-000000000002','member'),
 ('23000000-0000-4000-8000-000000000002','13000000-0000-4000-8000-000000000001','admin');
insert into public.user_privacy_preferences(user_id,hide_departed_authorship) values('13000000-0000-4000-8000-000000000001',true);
insert into public.nucleus_admin_nominations(nucleus_id,user_id,nominated_by) values('23000000-0000-4000-8000-000000000001','13000000-0000-4000-8000-000000000002','13000000-0000-4000-8000-000000000001');
insert into public.nucleus_invitations(nucleus_id,code,created_by) values
 ('23000000-0000-4000-8000-000000000001',repeat('d',32),'13000000-0000-4000-8000-000000000001'),
 ('23000000-0000-4000-8000-000000000002',repeat('e',32),'13000000-0000-4000-8000-000000000001');
insert into public.nucleus_agreements(id,nucleus_id,created_by,category,title,description,timing,frequency,status) values
 ('33000000-0000-4000-8000-000000000001','23000000-0000-4000-8000-000000000001','13000000-0000-4000-8000-000000000001','habit','Caminhar','Presença','Manhã','Diária','active');
insert into public.nucleus_agreement_participants(agreement_id,user_id,response,accepted_version) values
 ('33000000-0000-4000-8000-000000000001','13000000-0000-4000-8000-000000000001','accepted',1),
 ('33000000-0000-4000-8000-000000000001','13000000-0000-4000-8000-000000000002','accepted',1);
insert into public.nucleus_habit_moments(agreement_id,author_id,mood,note,authorship_hidden) values
 ('33000000-0000-4000-8000-000000000001','13000000-0000-4000-8000-000000000001','good','Conteúdo preservado',true);
insert into public.nucleus_events(id,nucleus_id,created_by,title,starts_at,ends_at,time_zone) values
 ('43000000-0000-4000-8000-000000000001','23000000-0000-4000-8000-000000000001','13000000-0000-4000-8000-000000000001','Encontro',now()+interval '1 day',now()+interval '1 day 1 hour','UTC');
insert into public.nucleus_event_participants(event_id,user_id,response) values
 ('43000000-0000-4000-8000-000000000001','13000000-0000-4000-8000-000000000001','accepted');
insert into public.nucleus_habit_revisions(id,agreement_id,created_by,kind) values
 ('53000000-0000-4000-8000-000000000001','33000000-0000-4000-8000-000000000001','13000000-0000-4000-8000-000000000001','end');
insert into public.nucleus_habit_revision_responses(revision_id,user_id,response) values
 ('53000000-0000-4000-8000-000000000001','13000000-0000-4000-8000-000000000001','accepted');
insert into public.nucleus_habit_trials(id,agreement_id,created_by,days,status,title,description,timing,frequency,participant_count,activated_by) values
 ('63000000-0000-4000-8000-000000000001','33000000-0000-4000-8000-000000000001','13000000-0000-4000-8000-000000000001',7,'pending','Caminhar','Presença','Manhã','Diária',2,'13000000-0000-4000-8000-000000000001');
insert into public.nucleus_habit_trial_responses(trial_id,user_id,setup_response) values
 ('63000000-0000-4000-8000-000000000001','13000000-0000-4000-8000-000000000001','accepted');
select ok(not has_function_privilege('anon','public.delete_my_account(text)','execute'),'anônimo não pode excluir');
select ok(not has_table_privilege('authenticated','auth.users','delete'),'cliente não exclui diretamente');
set local role authenticated;
select set_config('request.jwt.claim.sub','',true);
select throws_ok($$select public.delete_my_account('APAGAR CONTA')$$,'42501','not authorized','sem identidade não exclui');
select set_config('request.jwt.claim.sub','13000000-0000-4000-8000-000000000001',true);
select throws_ok($$select public.delete_my_account(null)$$,'22023','confirmation phrase does not match','frase ausente rejeitada');
select throws_ok($$select public.delete_my_account('apagar conta')$$,'22023','confirmation phrase does not match','frase diferente rejeitada');
select is((select count(*)::int from public.nucleus_members),2,'confirmação inválida preserva vínculos próprios');
reset role;

-- Simula uma restrição do Auth/Storage: nenhuma saída ou sucessão pode persistir na falha.
create function pg_temp.block_fixture_deletion() returns trigger language plpgsql as $$begin raise exception 'fixture blocked' using errcode='23514'; end;$$;
create trigger block_fixture_deletion before delete on auth.users for each row execute function pg_temp.block_fixture_deletion();
set local role authenticated;
select throws_ok($$select public.delete_my_account('APAGAR CONTA')$$,'23514','fixture blocked','falha final é propagada');
select is((select count(*)::int from public.nucleus_members),2,'falha reverte saída dos dois núcleos');
reset role;
select is((select role from public.nucleus_members where user_id='13000000-0000-4000-8000-000000000002'),'member','falha reverte promoção');
select ok((select closed_at is null from public.nuclei where id='23000000-0000-4000-8000-000000000002'),'falha reverte fechamento');
drop trigger block_fixture_deletion on auth.users;
set local role authenticated;
select lives_ok($$select public.delete_my_account('APAGAR CONTA')$$,'titular apaga a própria conta');
select is((select count(*)::int from public.nucleus_members),0,'token antigo perdeu todos os vínculos');
select throws_ok($$select public.delete_my_account('APAGAR CONTA')$$,'42501','not authorized','token antigo não repete exclusão');
select throws_ok($$select * from public.inspect_invitation(repeat('d',32))$$,'42501','not authorized','token antigo não consulta convite');
select throws_ok($$select * from public.get_nucleus_habit_moments('33000000-0000-4000-8000-000000000001')$$,'42501','not authorized','token antigo não lê momentos');
select throws_ok($$select * from public.get_nucleus_calendar('23000000-0000-4000-8000-000000000001',now())$$,'42501','not authorized','token antigo não lê agenda');
reset role;
select is((select count(*)::int from auth.users where id='13000000-0000-4000-8000-000000000001'),0,'Auth e identificação removidos');
select is((select count(*)::int from auth.sessions where user_id='13000000-0000-4000-8000-000000000001'),0,'sessões removidas');
select is((select count(*)::int from public.user_privacy_preferences where user_id='13000000-0000-4000-8000-000000000001'),0,'preferência removida');
select is((select raw_user_meta_data->>'name' from auth.users where id='13000000-0000-4000-8000-000000000002'),'Pessoa preservada','outra conta intacta');
select is((select role from public.nucleus_members where user_id='13000000-0000-4000-8000-000000000002'),'admin','pessoa restante assume administração');
select ok((select closed_at is not null from public.nuclei where id='23000000-0000-4000-8000-000000000002'),'último membro encerra núcleo');
select ok((select bool_and(revoked_at is not null) from public.nucleus_invitations where code in(repeat('d',32),repeat('e',32))),'convites do titular revogados');
select ok((select created_by is null from public.nucleus_agreements where id='33000000-0000-4000-8000-000000000001'),'acordo preservado sem autor');
select ok((select author_id is null and not authorship_hidden and note='Conteúdo preservado' from public.nucleus_habit_moments where agreement_id='33000000-0000-4000-8000-000000000001'),'momento preservado como conta excluída');
select is((select count(*)::int from public.nucleus_agreement_participants where agreement_id='33000000-0000-4000-8000-000000000001'),2,'respostas do acordo preservadas');
select ok((select user_id is null from public.nucleus_event_participants where event_id='43000000-0000-4000-8000-000000000001'),'resposta do evento preservada sem identificação');
select ok((select user_id is null from public.nucleus_habit_revision_responses where revision_id='53000000-0000-4000-8000-000000000001'),'voto histórico preservado sem identificação');
select ok((select user_id is null from public.nucleus_habit_trial_responses where trial_id='63000000-0000-4000-8000-000000000001'),'resposta histórica do teste preservada');
select ok((select created_by is null and activated_by is null from public.nucleus_habit_trials where id='63000000-0000-4000-8000-000000000001'),'ciclo preservado sem autoria');
set local role authenticated;
select set_config('request.jwt.claim.sub','13000000-0000-4000-8000-000000000002',true);
select is((select count(*)::int from public.get_nucleus_habit_moments('33000000-0000-4000-8000-000000000001')),1,'outra pessoa conserva histórico');
select ok((select creator_deleted and can_manage from public.get_nucleus_calendar('23000000-0000-4000-8000-000000000001',now())),'agenda identifica conta excluída e conserva gestão');
select lives_ok($$select public.delete_my_account('APAGAR CONTA')$$,'segunda conta também pode excluir');
reset role;
select is((select count(*)::int from public.nucleus_agreement_participants where agreement_id='33000000-0000-4000-8000-000000000001' and user_id is null),2,'duas autorias apagadas preservam respostas distintas');
select ok((select closed_at is not null from public.nuclei where id='23000000-0000-4000-8000-000000000001'),'última conta fecha espaço após sucessão');
insert into auth.users(id) values('13000000-0000-4000-8000-000000000003');
-- Apenas metadados descartáveis locais, sem criar ou remover arquivos reais.
insert into storage.buckets(id,name) values('account-deletion-fixture','account-deletion-fixture');
insert into storage.objects(bucket_id,name,owner_id) values('account-deletion-fixture','fixture.txt','13000000-0000-4000-8000-000000000003');
set local role authenticated;
select set_config('request.jwt.claim.sub','13000000-0000-4000-8000-000000000003',true);
select throws_ok($$select public.delete_my_account('APAGAR CONTA')$$,'55000','account owns storage objects','conta com arquivo exige tratamento pela API de Storage');
reset role;
select is((select count(*)::int from auth.users where id='13000000-0000-4000-8000-000000000003'),1,'restrição de arquivo preserva a conta');
select * from finish();
rollback;
