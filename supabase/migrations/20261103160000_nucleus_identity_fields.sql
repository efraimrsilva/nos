-- Formulários independentes devem preservar o campo que a pessoa não está editando.
create function public.update_nucleus_identity(target_nucleus uuid, identity_field text, identity_value text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform public.lock_nucleus_member(target_nucleus, true);
  if identity_field is null or identity_field not in ('name', 'purpose') or identity_value is null
     or char_length(btrim(identity_value)) not between 1 and (case when identity_field = 'name' then 80 else 500 end) then
    raise exception 'invalid identity field' using errcode = '22023';
  end if;
  if identity_field = 'name' then
    update public.nuclei set name = btrim(identity_value) where id = target_nucleus;
  else
    update public.nuclei set purpose = btrim(identity_value) where id = target_nucleus;
  end if;
end; $$;
revoke all on function public.update_nucleus_identity(uuid, text, text) from public, anon;
grant execute on function public.update_nucleus_identity(uuid, text, text) to authenticated;
