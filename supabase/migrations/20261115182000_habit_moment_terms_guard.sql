-- O Angular vincula o envio à versão mostrada. A assinatura de quatro argumentos ainda atende o Next.js.
create function public.record_nucleus_habit_moment(
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
    raise exception 'agreement terms changed or unavailable' using errcode = '40001';
  end if;
  -- A mesma transação mantém as travas; a função original revalida estado, aceite e conteúdo.
  return public.record_nucleus_habit_moment(target_nucleus, target_agreement, moment_mood, moment_note);
end;
$$;

revoke all on function public.record_nucleus_habit_moment(uuid,uuid,text,text,integer) from public,anon,authenticated;
grant execute on function public.record_nucleus_habit_moment(uuid,uuid,text,text,integer) to authenticated;
notify pgrst, 'reload schema';
