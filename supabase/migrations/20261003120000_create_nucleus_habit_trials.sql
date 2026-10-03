alter table public.nucleus_agreements add column trial_days integer check(trial_days between 7 and 30);
alter table public.nucleus_agreements drop constraint nucleus_agreements_status_check;
alter table public.nucleus_agreements add constraint nucleus_agreements_status_check
 check(status in ('pending','testing','active','declined','ended'));

-- Cada ciclo guarda o combinado e os envolvidos; um ajuste nunca reaproveita confirmações.
create table public.nucleus_habit_trials (
 id uuid primary key default gen_random_uuid(),
 agreement_id uuid not null references public.nucleus_agreements(id) on delete cascade,
 created_by uuid not null references auth.users(id),
 days integer not null check(days between 7 and 30),
 status text not null check(status in ('pending','testing','active','declined','superseded','ended')),
 title text not null, description text not null, timing text not null, frequency text not null,
 participant_count integer not null check(participant_count>=2),
 required_votes integer generated always as (case when participant_count>150 then (participant_count+2)/3 else participant_count/2+1 end) stored,
 created_at timestamptz not null default now(),
 started_at timestamptz, ends_at timestamptz, activated_at timestamptz,
 activated_by uuid references auth.users(id),
 check ((started_at is null)=(ends_at is null)),
 check(ends_at is null or ends_at=started_at+days*interval '1 day'),
 check(status not in ('testing','active') or started_at is not null)
);
create unique index nucleus_habit_trial_current_idx on public.nucleus_habit_trials(agreement_id)
 where status in ('pending','testing','active');
create index nucleus_habit_trial_history_idx on public.nucleus_habit_trials(agreement_id,created_at desc,id desc);
create table public.nucleus_habit_trial_responses (
 trial_id uuid not null references public.nucleus_habit_trials(id) on delete cascade,
 user_id uuid not null references auth.users(id),
 setup_response text not null check(setup_response in ('pending','accepted','declined')),
 setup_at timestamptz,
 confirmed_at timestamptz,
 primary key(trial_id,user_id)
);
alter table public.nucleus_habit_trials enable row level security;
alter table public.nucleus_habit_trial_responses enable row level security;
create policy "members read habit trials" on public.nucleus_habit_trials for select to authenticated
 using(exists(select 1 from public.nucleus_agreements a where a.id=agreement_id));
create policy "members read own trial response" on public.nucleus_habit_trial_responses for select to authenticated
 using(user_id=(select auth.uid()) and exists(select 1 from public.nucleus_habit_trials t where t.id=trial_id));
revoke all on public.nucleus_habit_trials,public.nucleus_habit_trial_responses from anon,authenticated;
grant select on public.nucleus_habit_trials,public.nucleus_habit_trial_responses to authenticated;

-- Helper privado: as RPCs autorizadas já bloqueiam o Hábito antes de chamá-lo.
create function public.insert_nucleus_habit_trial(target_agreement uuid,days integer,pending_setup boolean)
returns uuid language plpgsql security definer set search_path='' as $$
declare a public.nucleus_agreements; t uuid; n integer;
begin
 select * into a from public.nucleus_agreements where id=target_agreement;
 select count(*) into n from public.nucleus_agreement_participants where agreement_id=a.id;
 insert into public.nucleus_habit_trials(agreement_id,created_by,days,status,title,description,timing,frequency,participant_count,started_at,ends_at)
 values(a.id,auth.uid(),days,case when pending_setup then 'pending' else 'testing' end,
 a.title,a.description,a.timing,a.frequency,n,case when not pending_setup then now() end,
 case when not pending_setup then now()+days*interval '1 day' end) returning id into t;
 insert into public.nucleus_habit_trial_responses(trial_id,user_id,setup_response,setup_at)
 select t,p.user_id,case when not pending_setup or p.user_id=auth.uid() then 'accepted' else 'pending' end,
 case when not pending_setup or p.user_id=auth.uid() then now() end
 from public.nucleus_agreement_participants p where p.agreement_id=a.id;
 return t;
end $$;
revoke all on function public.insert_nucleus_habit_trial(uuid,integer,boolean) from public,anon,authenticated;

