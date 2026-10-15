-- Administração substitui os quóruns legados. As tabelas de votação permanecem como história.
alter table public.nuclei add column closed_at timestamptz;
alter table public.nucleus_members drop constraint nucleus_members_role_check;
update public.nucleus_members set role='admin' where role='creator';
alter table public.nucleus_members add constraint nucleus_members_role_check check(role in ('admin','member'));
alter table public.nucleus_agreements add column terms_version integer not null default 1 check(terms_version>0);
alter table public.nucleus_agreements add column test_started_at timestamptz;
update public.nucleus_agreements a set test_started_at=t.started_at from (
 select distinct on (agreement_id) agreement_id,started_at from public.nucleus_habit_trials
 where started_at is not null order by agreement_id,created_at desc,id desc
) t where a.id=t.agreement_id and a.status in ('testing','active');
alter table public.nucleus_agreement_participants add column accepted_version integer;
update public.nucleus_agreement_participants set accepted_version=1 where response='accepted';
alter table public.nucleus_habit_moments add column authorship_hidden boolean not null default false;
alter table public.nucleus_events add column authorship_hidden boolean not null default false;
alter table public.nucleus_event_participants add column authorship_hidden boolean not null default false;
create table public.user_privacy_preferences (
 user_id uuid primary key references auth.users(id) on delete cascade,
 hide_departed_authorship boolean not null default false
);
create table public.nucleus_admin_nominations (
 nucleus_id uuid not null references public.nuclei(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 nominated_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 primary key(nucleus_id,user_id)
);
create table public.nucleus_agreement_versions (
 agreement_id uuid not null references public.nucleus_agreements(id) on delete cascade,
 version integer not null,
 title text not null,description text not null,timing text not null,frequency text not null,
 changed_at timestamptz not null default now(),
 primary key(agreement_id,version)
);
insert into public.nucleus_agreement_versions(agreement_id,version,title,description,timing,frequency,changed_at)
 select id,terms_version,title,description,timing,frequency,created_at from public.nucleus_agreements;
alter table public.user_privacy_preferences enable row level security;
alter table public.nucleus_admin_nominations enable row level security;
alter table public.nucleus_agreement_versions enable row level security;
create policy "own privacy preference" on public.user_privacy_preferences for select to authenticated using(user_id=(select auth.uid()));
create policy "members read terms versions" on public.nucleus_agreement_versions for select to authenticated using(exists(select 1 from public.nucleus_agreements a where a.id=agreement_id));
revoke all on public.user_privacy_preferences,public.nucleus_admin_nominations,public.nucleus_agreement_versions from anon,authenticated;
grant select on public.user_privacy_preferences,public.nucleus_agreement_versions to authenticated;
-- Apenas a RPC pode revelar momentos: SELECT bruto permitiria recuperar a autoria ocultada.
revoke select on public.nucleus_habit_moments from authenticated;

create function public.lock_nucleus_member(target_nucleus uuid,administrator_required boolean default false)
returns void language plpgsql security definer set search_path='' as $$
begin
 perform 1 from public.nuclei where id=target_nucleus and closed_at is null for update;
 if not found or auth.uid() is null or not exists(select 1 from public.nucleus_members where nucleus_id=target_nucleus and user_id=auth.uid() and (not administrator_required or role='admin')) then
  raise exception 'not authorized' using errcode='42501';
 end if;
end;$$;
revoke all on function public.lock_nucleus_member(uuid,boolean) from public,anon,authenticated;

create or replace function public.create_nucleus(nucleus_type text,nucleus_name text,nucleus_purpose text)
returns uuid language plpgsql security definer set search_path='' as $$
declare result uuid;
begin
 if auth.uid() is null then raise exception 'authentication required' using errcode='28000'; end if;
 if nucleus_type is null or nucleus_type not in ('casal','familia','irmaos','pais','amigos','equipes','comunidades','mentorias','grupos-religiosos') or nucleus_name is null or char_length(btrim(nucleus_name)) not between 1 and 80 or nucleus_purpose is null or char_length(btrim(nucleus_purpose)) not between 1 and 500 then raise exception 'invalid nucleus fields' using errcode='22023'; end if;
 insert into public.nuclei(type,name,purpose,created_by) values(nucleus_type,btrim(nucleus_name),btrim(nucleus_purpose),auth.uid()) returning id into result;
 insert into public.nucleus_members(nucleus_id,user_id,role) values(result,auth.uid(),'admin');
 return result;
end;$$;

create function public.get_my_privacy_preference() returns boolean language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'not authorized' using errcode='42501'; end if;
 return coalesce((select hide_departed_authorship from public.user_privacy_preferences where user_id=auth.uid()),false);
end;$$;
create function public.set_my_privacy_preference(hide_authorship boolean) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'not authorized' using errcode='42501'; end if;
 if hide_authorship is null then raise exception 'invalid preference' using errcode='22023'; end if;
 insert into public.user_privacy_preferences(user_id,hide_departed_authorship) values(auth.uid(),hide_authorship)
 on conflict(user_id) do update set hide_departed_authorship=excluded.hide_departed_authorship;
end;$$;

create function public.get_nucleus_management(target_nucleus uuid) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform public.lock_nucleus_member(target_nucleus);
 -- Não expor e-mail ou metadados privados; apenas o nome público fornecido pelo próprio usuário.
 return jsonb_build_object('members',coalesce((select jsonb_agg(jsonb_build_object('user_id',m.user_id,'display_name',coalesce(nullif(btrim(u.raw_user_meta_data->>'name'),''),nullif(btrim(u.raw_user_meta_data->>'display_name'),''),'Participante'),'role',m.role,'nomination_pending',exists(select 1 from public.nucleus_admin_nominations x where x.nucleus_id=target_nucleus and x.user_id=m.user_id)) order by m.joined_at,m.user_id) from public.nucleus_members m join auth.users u on u.id=m.user_id where m.nucleus_id=target_nucleus),'[]'::jsonb));
end;$$;
create function public.update_nucleus_details(target_nucleus uuid,nucleus_name text,nucleus_purpose text) returns void language plpgsql security definer set search_path='' as $$
begin
 perform public.lock_nucleus_member(target_nucleus,true);
 if nucleus_name is null or char_length(btrim(nucleus_name)) not between 1 and 80 or nucleus_purpose is null or char_length(btrim(nucleus_purpose)) not between 1 and 500 then raise exception 'invalid nucleus fields' using errcode='22023'; end if;
 update public.nuclei set name=btrim(nucleus_name),purpose=btrim(nucleus_purpose) where id=target_nucleus;
end;$$;
create function public.nominate_nucleus_admin(target_nucleus uuid,target_user uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 perform public.lock_nucleus_member(target_nucleus,true);
 if not exists(select 1 from public.nucleus_members where nucleus_id=target_nucleus and user_id=target_user and role='member') then raise exception 'member unavailable' using errcode='P0002'; end if;
 insert into public.nucleus_admin_nominations(nucleus_id,user_id,nominated_by) values(target_nucleus,target_user,auth.uid()) on conflict(nucleus_id,user_id) do nothing;
end;$$;
create function public.respond_nucleus_admin_nomination(target_nucleus uuid,accept_nomination boolean) returns void language plpgsql security definer set search_path='' as $$
begin
 perform public.lock_nucleus_member(target_nucleus);
 if accept_nomination is null then raise exception 'invalid response' using errcode='22023'; end if;
 delete from public.nucleus_admin_nominations where nucleus_id=target_nucleus and user_id=auth.uid();
 if not found then raise exception 'nomination unavailable' using errcode='P0002'; end if;
 if accept_nomination then update public.nucleus_members set role='admin' where nucleus_id=target_nucleus and user_id=auth.uid(); end if;
end;$$;
create function public.demote_nucleus_admin(target_nucleus uuid,target_user uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 perform public.lock_nucleus_member(target_nucleus,true);
 if (select count(*) from public.nucleus_members where nucleus_id=target_nucleus and role='admin')<=1 then raise exception 'last administrator cannot be demoted' using errcode='22023'; end if;
 update public.nucleus_members set role='member' where nucleus_id=target_nucleus and user_id=target_user and role='admin';
 if not found then raise exception 'administrator unavailable' using errcode='P0002'; end if;
end;$$;

-- Todas as saídas usam a mesma transação e o bloqueio do Núcleo, também usado nos convites.
create function public.depart_nucleus_member(target_nucleus uuid,target_user uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare hidden boolean; promoted uuid; closed boolean:=false;
begin
 hidden:=coalesce((select hide_departed_authorship from public.user_privacy_preferences where user_id=target_user),false);
 delete from public.nucleus_members where nucleus_id=target_nucleus and user_id=target_user;
 if not found then raise exception 'member unavailable' using errcode='P0002'; end if;
 delete from public.nucleus_admin_nominations where nucleus_id=target_nucleus and user_id=target_user;
 -- Um convite futuro devolve acesso ao espaço, sem restaurar consentimento individual por suposição.
 update public.nucleus_agreement_participants p set response='pending',responded_at=null,accepted_version=null
 from public.nucleus_agreements a where a.id=p.agreement_id and a.nucleus_id=target_nucleus and p.user_id=target_user;
 -- A escolha fica gravada nos registros existentes: retornar ou mudar a preferência nunca os reidentifica.
 if hidden then
  update public.nucleus_habit_moments h set authorship_hidden=true from public.nucleus_agreements a where a.id=h.agreement_id and a.nucleus_id=target_nucleus and h.author_id=target_user;
  update public.nucleus_events set authorship_hidden=true where nucleus_id=target_nucleus and created_by=target_user;
  update public.nucleus_event_participants p set authorship_hidden=true from public.nucleus_events e where e.id=p.event_id and e.nucleus_id=target_nucleus and p.user_id=target_user;
 end if;
 if not exists(select 1 from public.nucleus_members where nucleus_id=target_nucleus) then
  closed:=true;
  update public.nuclei set closed_at=clock_timestamp() where id=target_nucleus;
  update public.nucleus_invitations set revoked_at=coalesce(revoked_at,clock_timestamp()) where nucleus_id=target_nucleus;
  delete from public.nucleus_admin_nominations where nucleus_id=target_nucleus;
 elsif not exists(select 1 from public.nucleus_members where nucleus_id=target_nucleus and role='admin') then
  select user_id into promoted from public.nucleus_members where nucleus_id=target_nucleus order by random() limit 1;
  update public.nucleus_members set role='admin' where nucleus_id=target_nucleus and user_id=promoted;
  delete from public.nucleus_admin_nominations where nucleus_id=target_nucleus and user_id=promoted;
 end if;
 return jsonb_build_object('closed',closed,'promoted_user_id',promoted,'authorship_hidden',hidden);
end;$$;
revoke all on function public.depart_nucleus_member(uuid,uuid) from public,anon,authenticated;
create function public.leave_nucleus(target_nucleus uuid) returns jsonb language plpgsql security definer set search_path='' as $$
begin perform public.lock_nucleus_member(target_nucleus); return public.depart_nucleus_member(target_nucleus,auth.uid()); end;$$;
create function public.remove_nucleus_member(target_nucleus uuid,target_user uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 perform public.lock_nucleus_member(target_nucleus,true);
 if target_user=auth.uid() then raise exception 'use leave nucleus' using errcode='22023'; end if;
 perform public.depart_nucleus_member(target_nucleus,target_user);
end;$$;

drop policy "creators read their invitations" on public.nucleus_invitations;
create policy "administrators read invitations" on public.nucleus_invitations for select to authenticated using(exists(select 1 from public.nucleus_members m where m.nucleus_id=nucleus_invitations.nucleus_id and m.user_id=(select auth.uid()) and m.role='admin'));
create or replace function public.create_initial_invitation(target_nucleus uuid) returns text language plpgsql security definer set search_path='' as $$
declare code_result text;
begin
 perform public.lock_nucleus_member(target_nucleus,true);
 select code into code_result from public.nucleus_invitations where nucleus_id=target_nucleus and revoked_at is null and expires_at>clock_timestamp() order by created_at desc,id desc limit 1;
 if code_result is not null then return code_result; end if;
 code_result:=encode(extensions.gen_random_bytes(16),'hex');
 insert into public.nucleus_invitations(nucleus_id,code,created_by) values(target_nucleus,code_result,auth.uid());
 return code_result;
end;$$;
create or replace function public.revoke_nucleus_invitation(target_nucleus uuid,target_invitation uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 perform public.lock_nucleus_member(target_nucleus,true);
 update public.nucleus_invitations set revoked_at=coalesce(revoked_at,clock_timestamp()) where id=target_invitation and nucleus_id=target_nucleus;
 if not found then raise exception 'invitation unavailable' using errcode='P0002'; end if;
end;$$;
create or replace function public.inspect_invitation(invitation_code text) returns table(nucleus_id uuid,nucleus_name text,nucleus_type text,nucleus_purpose text) language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or invitation_code is null or invitation_code !~ '^[0-9a-f]{32}$' then raise exception 'authentication required or invalid code' using errcode='22023'; end if;
 return query select n.id,n.name,n.type,n.purpose from public.nucleus_invitations i join public.nuclei n on n.id=i.nucleus_id where i.code=invitation_code and i.revoked_at is null and i.expires_at>clock_timestamp() and n.closed_at is null;
end;$$;
create or replace function public.accept_invitation(invitation_code text) returns uuid language plpgsql security definer set search_path='' as $$
declare invitation public.nucleus_invitations; target uuid;
begin
 if auth.uid() is null or invitation_code is null or invitation_code !~ '^[0-9a-f]{32}$' then raise exception 'authentication required or invalid code' using errcode='22023'; end if;
 select i.nucleus_id into target from public.nucleus_invitations i where i.code=invitation_code;
 -- Ordem única: Núcleo antes do convite, evitando corrida/deadlock com fechamento e revogação.
 perform 1 from public.nuclei where id=target and closed_at is null for update;
 if not found then raise exception 'invitation unavailable' using errcode='P0002'; end if;
 select * into invitation from public.nucleus_invitations where code=invitation_code for update;
 if not found or invitation.revoked_at is not null or invitation.expires_at<=clock_timestamp() then raise exception 'invitation unavailable' using errcode='P0002'; end if;
 insert into public.nucleus_members(nucleus_id,user_id,role) values(target,auth.uid(),'member') on conflict(nucleus_id,user_id) do nothing;
 return target;
end;$$;

create or replace function public.create_nucleus_agreement(target_nucleus uuid,agreement_category text,agreement_title text,agreement_description text,agreement_timing text,agreement_frequency text,agreement_trial_days integer) returns uuid language plpgsql security definer set search_path='' as $$
declare result uuid;
begin
 perform public.lock_nucleus_member(target_nucleus);
 if agreement_category is null or agreement_category not in ('habit','experience') or agreement_title is null or char_length(btrim(agreement_title)) not between 1 and 100 or agreement_description is null or char_length(btrim(agreement_description)) not between 1 and 500 or agreement_timing is null or char_length(btrim(agreement_timing)) not between 1 and 120 or agreement_frequency is null or char_length(btrim(agreement_frequency)) not between 1 and 120 or (agreement_category='habit' and (agreement_trial_days is null or agreement_trial_days not between 7 and 30)) then raise exception 'invalid agreement fields' using errcode='22023'; end if;
 insert into public.nucleus_agreements(nucleus_id,created_by,category,title,description,timing,frequency,trial_days) values(target_nucleus,auth.uid(),agreement_category,btrim(agreement_title),btrim(agreement_description),btrim(agreement_timing),btrim(agreement_frequency),case when agreement_category='habit' then agreement_trial_days else null end) returning id into result;
 insert into public.nucleus_agreement_versions(agreement_id,version,title,description,timing,frequency) values(result,1,btrim(agreement_title),btrim(agreement_description),btrim(agreement_timing),btrim(agreement_frequency));
 -- Propor não aceita por ninguém, inclusive pelo autor. O aceite é uma ação individual explícita.
 return result;
end;$$;
create or replace function public.create_nucleus_agreement(target_nucleus uuid,agreement_category text,agreement_title text,agreement_description text,agreement_timing text,agreement_frequency text) returns uuid language plpgsql security definer set search_path='' as $$
begin return public.create_nucleus_agreement(target_nucleus,agreement_category,agreement_title,agreement_description,agreement_timing,agreement_frequency,7); end;$$;

create function public.lock_nucleus_agreement(target_agreement uuid,administrator_required boolean default false) returns void language plpgsql security definer set search_path='' as $$
declare target uuid;
begin
 select nucleus_id into target from public.nucleus_agreements where id=target_agreement;
 perform public.lock_nucleus_member(target,administrator_required);
 perform 1 from public.nucleus_agreements where id=target_agreement for update;
 if not found then raise exception 'agreement unavailable' using errcode='P0002'; end if;
end;$$;
revoke all on function public.lock_nucleus_agreement(uuid,boolean) from public,anon,authenticated;
create function public.respond_nucleus_agreement(target_agreement uuid,agreement_response text,expected_terms_version integer) returns void language plpgsql security definer set search_path='' as $$
declare version_now integer;
begin
 perform public.lock_nucleus_agreement(target_agreement);
 if agreement_response is null or agreement_response not in ('accepted','declined') then raise exception 'invalid response' using errcode='22023'; end if;
 select terms_version into version_now from public.nucleus_agreements where id=target_agreement and status in ('pending','testing','active');
 if not found then raise exception 'agreement unavailable' using errcode='P0002'; end if;
 if expected_terms_version is null or expected_terms_version<>version_now then raise exception 'agreement terms changed' using errcode='40001'; end if;
 insert into public.nucleus_agreement_participants(agreement_id,user_id,response,responded_at,accepted_version) values(target_agreement,auth.uid(),agreement_response,clock_timestamp(),case when agreement_response='accepted' then version_now else null end)
 on conflict(agreement_id,user_id) do update set response=excluded.response,responded_at=excluded.responded_at,accepted_version=excluded.accepted_version;
end;$$;
-- Um cliente antigo não pode aceitar termos que não mostrou ao usuário.
revoke all on function public.respond_nucleus_agreement(uuid,text) from public,anon,authenticated;
revoke all on function public.respond_nucleus_agreement(uuid,text,integer) from public,anon;
grant execute on function public.respond_nucleus_agreement(uuid,text,integer) to authenticated;
create function public.manage_nucleus_agreement(target_agreement uuid,agreement_action text,expected_terms_version integer) returns void language plpgsql security definer set search_path='' as $$
declare current_status text;
begin
 perform public.lock_nucleus_agreement(target_agreement,true);
 if expected_terms_version is null or not exists(select 1 from public.nucleus_agreements where id=target_agreement and terms_version=expected_terms_version) then raise exception 'agreement terms changed' using errcode='40001'; end if;
 select status into current_status from public.nucleus_agreements where id=target_agreement;
 if agreement_action='start_test' and current_status='pending' then
  update public.nucleus_agreements set status='testing',test_started_at=clock_timestamp() where id=target_agreement;
 elsif agreement_action='activate' and current_status='testing' then
  update public.nucleus_agreements set status='active' where id=target_agreement;
 elsif agreement_action='end' and current_status in ('pending','testing','active') then
  update public.nucleus_agreements set status='ended' where id=target_agreement;
 else raise exception 'invalid agreement transition' using errcode='22023'; end if;
end;$$;
create function public.update_nucleus_agreement_terms(target_agreement uuid,agreement_title text,agreement_description text,agreement_timing text,agreement_frequency text,expected_terms_version integer) returns integer language plpgsql security definer set search_path='' as $$
declare result integer;
begin
 perform public.lock_nucleus_agreement(target_agreement,true);
 if expected_terms_version is null or not exists(select 1 from public.nucleus_agreements where id=target_agreement and terms_version=expected_terms_version) then raise exception 'agreement terms changed' using errcode='40001'; end if;
 if agreement_title is null or char_length(btrim(agreement_title)) not between 1 and 100 or agreement_description is null or char_length(btrim(agreement_description)) not between 1 and 500 or agreement_timing is null or char_length(btrim(agreement_timing)) not between 1 and 120 or agreement_frequency is null or char_length(btrim(agreement_frequency)) not between 1 and 120 then raise exception 'invalid agreement fields' using errcode='22023'; end if;
 if not exists(select 1 from public.nucleus_agreements where id=target_agreement and status in ('pending','testing','active')) then raise exception 'agreement unavailable' using errcode='P0002'; end if;
 -- Salvar o mesmo combinado não deve redefinir o consentimento das pessoas.
 if exists(select 1 from public.nucleus_agreements where id=target_agreement and title=btrim(agreement_title) and description=btrim(agreement_description) and timing=btrim(agreement_timing) and frequency=btrim(agreement_frequency)) then raise exception 'agreement terms unchanged' using errcode='22023'; end if;
 update public.nucleus_agreements set title=btrim(agreement_title),description=btrim(agreement_description),timing=btrim(agreement_timing),frequency=btrim(agreement_frequency),terms_version=terms_version+1 where id=target_agreement returning terms_version into result;
 insert into public.nucleus_agreement_versions(agreement_id,version,title,description,timing,frequency) values(target_agreement,result,btrim(agreement_title),btrim(agreement_description),btrim(agreement_timing),btrim(agreement_frequency));
 -- Nem o administrador reutiliza aceite anterior após mudar os termos.
 update public.nucleus_agreement_participants set response='pending',responded_at=null,accepted_version=null where agreement_id=target_agreement;
 return result;
end;$$;
create or replace function public.record_nucleus_habit_moment(target_nucleus uuid,target_agreement uuid,moment_mood text,moment_note text) returns uuid language plpgsql security definer set search_path='' as $$
declare result uuid;
begin
 perform public.lock_nucleus_agreement(target_agreement);
 if moment_mood is null or moment_mood not in ('great','good','neutral','difficult') or moment_note is null or char_length(btrim(moment_note))>500 then raise exception 'invalid moment' using errcode='22023'; end if;
 if not exists(select 1 from public.nucleus_agreements a join public.nucleus_agreement_participants p on p.agreement_id=a.id where a.id=target_agreement and a.nucleus_id=target_nucleus and a.category='habit' and a.status in ('testing','active') and p.user_id=auth.uid() and p.response='accepted' and p.accepted_version=a.terms_version) then raise exception 'not authorized or current terms not accepted' using errcode='42501'; end if;
 insert into public.nucleus_habit_moments(agreement_id,author_id,mood,note) values(target_agreement,auth.uid(),moment_mood,nullif(btrim(moment_note),'')) returning id into result;
 return result;
end;$$;
create function public.get_nucleus_habit_moments(target_agreement uuid,before_created_at timestamptz default null,before_id uuid default null,page_size integer default 20)
returns table(id uuid,agreement_id uuid,author_id uuid,mood text,note text,created_at timestamptz,authorship_hidden boolean) language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not exists(select 1 from public.nucleus_agreements a join public.nucleus_members m on m.nucleus_id=a.nucleus_id where a.id=target_agreement and m.user_id=auth.uid()) then raise exception 'not authorized' using errcode='42501'; end if;
 if page_size is null or page_size not between 1 and 100 or (before_created_at is null)<>(before_id is null) then raise exception 'invalid pagination' using errcode='22023'; end if;
 return query select h.id,h.agreement_id,case when h.authorship_hidden then null::uuid else h.author_id end,h.mood,h.note,h.created_at,h.authorship_hidden from public.nucleus_habit_moments h where h.agreement_id=target_agreement and (before_created_at is null or (h.created_at,h.id)<(before_created_at,before_id)) order by h.created_at desc,h.id desc limit page_size;
end;$$;

-- RPCs anteriores continuam documentadas, mas o cliente não pode reintroduzir votação.
revoke all on function public.propose_nucleus_habit_trial(uuid,integer),public.respond_nucleus_habit_trial(uuid,text),public.confirm_nucleus_habit_trial(uuid),public.create_nucleus_habit_revision(uuid,text,text,text,text,text),public.respond_nucleus_habit_revision(uuid,text),public.apply_nucleus_habit_revision(uuid),public.can_apply_nucleus_habit_revision(uuid),public.get_nucleus_habit_trial_state(uuid) from public,anon,authenticated;

-- Identificadores internos de autoria não podem contornar o aviso de privacidade via REST/GraphQL.
do $$ declare table_name text; columns_allowed text; begin
 for table_name in select unnest(array['nuclei','nucleus_agreements','nucleus_invitations','nucleus_habit_revisions','nucleus_habit_trials']) loop
  select string_agg(format('%I',a.attname),',' order by a.attnum) into columns_allowed from pg_attribute a where a.attrelid=format('public.%I',table_name)::regclass and a.attnum>0 and not a.attisdropped and a.attname not in ('created_by','activated_by');
  execute format('revoke select on public.%I from authenticated',table_name);
  execute format('grant select (%s) on public.%I to authenticated',columns_allowed,table_name);
 end loop;
end;$$;
revoke select on public.nucleus_events,public.nucleus_event_participants from authenticated;
create function public.get_nucleus_calendar(target_nucleus uuid,from_ends_at timestamptz,page_offset integer default 0,page_size integer default 51)
returns table(id uuid,title text,intention text,starts_at timestamptz,ends_at timestamptz,time_zone text,created_by uuid,can_manage boolean,nucleus_event_participants jsonb)
language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not exists(select 1 from public.nucleus_members where nucleus_id=target_nucleus and user_id=auth.uid()) then raise exception 'not authorized' using errcode='42501'; end if;
 if from_ends_at is null or page_offset is null or page_offset<0 or page_size is null or page_size not between 1 and 100 then raise exception 'invalid pagination' using errcode='22023'; end if;
 return query select e.id,e.title,e.intention,e.starts_at,e.ends_at,e.time_zone,case when e.authorship_hidden then null::uuid else e.created_by end,
  e.created_by=auth.uid() or exists(select 1 from public.nucleus_members m where m.nucleus_id=target_nucleus and m.user_id=auth.uid() and m.role='admin'),
  coalesce((select jsonb_agg(jsonb_build_object('user_id',case when p.authorship_hidden then null::uuid else p.user_id end,'response',p.response,'is_own',p.user_id=auth.uid()) order by p.user_id) from public.nucleus_event_participants p where p.event_id=e.id),'[]'::jsonb)
 from public.nucleus_events e where e.nucleus_id=target_nucleus and e.ends_at>=from_ends_at order by e.starts_at,e.id offset page_offset limit page_size;
end;$$;

-- A agenda conserva suas validações anteriores; o bloqueio comum serializa gravações com saída.
do $$ declare definition text; signature regprocedure; begin
 select pg_get_functiondef('public.create_nucleus_event(uuid,text,text,timestamptz,timestamptz,text)'::regprocedure) into definition;
 execute replace(definition,E'begin\n',E'begin\n  perform public.lock_nucleus_member(target_nucleus);\n');
 for signature in select unnest(array['public.update_nucleus_event(uuid,text,text,timestamptz,timestamptz,text)'::regprocedure,'public.delete_nucleus_event(uuid)'::regprocedure,'public.respond_nucleus_event(uuid,text)'::regprocedure]) loop
  select pg_get_functiondef(signature) into definition;
  definition:=replace(definition,'''creator''','''admin''');
  execute replace(definition,E'begin\n',E'begin\n  perform public.lock_nucleus_member((select e.nucleus_id from public.nucleus_events e where e.id=target_event));\n');
 end loop;
end;$$;

-- Funções novas não herdam EXECUTE público. Helpers permanecem exclusivamente internos.
do $$ declare signature regprocedure; begin
 for signature in select p.oid::regprocedure from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname=any(array['get_my_privacy_preference','set_my_privacy_preference','get_nucleus_management','update_nucleus_details','nominate_nucleus_admin','respond_nucleus_admin_nomination','demote_nucleus_admin','leave_nucleus','remove_nucleus_member','manage_nucleus_agreement','update_nucleus_agreement_terms','get_nucleus_habit_moments','get_nucleus_calendar']) loop
  execute format('revoke all on function %s from public,anon',signature);
  execute format('grant execute on function %s to authenticated',signature);
 end loop;
end;$$;
