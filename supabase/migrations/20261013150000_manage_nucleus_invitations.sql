-- Mesma porta de entrada: gerar serializa pelo Núcleo; aceitar/revogar pelo convite.
create or replace function public.create_initial_invitation(target_nucleus uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); new_code text;
begin
  if actor is null or not exists (select 1 from public.nucleus_members where nucleus_id=target_nucleus and user_id=actor and role='creator') then
    raise exception 'not authorized' using errcode='42501';
  end if;
  perform 1 from public.nuclei where id=target_nucleus for update;
  select code into new_code from public.nucleus_invitations
    where nucleus_id=target_nucleus and created_by=actor and revoked_at is null and expires_at>now()
    order by created_at desc, id desc limit 1;
  if new_code is not null then return new_code; end if;
  new_code := encode(extensions.gen_random_bytes(16),'hex');
  insert into public.nucleus_invitations(nucleus_id,code,created_by) values(target_nucleus,new_code,actor);
  return new_code;
end;
$$;

create function public.revoke_nucleus_invitation(target_nucleus uuid, target_invitation uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or not exists (select 1 from public.nucleus_members where nucleus_id=target_nucleus and user_id=auth.uid() and role='creator') then
    raise exception 'not authorized' using errcode='42501';
  end if;
  -- Atualizar obtém o mesmo bloqueio usado no aceite; repetir preserva a primeira data.
  update public.nucleus_invitations set revoked_at=coalesce(revoked_at,now())
    where id=target_invitation and nucleus_id=target_nucleus;
  if not found then raise exception 'invitation unavailable' using errcode='P0002'; end if;
end;
$$;

create or replace function public.accept_invitation(invitation_code text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare invitation public.nucleus_invitations; actor uuid := auth.uid();
begin
  if actor is null or invitation_code is null or invitation_code !~ '^[0-9a-f]{32}$' then
    raise exception 'authentication required or invalid code' using errcode='22023';
  end if;
  select * into invitation from public.nucleus_invitations where code=invitation_code for update;
  if not found or invitation.revoked_at is not null or invitation.expires_at<=clock_timestamp() then
    raise exception 'invitation unavailable' using errcode='P0002';
  end if;
  insert into public.nucleus_members(nucleus_id,user_id,role) values(invitation.nucleus_id,actor,'member')
    on conflict(nucleus_id,user_id) do nothing;
  return invitation.nucleus_id;
end;
$$;

revoke all on function public.revoke_nucleus_invitation(uuid,uuid) from public,anon;
grant execute on function public.revoke_nucleus_invitation(uuid,uuid) to authenticated;
revoke all on function public.create_initial_invitation(uuid), public.accept_invitation(text) from public,anon;
grant execute on function public.create_initial_invitation(uuid), public.accept_invitation(text) to authenticated;