create function public.propose_nucleus_habit_trial(target_agreement uuid,trial_days integer)
returns uuid language plpgsql security definer set search_path='' as $$
declare a public.nucleus_agreements;
begin
 select * into a from public.nucleus_agreements where id=target_agreement for update;
 if auth.uid() is null or a.id is null or a.category<>'habit' or a.status<>'testing'
 or not exists(select 1 from public.nucleus_members where nucleus_id=a.nucleus_id and user_id=auth.uid())
 or not exists(select 1 from public.nucleus_agreement_participants where agreement_id=a.id and user_id=auth.uid() and response='accepted')
 or exists(select 1 from public.nucleus_agreement_participants p where p.agreement_id=a.id and not exists(select 1 from public.nucleus_members m where m.nucleus_id=a.nucleus_id and m.user_id=p.user_id))
 then raise exception 'not authorized or participant unavailable' using errcode='42501'; end if;
 if trial_days is null or trial_days not between 7 and 30
 or exists(select 1 from public.nucleus_habit_trials where agreement_id=a.id and status in ('pending','testing','active'))
 or exists(select 1 from public.nucleus_habit_revisions where agreement_id=a.id and status='pending')
 then raise exception 'trial unavailable' using errcode='22023'; end if;
 return public.insert_nucleus_habit_trial(a.id,trial_days,true);
end $$;

create function public.respond_nucleus_habit_trial(target_trial uuid,trial_response text)
returns void language plpgsql security definer set search_path='' as $$
declare a public.nucleus_agreements; t public.nucleus_habit_trials;
begin
 select a0.* into a from public.nucleus_agreements a0 join public.nucleus_habit_trials t0 on t0.agreement_id=a0.id where t0.id=target_trial for update of a0;
 select * into t from public.nucleus_habit_trials where id=target_trial for update;
 if auth.uid() is null or t.id is null or t.status<>'pending' or a.status<>'testing'
 or not exists(select 1 from public.nucleus_members where nucleus_id=a.nucleus_id and user_id=auth.uid())
 then raise exception 'not authorized' using errcode='42501'; end if;
 if trial_response is null or trial_response not in ('accepted','declined')
 or exists(select 1 from public.nucleus_habit_revisions where agreement_id=a.id and status='pending')
 then raise exception 'invalid response or revision pending' using errcode='22023'; end if;
 if exists(select 1 from public.nucleus_habit_trial_responses p where p.trial_id=t.id and not exists(select 1 from public.nucleus_members m where m.nucleus_id=a.nucleus_id and m.user_id=p.user_id))
 then raise exception 'participant unavailable' using errcode='42501'; end if;
 update public.nucleus_habit_trial_responses set setup_response=trial_response,setup_at=now()
 where trial_id=t.id and user_id=auth.uid() and setup_response='pending';
 if not found then raise exception 'response unavailable' using errcode='42501'; end if;
 if trial_response='declined' then update public.nucleus_habit_trials set status='declined' where id=t.id;
 elsif not exists(select 1 from public.nucleus_habit_trial_responses where trial_id=t.id and setup_response<>'accepted') then
  update public.nucleus_habit_trials set status='testing',started_at=now(),ends_at=now()+days*interval '1 day' where id=t.id;
  update public.nucleus_agreements set trial_days=t.days where id=a.id;
 end if;
end $$;

create function public.confirm_nucleus_habit_trial(target_trial uuid)
returns void language plpgsql security definer set search_path='' as $$
declare a public.nucleus_agreements; t public.nucleus_habit_trials; votes integer;
begin
 -- Ordem de bloqueio igual à revisão: confirmar e revisar não podem vencer simultaneamente.
 select a0.* into a from public.nucleus_agreements a0 join public.nucleus_habit_trials t0 on t0.agreement_id=a0.id where t0.id=target_trial for update of a0;
 select * into t from public.nucleus_habit_trials where id=target_trial for update;
 if auth.uid() is null or t.id is null or t.status<>'testing' or a.status<>'testing'
 or not exists(select 1 from public.nucleus_members where nucleus_id=a.nucleus_id and user_id=auth.uid())
 or not exists(select 1 from public.nucleus_habit_trial_responses where trial_id=t.id and user_id=auth.uid() and setup_response='accepted')
 then raise exception 'not authorized' using errcode='42501'; end if;
 if now()<t.ends_at or exists(select 1 from public.nucleus_habit_revisions where agreement_id=a.id and status='pending')
 then raise exception 'trial or revision pending' using errcode='22023'; end if;
 if exists(select 1 from public.nucleus_habit_trial_responses p where p.trial_id=t.id and not exists(select 1 from public.nucleus_members m where m.nucleus_id=a.nucleus_id and m.user_id=p.user_id))
 then raise exception 'participant unavailable' using errcode='42501'; end if;
 update public.nucleus_habit_trial_responses set confirmed_at=now()
 where trial_id=t.id and user_id=auth.uid() and confirmed_at is null;
 if not found then raise exception 'already confirmed' using errcode='22023'; end if;
 select count(*) into votes from public.nucleus_habit_trial_responses where trial_id=t.id and confirmed_at is not null;
 -- Até 150: maioria absoluta; acima de 150: um terço arredondado para cima. Denominador fixo do ciclo. Ausência de resposta não vira voto e não diminui a maioria exigida.
 if votes>=t.required_votes then
  update public.nucleus_habit_trials set status='active',activated_at=now(),activated_by=auth.uid() where id=t.id;
  update public.nucleus_agreements set status='active' where id=a.id;
 end if;
