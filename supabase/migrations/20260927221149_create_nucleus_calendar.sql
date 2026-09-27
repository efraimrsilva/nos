-- Agenda interna: eventos e respostas são sempre vinculados a um Núcleo.
create table public.nucleus_events (
  id uuid primary key default gen_random_uuid(),
  nucleus_id uuid not null references public.nuclei(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  title text not null check (char_length(btrim(title)) between 1 and 100),
  intention text not null default '' check (char_length(btrim(intention)) <= 500),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  time_zone text not null,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.nucleus_event_participants (
  event_id uuid not null references public.nucleus_events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  response text not null default 'pending' check (response in ('pending', 'accepted', 'declined')),
  responded_at timestamptz,
  primary key (event_id, user_id)
);

create index nucleus_events_upcoming_idx on public.nucleus_events(nucleus_id, starts_at);

alter table public.nucleus_events enable row level security;
alter table public.nucleus_event_participants enable row level security;

-- A leitura é comum aos integrantes; mutações passam por RPCs que conferem auth.uid().
create policy "members read nucleus events" on public.nucleus_events
  for select to authenticated using (
    exists (select 1 from public.nucleus_members m
      where m.nucleus_id = nucleus_events.nucleus_id and m.user_id = (select auth.uid()))
  );
create policy "members read event responses" on public.nucleus_event_participants
  for select to authenticated using (
    exists (select 1 from public.nucleus_events e
      join public.nucleus_members m on m.nucleus_id = e.nucleus_id
      where e.id = event_id and m.user_id = (select auth.uid()))
  );

revoke all on public.nucleus_events, public.nucleus_event_participants from anon, authenticated;
grant select on public.nucleus_events, public.nucleus_event_participants to authenticated;

create function public.create_nucleus_event(target_nucleus uuid, event_title text, event_intention text,
  event_starts_at timestamptz, event_ends_at timestamptz, event_time_zone text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  new_event uuid;
begin
  if actor is null or not exists (select 1 from public.nucleus_members m
    where m.nucleus_id = target_nucleus and m.user_id = actor) then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  if event_title is null or char_length(btrim(event_title)) not between 1 and 100
    or event_intention is null or char_length(btrim(event_intention)) > 500
    or event_starts_at is null or event_ends_at is null or event_ends_at <= event_starts_at or event_ends_at <= now()
    or not exists (select 1 from pg_catalog.pg_timezone_names where name = event_time_zone) then
    raise exception 'invalid event fields' using errcode = '22023';
  end if;
  insert into public.nucleus_events(nucleus_id, created_by, title, intention, starts_at, ends_at, time_zone)
    values (target_nucleus, actor, btrim(event_title), btrim(event_intention), event_starts_at, event_ends_at, event_time_zone)
    returning id into new_event;
  -- Convite interno para os integrantes atuais; ninguém recebe confirmação automática em nome de outra pessoa.
  insert into public.nucleus_event_participants(event_id, user_id, response, responded_at)
    select new_event, m.user_id, case when m.user_id = actor then 'accepted' else 'pending' end,
      case when m.user_id = actor then now() else null end
    from public.nucleus_members m where m.nucleus_id = target_nucleus;
  return new_event;
end;
$$;

create function public.update_nucleus_event(target_event uuid, event_title text, event_intention text,
  event_starts_at timestamptz, event_ends_at timestamptz, event_time_zone text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  target_nucleus uuid;
  author uuid;
  previous_start timestamptz;
  previous_end timestamptz;
begin
  select e.nucleus_id, e.created_by, e.starts_at, e.ends_at
    into target_nucleus, author, previous_start, previous_end
    from public.nucleus_events e where e.id = target_event for update;
  if actor is null or target_nucleus is null or not exists (select 1 from public.nucleus_members m
    where m.nucleus_id = target_nucleus and m.user_id = actor and (m.role = 'creator' or actor = author)) then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  if event_title is null or char_length(btrim(event_title)) not between 1 and 100
    or event_intention is null or char_length(btrim(event_intention)) > 500
    or event_starts_at is null or event_ends_at is null or event_ends_at <= event_starts_at or event_ends_at <= now()
    or not exists (select 1 from pg_catalog.pg_timezone_names where name = event_time_zone) then
    raise exception 'invalid event fields' using errcode = '22023';
  end if;
  update public.nucleus_events set title = btrim(event_title), intention = btrim(event_intention),
    starts_at = event_starts_at, ends_at = event_ends_at, time_zone = event_time_zone where id = target_event;
  -- Um novo horário exige nova resposta dos demais participantes.
  if previous_start <> event_starts_at or previous_end <> event_ends_at then
    update public.nucleus_event_participants set response = 'pending', responded_at = null
      where event_id = target_event and user_id <> actor;
  end if;
end;
$$;

create function public.delete_nucleus_event(target_event uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
begin
  delete from public.nucleus_events e where e.id = target_event and exists (
    select 1 from public.nucleus_members m where m.nucleus_id = e.nucleus_id
      and m.user_id = actor and (m.role = 'creator' or e.created_by = actor));
  if not found then raise exception 'not authorized' using errcode = '42501'; end if;
end;
$$;

create function public.respond_nucleus_event(target_event uuid, event_response text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
begin
  if event_response is null or event_response not in ('accepted', 'declined') then
    raise exception 'invalid response' using errcode = '22023';
  end if;
  -- Serializa a resposta com remarcações e remoções do mesmo evento.
  perform 1 from public.nucleus_events e where e.id = target_event for update;
  update public.nucleus_event_participants p set response = event_response, responded_at = now()
    from public.nucleus_events e, public.nucleus_members m
    where p.event_id = target_event and p.user_id = actor and e.id = p.event_id
      and m.nucleus_id = e.nucleus_id and m.user_id = actor;
  if not found then raise exception 'not authorized' using errcode = '42501'; end if;
end;
$$;

revoke all on function public.create_nucleus_event(uuid,text,text,timestamptz,timestamptz,text) from public, anon;
revoke all on function public.update_nucleus_event(uuid,text,text,timestamptz,timestamptz,text) from public, anon;
revoke all on function public.delete_nucleus_event(uuid) from public, anon;
revoke all on function public.respond_nucleus_event(uuid,text) from public, anon;
grant execute on function public.create_nucleus_event(uuid,text,text,timestamptz,timestamptz,text) to authenticated;
grant execute on function public.update_nucleus_event(uuid,text,text,timestamptz,timestamptz,text) to authenticated;
grant execute on function public.delete_nucleus_event(uuid) to authenticated;
grant execute on function public.respond_nucleus_event(uuid,text) to authenticated;
