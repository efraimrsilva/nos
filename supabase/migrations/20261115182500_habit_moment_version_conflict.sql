-- O conflito é de termos exibidos, não uma falha de serialização para o cliente repetir.
create or replace function public.record_nucleus_habit_moment(
  target_nucleus uuid,
  target_agreement uuid,
  moment_mood text,
  moment_note text,
  expected_terms_version integer
) returns uuid language plpgsql security definer set search_path = '' as $$
begin
  perform public.lock_nucleus_agreement(target_agreement);
  if not exists (
    select 1 from public.nucleus_agreements
    where id = target_agreement and nucleus_id = target_nucleus
      and terms_version = expected_terms_version
  ) then
    raise exception 'agreement terms changed or unavailable' using errcode = 'PT409';
  end if;
  return public.record_nucleus_habit_moment(target_nucleus, target_agreement, moment_mood, moment_note);
end;
$$;

notify pgrst, 'reload schema';
