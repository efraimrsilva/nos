-- Uma proposta pertence ao Núcleo; apenas unanimidade dos participantes a coloca em teste.
create table public.nucleus_agreements (
  id uuid primary key default gen_random_uuid(),
  nucleus_id uuid not null references public.nuclei(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  category text not null check (category in ('habit', 'experience')),
  title text not null check (char_length(btrim(title)) between 1 and 100),
  description text not null check (char_length(btrim(description)) between 1 and 500),
  timing text not null check (char_length(btrim(timing)) between 1 and 120),
  frequency text not null check (char_length(btrim(frequency)) between 1 and 120),
  status text not null default 'pending' check (status in ('pending', 'testing', 'declined')),
  created_at timestamptz not null default now()
);

create table public.nucleus_agreement_participants (
  agreement_id uuid not null references public.nucleus_agreements(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  response text not null default 'pending' check (response in ('pending', 'accepted', 'declined')),
  responded_at timestamptz,
  primary key (agreement_id, user_id)
);

create index nucleus_agreements_list_idx on public.nucleus_agreements(nucleus_id, category, created_at desc);
create index nucleus_agreement_participants_user_idx on public.nucleus_agreement_participants(user_id);

alter table public.nucleus_agreements enable row level security;
alter table public.nucleus_agreement_participants enable row level security;

create policy "members read nucleus agreements" on public.nucleus_agreements
  for select to authenticated using (
    exists (select 1 from public.nucleus_members m
      where m.nucleus_id = nucleus_agreements.nucleus_id and m.user_id = (select auth.uid()))
  );
create policy "members read own agreement response" on public.nucleus_agreement_participants
  for select to authenticated using (
    user_id = (select auth.uid()) and exists (
      select 1 from public.nucleus_agreements a join public.nucleus_members m on m.nucleus_id = a.nucleus_id
      where a.id = agreement_id and m.user_id = (select auth.uid()))
  );

revoke all on public.nucleus_agreements, public.nucleus_agreement_participants from anon, authenticated;
grant select on public.nucleus_agreements, public.nucleus_agreement_participants to authenticated;

create function public.create_nucleus_agreement(target_nucleus uuid, agreement_category text,
  agreement_title text, agreement_description text, agreement_timing text, agreement_frequency text)
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
  select count(*) into member_count from public.nucleus_members m where m.nucleus_id = target_nucleus;
  if member_count < 2 then raise exception 'at least two members required' using errcode = '22023'; end if;
  insert into public.nucleus_agreements(nucleus_id, created_by, category, title, description, timing, frequency)
    values (target_nucleus, actor, agreement_category, btrim(agreement_title), btrim(agreement_description),
      btrim(agreement_timing), btrim(agreement_frequency)) returning id into new_agreement;
  -- A fotografia de integrantes é feita na mesma transação; ninguém aceita por outra pessoa.
  insert into public.nucleus_agreement_participants(agreement_id, user_id, response, responded_at)
    select new_agreement, m.user_id, case when m.user_id = actor then 'accepted' else 'pending' end,
      case when m.user_id = actor then now() else null end
    from public.nucleus_members m where m.nucleus_id = target_nucleus;
  return new_agreement;
end;
$$;

create function public.respond_nucleus_agreement(target_agreement uuid, agreement_response text)
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
    update public.nucleus_agreements set status = 'testing' where id = target_agreement;
  end if;
end;
$$;

revoke all on function public.create_nucleus_agreement(uuid,text,text,text,text,text) from public, anon;
revoke all on function public.respond_nucleus_agreement(uuid,text) from public, anon;
grant execute on function public.create_nucleus_agreement(uuid,text,text,text,text,text) to authenticated;
grant execute on function public.respond_nucleus_agreement(uuid,text) to authenticated;
