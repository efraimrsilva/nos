begin;
select plan(1);
-- Duas fotografias reais de participantes exercitam o limite exato de 150/151.
insert into auth.users(id,email)
select md5('threshold-user-'||i)::uuid,'threshold-'||i||'@example.test' from generate_series(1,151) i;
insert into public.nuclei(id,type,name,purpose,created_by) values
('22222222-2222-4222-8222-222222222222','familia','150','Temporário',md5('threshold-user-1')::uuid),
('33333333-3333-4333-8333-333333333333','familia','151','Temporário',md5('threshold-user-1')::uuid);
insert into public.nucleus_members(nucleus_id,user_id,role)
select '22222222-2222-4222-8222-222222222222',md5('threshold-user-'||i)::uuid,case when i=1 then 'creator' else 'member' end from generate_series(1,150) i;
insert into public.nucleus_members(nucleus_id,user_id,role)
select '33333333-3333-4333-8333-333333333333',md5('threshold-user-'||i)::uuid,case when i=1 then 'creator' else 'member' end from generate_series(1,151) i;
set local role authenticated;
do $$
declare h uuid; t uuid; i integer; n integer; nid uuid;
begin
 for n in 150..151 loop
  nid:=case when n=150 then '22222222-2222-4222-8222-222222222222'::uuid else '33333333-3333-4333-8333-333333333333'::uuid end;
  perform set_config('request.jwt.claim.sub',md5('threshold-user-1'),true);
  h:=public.create_nucleus_agreement(nid,'habit','Limite','Teste real','Hoje','Diária',7);
  for i in 2..n loop
   perform set_config('request.jwt.claim.sub',md5('threshold-user-'||i),true);
   perform public.respond_nucleus_agreement(h,'accepted');
  end loop;
  if (public.get_nucleus_habit_trial_state(h)->>'required')::integer<>(case when n=150 then 76 else 51 end)
  then raise exception 'limiar incorreto para % participantes',n; end if;
 end loop;
end $$;
reset role;
update public.nucleus_habit_trials set started_at=now()-interval '8 days',ends_at=now()-interval '1 day';
set local role authenticated;
do $$
declare h uuid; t uuid; i integer; n integer; needed integer;
begin
 for n in 150..151 loop
  perform set_config('request.jwt.claim.sub',md5('threshold-user-1'),true);
  select a.id,nt.id into h,t from public.nucleus_agreements a join public.nucleus_habit_trials nt on nt.agreement_id=a.id
   where a.nucleus_id=case when n=150 then '22222222-2222-4222-8222-222222222222'::uuid else '33333333-3333-4333-8333-333333333333'::uuid end;
  needed:=case when n=150 then 76 else 51 end;
  for i in 1..needed-1 loop
   perform set_config('request.jwt.claim.sub',md5('threshold-user-'||i),true);
   perform public.confirm_nucleus_habit_trial(t);
  end loop;
  if (select status from public.nucleus_agreements where id=h)<>'testing' then raise exception 'ativou antes do limiar'; end if;
  perform set_config('request.jwt.claim.sub',md5('threshold-user-'||needed),true);
  perform public.confirm_nucleus_habit_trial(t);
  if (select status from public.nucleus_agreements where id=h)<>'active' then raise exception 'limiar não ativou'; end if;
 end loop;
end $$;
reset role;
select pass('150 exige 76 votos; 151 exige 51, sem ativação abaixo do limiar');
select * from finish();
rollback;
