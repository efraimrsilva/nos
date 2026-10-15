begin;
select plan(2);
select has_table('public','nucleus_habit_trials','ciclos de teste persistidos');
insert into auth.users(id,email) values
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','trial-a@example.test'),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','trial-b@example.test'),
('cccccccc-cccc-4ccc-8ccc-cccccccccccc','trial-c@example.test'),
('dddddddd-dddd-4ddd-8ddd-dddddddddddd','trial-d@example.test'),
('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','trial-outside@example.test');
insert into public.nuclei(id,type,name,purpose,created_by) values
('11111111-1111-4111-8111-111111111111','familia','Teste maioria','Temporário','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
insert into public.nucleus_members(nucleus_id,user_id,role)
select '11111111-1111-4111-8111-111111111111',id,case when id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' then 'creator' else 'member' end
from auth.users where id in ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','cccccccc-cccc-4ccc-8ccc-cccccccccccc','dddddddd-dddd-4ddd-8ddd-dddddddddddd');
set local role authenticated;
do $$
declare h uuid; t uuid;
begin
 if to_regclass('public.nucleus_habit_trials') is null then return; end if;
 perform set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',true);
 begin
  perform public.create_nucleus_agreement('11111111-1111-4111-8111-111111111111','habit','X','Y','Z','W',6);
  raise exception 'duração inválida permitida';
 exception when invalid_parameter_value then null; end;
 h:=public.create_nucleus_agreement('11111111-1111-4111-8111-111111111111','habit','Maioria','Teste','Noite','Diária',7);
 if exists(select 1 from public.nucleus_habit_trials where agreement_id=h) then raise exception 'teste começou antes do consenso inicial'; end if;
 perform set_config('request.jwt.claim.sub','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',true); perform public.respond_nucleus_agreement(h,'accepted');
 perform set_config('request.jwt.claim.sub','cccccccc-cccc-4ccc-8ccc-cccccccccccc',true); perform public.respond_nucleus_agreement(h,'accepted');
 perform set_config('request.jwt.claim.sub','dddddddd-dddd-4ddd-8ddd-dddddddddddd',true); perform public.respond_nucleus_agreement(h,'accepted');
 select id into t from public.nucleus_habit_trials where agreement_id=h;
 if (select ends_at-started_at from public.nucleus_habit_trials where id=t)<>interval '7 days' then raise exception 'prazo incorreto'; end if;
 begin perform public.confirm_nucleus_habit_trial(t); raise exception 'confirmação antes do prazo'; exception when invalid_parameter_value then null; end;
 begin update public.nucleus_habit_trials set ends_at=now() where id=t; raise exception 'escrita direta'; exception when insufficient_privilege then null; end;
 perform set_config('request.jwt.claim.sub','eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',true);
 if exists(select 1 from public.nucleus_habit_trials) then raise exception 'leitura entre núcleos'; end if;
 if public.get_nucleus_habit_trial_state(h) is not null then raise exception 'agregados vazaram'; end if;
end $$;
reset role;
-- Antecipação de relógio restrita à fixture desta transação local.
do $$ begin if to_regclass('public.nucleus_habit_trials') is not null then
 update public.nucleus_habit_trials set started_at=now()-interval '8 days',ends_at=now()-interval '1 day';
end if; end $$;
delete from public.nucleus_members where user_id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
set local role authenticated;
do $$
declare t uuid; h uuid;
begin
 if to_regclass('public.nucleus_habit_trials') is null then return; end if;
 perform set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',true);
 select id,agreement_id into t,h from public.nucleus_habit_trials;
 if (public.get_nucleus_habit_trial_state(h)->>'required')::integer<>3 then raise exception 'saída reduziu denominador'; end if;
 begin perform public.confirm_nucleus_habit_trial(t); raise exception 'confirmou com participante ausente'; exception when insufficient_privilege then null; end;
end $$;
reset role;
insert into public.nucleus_members(nucleus_id,user_id,role) values('11111111-1111-4111-8111-111111111111','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','member');
set local role authenticated;
do $$
declare h uuid; t uuid; r uuid;
begin
 if to_regclass('public.nucleus_habit_trials') is null then return; end if;
 perform set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',true);
 select id,agreement_id into t,h from public.nucleus_habit_trials;
 perform public.confirm_nucleus_habit_trial(t);
 perform set_config('request.jwt.claim.sub','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',true); perform public.confirm_nucleus_habit_trial(t);
 if (select status from public.nucleus_agreements where id=h)<>'testing' then raise exception 'metade ativou'; end if;
 r:=public.create_nucleus_habit_revision(h,'end',null,null,null,null);
 perform set_config('request.jwt.claim.sub','cccccccc-cccc-4ccc-8ccc-cccccccccccc',true);
 begin perform public.confirm_nucleus_habit_trial(t); raise exception 'confirmou durante revisão'; exception when invalid_parameter_value then null; end;
 perform public.respond_nucleus_habit_revision(r,'declined');
 perform set_config('request.jwt.claim.sub','cccccccc-cccc-4ccc-8ccc-cccccccccccc',true); perform public.confirm_nucleus_habit_trial(t);
 if (select status from public.nucleus_agreements where id=h)<>'active' then raise exception '3 de 4 não ativou'; end if;
 if (select count(*) from public.nucleus_habit_trial_responses where trial_id=t)<>1 then raise exception 'votos individuais expostos'; end if;
 perform public.record_nucleus_habit_moment('11111111-1111-4111-8111-111111111111',h,'good','Ativo preservado');
 r:=public.create_nucleus_habit_revision(h,'adjust','Ajustado','Novo','Manhã','Semanal');
 perform set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',true); perform public.respond_nucleus_habit_revision(r,'accepted');
 perform set_config('request.jwt.claim.sub','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',true); perform public.respond_nucleus_habit_revision(r,'accepted');
 perform set_config('request.jwt.claim.sub','dddddddd-dddd-4ddd-8ddd-dddddddddddd',true); perform public.respond_nucleus_habit_revision(r,'accepted');
end $$;
reset role;
update public.nucleus_habit_revisions set reflect_until=now()-interval '1 second';
set local role authenticated;
do $$
declare h uuid; r uuid;
begin
 if to_regclass('public.nucleus_habit_trials') is null then return; end if;
 perform set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',true);
 select id,agreement_id into r,h from public.nucleus_habit_revisions where status='pending';
 perform public.apply_nucleus_habit_revision(r);
 if (select status from public.nucleus_agreements where id=h)<>'testing' then raise exception 'ajuste ativo não reabriu teste'; end if;
 if (select count(*) from public.nucleus_habit_trials where agreement_id=h)<>2 then raise exception 'ciclo anterior perdido'; end if;
 if exists(select 1 from public.nucleus_habit_trial_responses p join public.nucleus_habit_trials t on t.id=p.trial_id where t.status='testing' and p.confirmed_at is not null) then raise exception 'votos reutilizados'; end if;
 if not exists(select 1 from public.nucleus_habit_moments where agreement_id=h and note='Ativo preservado') then raise exception 'momento perdido'; end if;
end $$;
reset role;
select pass('prazo, maioria 3/4, RLS, ativo e ciclos preservados');
select * from finish();
rollback;
