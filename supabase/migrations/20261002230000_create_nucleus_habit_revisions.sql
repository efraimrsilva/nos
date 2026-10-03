alter table public.nucleus_agreements drop constraint nucleus_agreements_status_check;
alter table public.nucleus_agreements add constraint nucleus_agreements_status_check
  check (status in ('pending','testing','declined','ended'));

-- Revisões preservam o compromisso proposto; encerrar não apaga momentos.
create table public.nucleus_habit_revisions (
 id uuid primary key default gen_random_uuid(),
 agreement_id uuid not null references public.nucleus_agreements(id) on delete cascade,
 created_by uuid not null references auth.users(id),
 kind text not null check(kind in ('adjust','end')),
 title text, description text, timing text, frequency text,
 status text not null default 'pending' check(status in ('pending','declined','applied')),
 created_at timestamptz not null default now(),
 reflect_until timestamptz not null default (now()+interval '7 days'),
 applied_at timestamptz,
 check(kind='end' or (title is not null and char_length(btrim(title)) between 1 and 100
  and description is not null and char_length(btrim(description)) between 1 and 500
  and timing is not null and char_length(btrim(timing)) between 1 and 120
  and frequency is not null and char_length(btrim(frequency)) between 1 and 120))
);
create unique index nucleus_habit_revision_pending_idx on public.nucleus_habit_revisions(agreement_id) where status='pending';
create index nucleus_habit_revision_history_idx on public.nucleus_habit_revisions(agreement_id,created_at desc);
create table public.nucleus_habit_revision_responses (
 revision_id uuid not null references public.nucleus_habit_revisions(id) on delete cascade,
 user_id uuid not null references auth.users(id),
 response text not null default 'pending' check(response in ('pending','accepted','declined')),
 responded_at timestamptz,
 primary key(revision_id,user_id)
);
alter table public.nucleus_habit_revisions enable row level security;
alter table public.nucleus_habit_revision_responses enable row level security;
create policy "members read habit revisions" on public.nucleus_habit_revisions for select to authenticated
 using(exists(select 1 from public.nucleus_agreements a where a.id=agreement_id));
create policy "members read own revision response" on public.nucleus_habit_revision_responses for select to authenticated
 using(user_id=(select auth.uid()) and exists(select 1 from public.nucleus_habit_revisions r where r.id=revision_id));
revoke all on public.nucleus_habit_revisions,public.nucleus_habit_revision_responses from anon,authenticated;
grant select on public.nucleus_habit_revisions,public.nucleus_habit_revision_responses to authenticated;

create function public.create_nucleus_habit_revision(target_agreement uuid,revision_kind text,
 revision_title text,revision_description text,revision_timing text,revision_frequency text)
returns uuid language plpgsql security definer set search_path='' as $$
declare a public.nucleus_agreements; actor uuid:=auth.uid(); r uuid;
begin
 -- Todas as escritas bloqueiam primeiro o Hábito, depois a revisão: ordem única evita deadlock.
 select * into a from public.nucleus_agreements where id=target_agreement for update;
 if actor is null or a.id is null or a.status<>'testing' or a.category<>'habit'
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

create function public.respond_nucleus_habit_revision(target_revision uuid,revision_response text)
returns void language plpgsql security definer set search_path='' as $$
declare a public.nucleus_agreements; r public.nucleus_habit_revisions; actor uuid:=auth.uid();
begin
 select a0.* into a from public.nucleus_agreements a0 join public.nucleus_habit_revisions r0 on r0.agreement_id=a0.id where r0.id=target_revision for update of a0;
 select * into r from public.nucleus_habit_revisions where id=target_revision for update;
 if actor is null or r.id is null or r.status<>'pending' or a.status<>'testing'
  or not exists(select 1 from public.nucleus_members m where m.nucleus_id=a.nucleus_id and m.user_id=actor)
 then raise exception 'not authorized' using errcode='42501'; end if;
 if revision_response is null or revision_response not in ('accepted','declined') then raise exception 'invalid response' using errcode='22023'; end if;
 update public.nucleus_habit_revision_responses set response=revision_response,responded_at=now()
 where revision_id=r.id and user_id=actor and response='pending';
 if not found then raise exception 'response unavailable' using errcode='42501'; end if;
 if revision_response='declined' then update public.nucleus_habit_revisions set status='declined' where id=r.id; end if;
end $$;

create function public.apply_nucleus_habit_revision(target_revision uuid)
returns void language plpgsql security definer set search_path='' as $$
declare a public.nucleus_agreements; r public.nucleus_habit_revisions; actor uuid:=auth.uid();
begin
 select a0.* into a from public.nucleus_agreements a0 join public.nucleus_habit_revisions r0 on r0.agreement_id=a0.id where r0.id=target_revision for update of a0;
 select * into r from public.nucleus_habit_revisions where id=target_revision for update;
 if actor is null or r.id is null or r.status<>'pending' or a.status<>'testing'
  or not exists(select 1 from public.nucleus_members m where m.nucleus_id=a.nucleus_id and m.user_id=actor)
  or not exists(select 1 from public.nucleus_habit_revision_responses p where p.revision_id=r.id and p.user_id=actor and p.response='accepted')
 then raise exception 'not authorized' using errcode='42501'; end if;
 if now()<r.reflect_until or not exists(select 1 from public.nucleus_habit_revision_responses p where p.revision_id=r.id)
  or exists(select 1 from public.nucleus_habit_revision_responses p where p.revision_id=r.id and
   (p.response<>'accepted' or not exists(select 1 from public.nucleus_members m where m.nucleus_id=a.nucleus_id and m.user_id=p.user_id)))
 then raise exception 'consent or reflection pending' using errcode='22023'; end if;
 if r.kind='end' then update public.nucleus_agreements set status='ended' where id=a.id;
 else update public.nucleus_agreements set title=r.title,description=r.description,timing=r.timing,frequency=r.frequency where id=a.id; end if;
 update public.nucleus_habit_revisions set status='applied',applied_at=now() where id=r.id;
end $$;
revoke all on function public.create_nucleus_habit_revision(uuid,text,text,text,text,text) from public,anon;
revoke all on function public.respond_nucleus_habit_revision(uuid,text) from public,anon;
revoke all on function public.apply_nucleus_habit_revision(uuid) from public,anon;
grant execute on function public.create_nucleus_habit_revision(uuid,text,text,text,text,text) to authenticated;
grant execute on function public.respond_nucleus_habit_revision(uuid,text) to authenticated;
grant execute on function public.apply_nucleus_habit_revision(uuid) to authenticated;

-- Consulta agregada para a UI: não revela identidades nem votos de outras pessoas.
create function public.can_apply_nucleus_habit_revision(target_revision uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.nucleus_habit_revisions r
  join public.nucleus_agreements a on a.id=r.agreement_id
  where r.id=target_revision and r.status='pending' and a.status='testing'
   and now()>=r.reflect_until
   and exists(select 1 from public.nucleus_members m where m.nucleus_id=a.nucleus_id and m.user_id=(select auth.uid()))
   and exists(select 1 from public.nucleus_habit_revision_responses p where p.revision_id=r.id and p.user_id=(select auth.uid()) and p.response='accepted')
   and not exists(select 1 from public.nucleus_habit_revision_responses p where p.revision_id=r.id and
    (p.response<>'accepted' or not exists(select 1 from public.nucleus_members m where m.nucleus_id=a.nucleus_id and m.user_id=p.user_id)))
 );
$$;
revoke all on function public.can_apply_nucleus_habit_revision(uuid) from public,anon;
grant execute on function public.can_apply_nucleus_habit_revision(uuid) to authenticated;
