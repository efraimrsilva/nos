-- Totais gerais da própria pessoa: nenhuma lista, autoria ou identidade de terceiros sai desta função.
create function public.get_navigation_counts()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare actor uuid := auth.uid(); result jsonb;
begin
  if actor is null then raise exception 'not authorized' using errcode = '42501'; end if;
  -- A associação atual e o fechamento delimitam todas as áreas na mesma fotografia de leitura.
  with own_nuclei as materialized (
    select n.id from public.nuclei n
    join public.nucleus_members m on m.nucleus_id = n.id
    where m.user_id = actor and n.closed_at is null
  )
  select jsonb_build_object(
    'nuclei', (select count(*) from own_nuclei),
    'agreements', (select count(*) from public.nucleus_agreements a
      join own_nuclei n on n.id = a.nucleus_id
      join public.nucleus_agreement_participants p on p.agreement_id = a.id and p.user_id = actor
      where a.status in ('pending','testing','active') and p.response = 'accepted' and p.accepted_version = a.terms_version),
    'events', (select count(*) from public.nucleus_events e
      join own_nuclei n on n.id = e.nucleus_id
      join public.nucleus_event_participants p on p.event_id = e.id and p.user_id = actor
      where e.ends_at > now() and p.response in ('pending','accepted')),
    'people', (select count(distinct m.user_id) from public.nucleus_members m
      join own_nuclei n on n.id = m.nucleus_id where m.user_id <> actor)
  ) into result;
  return result;
end;
$$;
revoke all on function public.get_navigation_counts() from public, anon, authenticated;
grant execute on function public.get_navigation_counts() to authenticated;
notify pgrst, 'reload schema';
