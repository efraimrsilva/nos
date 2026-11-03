-- Totais compartilhados, sem divulgar identidades ou respostas individuais.
create function public.get_nucleus_agreement_response_counts(target_nucleus uuid, agreement_ids uuid[])
returns table(agreement_id uuid, accepted bigint, declined bigint, pending bigint)
language plpgsql stable security definer set search_path = '' as $$
begin
  if auth.uid() is null or not exists (
    select 1 from public.nucleus_members m join public.nuclei n on n.id=m.nucleus_id
    where m.nucleus_id=target_nucleus and m.user_id=auth.uid() and n.closed_at is null
  ) then raise exception 'not authorized' using errcode='42501'; end if;
  if agreement_ids is null or cardinality(agreement_ids)>50 then
    raise exception 'invalid agreement list' using errcode='22023';
  end if;
  -- Só integrantes atuais contam; aceitar termos antigos não equivale a aceitar a revisão atual.
  return query
    select a.id,
      count(*) filter(where p.response='accepted' and p.accepted_version=a.terms_version),
      count(*) filter(where p.response='declined'),
      count(*) filter(where p.response is null or p.response not in ('accepted','declined') or (p.response='accepted' and p.accepted_version is distinct from a.terms_version))
    from public.nucleus_agreements a
    join public.nucleus_members m on m.nucleus_id=a.nucleus_id
    left join public.nucleus_agreement_participants p on p.agreement_id=a.id and p.user_id=m.user_id
    where a.nucleus_id=target_nucleus and a.id=any(agreement_ids)
    group by a.id;
end;
$$;
revoke all on function public.get_nucleus_agreement_response_counts(uuid,uuid[]) from public,anon,authenticated;
grant execute on function public.get_nucleus_agreement_response_counts(uuid,uuid[]) to authenticated;
notify pgrst, 'reload schema';
