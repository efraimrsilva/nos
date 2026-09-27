create extension if not exists pgcrypto with schema extensions;

create table public.nuclei (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('casal', 'familia', 'irmaos', 'pais', 'amigos', 'equipes', 'comunidades', 'mentorias', 'grupos-religiosos')),
  name text not null check (char_length(btrim(name)) between 1 and 80),
  purpose text not null check (char_length(btrim(purpose)) between 1 and 500),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.nucleus_members (
  nucleus_id uuid not null references public.nuclei(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('creator', 'member')),
  joined_at timestamptz not null default now(),
  primary key (nucleus_id, user_id)
);

create table public.nucleus_invitations (
  id uuid primary key default gen_random_uuid(),
  nucleus_id uuid not null references public.nuclei(id) on delete cascade,
  code text not null unique,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  revoked_at timestamptz
);

create index nucleus_members_user_idx on public.nucleus_members(user_id);
create index nucleus_invitations_nucleus_idx on public.nucleus_invitations(nucleus_id);

alter table public.nuclei enable row level security;
alter table public.nucleus_members enable row level security;
alter table public.nucleus_invitations enable row level security;

create policy "members read their membership" on public.nucleus_members
  for select to authenticated using (user_id = (select auth.uid()));
create policy "members read their nuclei" on public.nuclei
  for select to authenticated using (
    exists (select 1 from public.nucleus_members m where m.nucleus_id = id and m.user_id = (select auth.uid()))
  );
create policy "creators read their invitations" on public.nucleus_invitations
  for select to authenticated using (created_by = (select auth.uid()));

revoke all on public.nuclei, public.nucleus_members, public.nucleus_invitations from anon, authenticated;
grant select on public.nuclei, public.nucleus_members, public.nucleus_invitations to authenticated;

create function public.create_nucleus(nucleus_type text, nucleus_name text, nucleus_purpose text)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  new_id uuid;
  actor uuid := auth.uid();
begin
  if actor is null then raise exception 'authentication required' using errcode = '28000'; end if;
  if nucleus_type not in ('casal', 'familia', 'irmaos', 'pais', 'amigos', 'equipes', 'comunidades', 'mentorias', 'grupos-religiosos')
    or char_length(btrim(nucleus_name)) not between 1 and 80
    or char_length(btrim(nucleus_purpose)) not between 1 and 500 then
    raise exception 'invalid nucleus fields' using errcode = '22023';
  end if;
  insert into public.nuclei(type, name, purpose, created_by)
    values (nucleus_type, btrim(nucleus_name), btrim(nucleus_purpose), actor) returning id into new_id;
  insert into public.nucleus_members(nucleus_id, user_id, role) values (new_id, actor, 'creator');
  return new_id;
end;
$$;

create function public.create_initial_invitation(target_nucleus uuid)
returns text
language plpgsql security definer set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  new_code text;
begin
  if actor is null or not exists (
    select 1 from public.nucleus_members where nucleus_id = target_nucleus and user_id = actor and role = 'creator'
  ) then raise exception 'not authorized' using errcode = '42501'; end if;
  select code into new_code from public.nucleus_invitations
    where nucleus_id = target_nucleus and created_by = actor and revoked_at is null and expires_at > now()
    order by created_at desc limit 1;
  if new_code is not null then return new_code; end if;
  new_code := encode(extensions.gen_random_bytes(16), 'hex');
  insert into public.nucleus_invitations(nucleus_id, code, created_by) values (target_nucleus, new_code, actor);
  return new_code;
end;
$$;

revoke all on function public.create_nucleus(text, text, text) from public, anon;
revoke all on function public.create_initial_invitation(uuid) from public, anon;
grant execute on function public.create_nucleus(text, text, text) to authenticated;
grant execute on function public.create_initial_invitation(uuid) to authenticated;

create function public.inspect_invitation(invitation_code text)
returns table(nucleus_id uuid, nucleus_name text, nucleus_type text, nucleus_purpose text)
language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null or invitation_code !~ '^[0-9a-f]{32}$' then
    raise exception 'authentication required or invalid code' using errcode = '22023';
  end if;
  return query select n.id, n.name, n.type, n.purpose
    from public.nucleus_invitations i join public.nuclei n on n.id = i.nucleus_id
    where i.code = invitation_code and i.revoked_at is null and i.expires_at > now();
end;
$$;

create function public.accept_invitation(invitation_code text)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  target uuid;
  actor uuid := auth.uid();
begin
  if actor is null or invitation_code !~ '^[0-9a-f]{32}$' then
    raise exception 'authentication required or invalid code' using errcode = '22023';
  end if;
  select nucleus_id into target from public.nucleus_invitations
    where code = invitation_code and revoked_at is null and expires_at > now();
  if target is null then raise exception 'invitation unavailable' using errcode = 'P0002'; end if;
  insert into public.nucleus_members(nucleus_id, user_id, role)
    values (target, actor, 'member') on conflict (nucleus_id, user_id) do nothing;
  return target;
end;
$$;

revoke all on function public.inspect_invitation(text) from public, anon;
revoke all on function public.accept_invitation(text) from public, anon;
grant execute on function public.inspect_invitation(text) to authenticated;
grant execute on function public.accept_invitation(text) to authenticated;
