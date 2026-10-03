begin;
select plan(1);
insert into auth.users(id) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'), ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'), ('cccccccc-cccc-4ccc-8ccc-cccccccccccc');
insert into public.nuclei(id,type,name,purpose,created_by) values ('11111111-1111-4111-8111-111111111111','casal','Revisão','Teste','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
insert into public.nucleus_members(nucleus_id,user_id,role) values
('11111111-1111-4111-8111-111111111111','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','creator'),
('11111111-1111-4111-8111-111111111111','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','member');
set local role authenticated;
do $$
declare h uuid; r uuid;
begin
 perform set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',true);
 h := public.create_nucleus_agreement('11111111-1111-4111-8111-111111111111','habit','Original','Descrição','Noite','Semanal',7);
 perform set_config('request.jwt.claim.sub','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',true);
 perform public.respond_nucleus_agreement(h,'accepted');
 perform public.record_nucleus_habit_moment('11111111-1111-4111-8111-111111111111',h,'good','Preservar este momento');
 r := public.create_nucleus_habit_revision(h,'adjust','Novo','Descrição nova','Manhã','Diária');
 if (select title from public.nucleus_agreements where id=h) <> 'Original' then raise exception 'mudou antes do consentimento'; end if;
 begin
  perform public.create_nucleus_habit_revision(h,'end',null,null,null,null);
  raise exception 'duplicidade permitida';
 exception when unique_violation then null; end;
 perform set_config('request.jwt.claim.sub','cccccccc-cccc-4ccc-8ccc-cccccccccccc',true);
 if exists(select 1 from public.nucleus_habit_revisions where id=r) then raise exception 'vazamento'; end if;
 begin
  perform public.respond_nucleus_habit_revision(r,'accepted'); raise exception 'terceiro respondeu';
 exception when insufficient_privilege then null; end;
 perform set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',true);
 if public.can_apply_nucleus_habit_revision(r) then raise exception 'aplicação disponível sem consenso'; end if;
 perform public.respond_nucleus_habit_revision(r,'accepted');
 if public.can_apply_nucleus_habit_revision(r) then raise exception 'aplicação disponível antes do prazo'; end if;
 begin
  perform public.apply_nucleus_habit_revision(r); raise exception 'prazo ignorado';
 exception when invalid_parameter_value then null; end;
 begin
  update public.nucleus_habit_revisions set reflect_until=now() where id=r;
  raise exception 'escrita direta permitida';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
-- O relógio é antecipado apenas na transação administrativa do teste.
update public.nucleus_habit_revisions set reflect_until=now()-interval '1 second';
set local role authenticated;
do $$
declare h uuid; r uuid;
begin
 perform set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',true);
 select id,agreement_id into r,h from public.nucleus_habit_revisions;
 perform public.apply_nucleus_habit_revision(r);
 if (select title from public.nucleus_agreements where id=h) <> 'Novo' then raise exception 'ajuste não aplicado'; end if;
 r := public.create_nucleus_habit_revision(h,'end',null,null,null,null);
 perform set_config('request.jwt.claim.sub','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',true);
 perform public.respond_nucleus_habit_revision(r,'declined');
 if (select status from public.nucleus_agreements where id=h) <> 'testing' then raise exception 'recusa encerrou hábito'; end if;
 r := public.create_nucleus_habit_revision(h,'end',null,null,null,null);
 perform set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',true);
 perform public.respond_nucleus_habit_revision(r,'accepted');
end $$;
reset role;
update public.nucleus_habit_revisions set reflect_until=now()-interval '1 second' where status='pending';
set local role authenticated;
do $$
declare r uuid; h uuid;
begin
 select id,agreement_id into r,h from public.nucleus_habit_revisions where status='pending';
 perform public.apply_nucleus_habit_revision(r);
 if (select status from public.nucleus_agreements where id=h) <> 'ended' then raise exception 'encerramento não aplicado'; end if;
 if (select count(*) from public.nucleus_habit_moments where agreement_id=h and note='Preservar este momento') <> 1 then raise exception 'histórico perdido'; end if;
 begin
  perform public.record_nucleus_habit_moment('11111111-1111-4111-8111-111111111111',h,'good','');
  raise exception 'momento em encerrado permitido';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
select pass('revisão preserva combinado, exige consentimento e prazo, isola leitura e encerra sem apagar');
select * from finish();
rollback;
