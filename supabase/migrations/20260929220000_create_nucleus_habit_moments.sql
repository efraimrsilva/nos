-- O registro é uma memória simples do hábito em teste, sem pontuação ou avaliação de pessoas.
create table public.nucleus_habit_moments (
  id uuid primary key default gen_random_uuid(),
  agreement_id uuid not null references public.nucleus_agreements(id) on delete cascade,
  author_id uuid not null references auth.users(id),
  mood text not null check (mood in ('great', 'good', 'neutral', 'difficult')),
  note text check (note is null or char_length(note) between 1 and 500),
  created_at timestamptz not null default now()
);

create index nucleus_habit_moments_history_idx on public.nucleus_habit_moments(agreement_id, created_at desc, id desc);
alter table public.nucleus_habit_moments enable row level security;

-- A leitura é coletiva dentro do Núcleo; a autoria continua explícita no histórico.
create policy "members read nucleus habit moments" on public.nucleus_habit_moments
  for select to authenticated using (
    exists (select 1 from public.nucleus_agreements a
      join public.nucleus_members m on m.nucleus_id = a.nucleus_id
      where a.id = agreement_id and m.user_id = (select auth.uid()))
  );

revoke all on public.nucleus_habit_moments from anon, authenticated;
grant select on public.nucleus_habit_moments to authenticated;

create function public.record_nucleus_habit_moment(target_nucleus uuid, target_agreement uuid,
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
  -- O bloqueio acompanha a transição de estado do acordo para impedir gravação após o teste.
  select a.status into agreement_status from public.nucleus_agreements a
    where a.id = target_agreement and a.nucleus_id = target_nucleus and a.category = 'habit' for share;
  if agreement_status is distinct from 'testing' or not exists (
    select 1 from public.nucleus_members m where m.nucleus_id = target_nucleus and m.user_id = actor
  ) or not exists (
    select 1 from public.nucleus_agreement_participants p
      where p.agreement_id = target_agreement and p.user_id = actor and p.response = 'accepted'
  ) then
    raise exception 'not authorized or habit not in testing' using errcode = '42501';
  end if;
  insert into public.nucleus_habit_moments(agreement_id, author_id, mood, note)
    values (target_agreement, actor, moment_mood, nullif(btrim(moment_note), '')) returning id into new_moment;
  return new_moment;
end;
$$;

revoke all on function public.record_nucleus_habit_moment(uuid,uuid,text,text) from public, anon;
grant execute on function public.record_nucleus_habit_moment(uuid,uuid,text,text) to authenticated;
