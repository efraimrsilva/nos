begin;

create function public.promote_nucleus_admin(target_nucleus uuid, target_user uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Usa a mesma trava e verificação de administração das demais mudanças de participação.
  perform public.lock_nucleus_member(target_nucleus, true);
  update public.nucleus_members
    set role = 'admin'
    where nucleus_id = target_nucleus and user_id = target_user and role = 'member';
  if not found then
    raise exception 'member unavailable' using errcode = 'P0002';
  end if;
  delete from public.nucleus_admin_nominations
    where nucleus_id = target_nucleus and user_id = target_user;
end;
$$;

revoke all on function public.promote_nucleus_admin(uuid, uuid) from public, anon, authenticated;
grant execute on function public.promote_nucleus_admin(uuid, uuid) to authenticated;

commit;