end $$;

-- Agregados públicos ao Núcleo; votos de outras pessoas continuam sob RLS.
create function public.get_nucleus_habit_trial_state(target_agreement uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare a public.nucleus_agreements; t public.nucleus_habit_trials; p public.nucleus_habit_trial_responses; eligible boolean; blocked boolean;
begin
 select * into a from public.nucleus_agreements where id=target_agreement;
 if auth.uid() is null or a.id is null or not exists(select 1 from public.nucleus_members where nucleus_id=a.nucleus_id and user_id=auth.uid()) then return null; end if;
 select * into t from public.nucleus_habit_trials where agreement_id=a.id and status in ('pending','testing','active');
 if t.id is null then return null; end if;
 select * into p from public.nucleus_habit_trial_responses where trial_id=t.id and user_id=auth.uid();
 eligible:=not exists(select 1 from public.nucleus_habit_trial_responses r where r.trial_id=t.id and not exists(select 1 from public.nucleus_members m where m.nucleus_id=a.nucleus_id and m.user_id=r.user_id));
 blocked:=exists(select 1 from public.nucleus_habit_revisions where agreement_id=a.id and status='pending');
 return jsonb_build_object('id',t.id,'status',t.status,'days',t.days,'started_at',t.started_at,'ends_at',t.ends_at,
 'activated_at',t.activated_at,'participants',t.participant_count,'required',t.required_votes,
 'votes',(select count(*) from public.nucleus_habit_trial_responses where trial_id=t.id and confirmed_at is not null),
 'own_setup',p.setup_response,'own_confirmed',p.confirmed_at is not null,'participants_available',eligible,'revision_pending',blocked,
 'can_confirm',t.status='testing' and a.status='testing' and now()>=t.ends_at and p.setup_response='accepted' and p.confirmed_at is null and eligible and not blocked,
 'can_respond',t.status='pending' and a.status='testing' and p.setup_response='pending' and eligible and not blocked);
end $$;

revoke all on function public.propose_nucleus_habit_trial(uuid,integer), public.respond_nucleus_habit_trial(uuid,text),
 public.confirm_nucleus_habit_trial(uuid),public.get_nucleus_habit_trial_state(uuid) from public,anon;
grant execute on function public.propose_nucleus_habit_trial(uuid,integer), public.respond_nucleus_habit_trial(uuid,text),
 public.confirm_nucleus_habit_trial(uuid),public.get_nucleus_habit_trial_state(uuid) to authenticated;

create function public.create_nucleus_agreement(target_nucleus uuid, agreement_category text,
  agreement_title text, agreement_description text, agreement_timing text, agreement_frequency text, agreement_trial_days integer)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  new_agreement uuid;
  member_count integer;
begin
  if actor is null or not exists (select 1 from public.nucleus_members m
    where m.nucleus_id = target_nucleus and m.user_id = actor) then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  if agreement_category is null or agreement_category not in ('habit', 'experience')
    or agreement_title is null or char_length(btrim(agreement_title)) not between 1 and 100
    or agreement_description is null or char_length(btrim(agreement_description)) not between 1 and 500
    or agreement_timing is null or char_length(btrim(agreement_timing)) not between 1 and 120
    or agreement_frequency is null or char_length(btrim(agreement_frequency)) not between 1 and 120 then
    raise exception 'invalid agreement fields' using errcode = '22023';
  end if;
  if (agreement_category='habit' and (agreement_trial_days is null or agreement_trial_days not between 7 and 30))
    or (agreement_category='experience' and agreement_trial_days is not null) then
    raise exception 'explicit trial duration required for habits' using errcode='22023';
  end if;
  select count(*) into member_count from public.nucleus_members m where m.nucleus_id = target_nucleus;
  if member_count < 2 then raise exception 'at least two members required' using errcode = '22023'; end if;
  insert into public.nucleus_agreements(nucleus_id, created_by, category, title, description, timing, frequency, trial_days)
    values (target_nucleus, actor, agreement_category, btrim(agreement_title), btrim(agreement_description),
      btrim(agreement_timing), btrim(agreement_frequency), agreement_trial_days) returning id into new_agreement;
  -- A fotografia de integrantes é feita na mesma transação; ninguém aceita por outra pessoa.
  insert into public.nucleus_agreement_participants(agreement_id, user_id, response, responded_at)
    select new_agreement, m.user_id, case when m.user_id = actor then 'accepted' else 'pending' end,
      case when m.user_id = actor then now() else null end
    from public.nucleus_members m where m.nucleus_id = target_nucleus;
  return new_agreement;
end;
$$;


-- Compatibilidade da assinatura anterior para Experiências; Hábito agora requer duração explícita.
create or replace function public.create_nucleus_agreement(target_nucleus uuid,agreement_category text,
 agreement_title text,agreement_description text,agreement_timing text,agreement_frequency text)
returns uuid language sql security definer set search_path='' as $$
 select public.create_nucleus_agreement(target_nucleus,agreement_category,agreement_title,agreement_description,agreement_timing,agreement_frequency,null::integer);
$$;
revoke all on function public.create_nucleus_agreement(uuid,text,text,text,text,text,integer) from public,anon;
grant execute on function public.create_nucleus_agreement(uuid,text,text,text,text,text,integer) to authenticated;
create or replace function public.respond_nucleus_agreement(target_agreement uuid, agreement_response text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  target_nucleus uuid;
  current_status text;
begin
  if agreement_response is null or agreement_response not in ('accepted', 'declined') then
    raise exception 'invalid response' using errcode = '22023';
  end if;
  -- O bloqueio serializa respostas simultâneas antes de conferir unanimidade.
  select a.nucleus_id, a.status into target_nucleus, current_status
    from public.nucleus_agreements a where a.id = target_agreement for update;
  if actor is null or current_status <> 'pending' or not exists (
    select 1 from public.nucleus_members m where m.nucleus_id = target_nucleus and m.user_id = actor) then
    raise exception 'not authorized or proposal closed' using errcode = '42501';
  end if;
  update public.nucleus_agreement_participants p set response = agreement_response, responded_at = now()
    where p.agreement_id = target_agreement and p.user_id = actor and p.response = 'pending';
  if not found then raise exception 'response unavailable' using errcode = '42501'; end if;
  if agreement_response = 'declined' then
    update public.nucleus_agreements set status = 'declined' where id = target_agreement;
  elsif not exists (select 1 from public.nucleus_agreement_participants p
    where p.agreement_id = target_agreement and p.response <> 'accepted') then
    -- O último aceite inicia apenas o teste cuja duração foi apresentada na proposta.
    if exists(select 1 from public.nucleus_agreements where id=target_agreement and category='habit' and trial_days is not null) then
      if exists(select 1 from public.nucleus_agreement_participants p where p.agreement_id=target_agreement and
        not exists(select 1 from public.nucleus_members m where m.nucleus_id=target_nucleus and m.user_id=p.user_id)) then
        raise exception 'participant unavailable' using errcode='42501';
      end if;
      perform public.insert_nucleus_habit_trial(target_agreement,(select trial_days from public.nucleus_agreements where id=target_agreement),false);
    end if;
    update public.nucleus_agreements set status = 'testing' where id = target_agreement;
  end if;
end;
$$;

create or replace function public.record_nucleus_habit_moment(target_nucleus uuid, target_agreement uuid,
  moment_mood text, moment_note text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  agreement_status text;
  new_moment uuid;
begin
  if actor is null or moment_mood is null or moment_mood not in ('great', 'good', 'neutral', 'difficult')
    or moment_note is null or char_length(btrim(moment_note)) > 500 then
    raise exception 'invalid moment' using errcode = '22023';
  end if;
  -- O bloqueio acompanha a transição de estado do acordo para impedir gravação após o encerramento.
  select a.status into agreement_status from public.nucleus_agreements a
    where a.id = target_agreement and a.nucleus_id = target_nucleus and a.category = 'habit' for share;
  if (agreement_status is null or agreement_status not in ('testing','active')) or not exists (
    select 1 from public.nucleus_members m where m.nucleus_id = target_nucleus and m.user_id = actor
  ) or not exists (
    select 1 from public.nucleus_agreement_participants p
      where p.agreement_id = target_agreement and p.user_id = actor and p.response = 'accepted'
  ) then
    raise exception 'not authorized or habit unavailable' using errcode = '42501';
  end if;
  insert into public.nucleus_habit_moments(agreement_id, author_id, mood, note)
    values (target_agreement, actor, moment_mood, nullif(btrim(moment_note), '')) returning id into new_moment;
  return new_moment;
end;
$$;

create or replace function public.create_nucleus_habit_revision(target_agreement uuid,revision_kind text,
 revision_title text,revision_description text,revision_timing text,revision_frequency text)
returns uuid language plpgsql security definer set search_path='' as $$
declare a public.nucleus_agreements; actor uuid:=auth.uid(); r uuid;
begin
 -- Todas as escritas bloqueiam primeiro o Hábito, depois a revisão: ordem única evita deadlock.
 select * into a from public.nucleus_agreements where id=target_agreement for update;
 if actor is null or a.id is null or a.status not in ('testing','active') or a.category<>'habit'
  or not exists(select 1 from public.nucleus_members m where m.nucleus_id=a.nucleus_id and m.user_id=actor)
  or not exists(select 1 from public.nucleus_agreement_participants p where p.agreement_id=a.id and p.user_id=actor and p.response='accepted')
 then raise exception 'not authorized' using errcode='42501'; end if;
 if revision_kind is null or revision_kind not in ('adjust','end') or (revision_kind='adjust' and (
  revision_title is null or char_length(btrim(revision_title)) not between 1 and 100 or
  revision_description is null or char_length(btrim(revision_description)) not between 1 and 500 or
  revision_timing is null or char_length(btrim(revision_timing)) not between 1 and 120 or
  revision_frequency is null or char_length(btrim(revision_frequency)) not between 1 and 120))
 then raise exception 'invalid revision' using errcode='22023'; end if;
 if revision_kind='adjust' and (a.title,a.description,a.timing,a.frequency)=
  (btrim(revision_title),btrim(revision_description),btrim(revision_timing),btrim(revision_frequency))
 then raise exception 'no changes' using errcode='22023'; end if;
 -- A revisão exige os envolvidos originais; saída de participante não vira aceite implícito.
 if exists(select 1 from public.nucleus_agreement_participants p where p.agreement_id=a.id and
  not exists(select 1 from public.nucleus_members m where m.nucleus_id=a.nucleus_id and m.user_id=p.user_id))
 then raise exception 'participant unavailable' using errcode='42501'; end if;
 insert into public.nucleus_habit_revisions(agreement_id,created_by,kind,title,description,timing,frequency)
 values(a.id,actor,revision_kind,case when revision_kind='adjust' then btrim(revision_title) end,
  case when revision_kind='adjust' then btrim(revision_description) end,
  case when revision_kind='adjust' then btrim(revision_timing) end,
  case when revision_kind='adjust' then btrim(revision_frequency) end) returning id into r;
 insert into public.nucleus_habit_revision_responses(revision_id,user_id,response,responded_at)
 select r,p.user_id,case when p.user_id=actor then 'accepted' else 'pending' end,
  case when p.user_id=actor then now() end from public.nucleus_agreement_participants p where p.agreement_id=a.id;
 return r;
end $$;

create or replace function public.respond_nucleus_habit_revision(target_revision uuid,revision_response text)
returns void language plpgsql security definer set search_path='' as $$
declare a public.nucleus_agreements; r public.nucleus_habit_revisions; actor uuid:=auth.uid();
begin
 select a0.* into a from public.nucleus_agreements a0 join public.nucleus_habit_revisions r0 on r0.agreement_id=a0.id where r0.id=target_revision for update of a0;
 select * into r from public.nucleus_habit_revisions where id=target_revision for update;
 if actor is null or r.id is null or r.status<>'pending' or a.status not in ('testing','active')
  or not exists(select 1 from public.nucleus_members m where m.nucleus_id=a.nucleus_id and m.user_id=actor)
 then raise exception 'not authorized' using errcode='42501'; end if;
 if revision_response is null or revision_response not in ('accepted','declined') then raise exception 'invalid response' using errcode='22023'; end if;
 update public.nucleus_habit_revision_responses set response=revision_response,responded_at=now()
 where revision_id=r.id and user_id=actor and response='pending';
 if not found then raise exception 'response unavailable' using errcode='42501'; end if;
 if revision_response='declined' then update public.nucleus_habit_revisions set status='declined' where id=r.id; end if;
end $$;

create or replace function public.apply_nucleus_habit_revision(target_revision uuid)
returns void language plpgsql security definer set search_path='' as $$
declare a public.nucleus_agreements; r public.nucleus_habit_revisions; actor uuid:=auth.uid();
begin
 select a0.* into a from public.nucleus_agreements a0 join public.nucleus_habit_revisions r0 on r0.agreement_id=a0.id where r0.id=target_revision for update of a0;
 select * into r from public.nucleus_habit_revisions where id=target_revision for update;
 if actor is null or r.id is null or r.status<>'pending' or a.status not in ('testing','active')
  or not exists(select 1 from public.nucleus_members m where m.nucleus_id=a.nucleus_id and m.user_id=actor)
  or not exists(select 1 from public.nucleus_habit_revision_responses p where p.revision_id=r.id and p.user_id=actor and p.response='accepted')
 then raise exception 'not authorized' using errcode='42501'; end if;
 if now()<r.reflect_until or not exists(select 1 from public.nucleus_habit_revision_responses p where p.revision_id=r.id)
  or exists(select 1 from public.nucleus_habit_revision_responses p where p.revision_id=r.id and
   (p.response<>'accepted' or not exists(select 1 from public.nucleus_members m where m.nucleus_id=a.nucleus_id and m.user_id=p.user_id)))
 then raise exception 'consent or reflection pending' using errcode='22023'; end if;
 -- Fechar o ciclo e seus votos antes de aplicar mudança preserva o histórico sem reutilizar consentimento.
 update public.nucleus_habit_trials set status=case when r.kind='end' then 'ended' else 'superseded' end
 where agreement_id=a.id and status in ('pending','testing','active');
 if r.kind='end' then update public.nucleus_agreements set status='ended' where id=a.id;
 else update public.nucleus_agreements set title=r.title,description=r.description,timing=r.timing,frequency=r.frequency,status='testing' where id=a.id;
  if a.trial_days is not null then perform public.insert_nucleus_habit_trial(a.id,a.trial_days,false); end if;
 end if;
 update public.nucleus_habit_revisions set status='applied',applied_at=now() where id=r.id;
end $$;
revoke all on function public.create_nucleus_habit_revision(uuid,text,text,text,text,text) from public,anon;
revoke all on function public.respond_nucleus_habit_revision(uuid,text) from public,anon;
revoke all on function public.apply_nucleus_habit_revision(uuid) from public,anon;
grant execute on function public.create_nucleus_habit_revision(uuid,text,text,text,text,text) to authenticated;
grant execute on function public.respond_nucleus_habit_revision(uuid,text) to authenticated;
grant execute on function public.apply_nucleus_habit_revision(uuid) to authenticated;

-- Consulta agregada para a UI: não revela identidades nem votos de outras pessoas.
create or replace function public.can_apply_nucleus_habit_revision(target_revision uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.nucleus_habit_revisions r
  join public.nucleus_agreements a on a.id=r.agreement_id
  where r.id=target_revision and r.status='pending' and a.status in ('testing','active')
   and now()>=r.reflect_until
   and exists(select 1 from public.nucleus_members m where m.nucleus_id=a.nucleus_id and m.user_id=(select auth.uid()))
   and exists(select 1 from public.nucleus_habit_revision_responses p where p.revision_id=r.id and p.user_id=(select auth.uid()) and p.response='accepted')
   and not exists(select 1 from public.nucleus_habit_revision_responses p where p.revision_id=r.id and
    (p.response<>'accepted' or not exists(select 1 from public.nucleus_members m where m.nucleus_id=a.nucleus_id and m.user_id=p.user_id)))
 );
$$;
revoke all on function public.can_apply_nucleus_habit_revision(uuid) from public,anon;
grant execute on function public.can_apply_nucleus_habit_revision(uuid) to authenticated;
