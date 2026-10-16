-- Encerramento administrativo preserva conteúdo e contas, retirando o acesso de todos.
create function public.close_nucleus(target_nucleus uuid, confirmation_name text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  -- A mesma trava serializa encerramento, convites, saídas e alterações administrativas.
  perform public.lock_nucleus_member(target_nucleus, true);
  if confirmation_name is null or btrim(confirmation_name) <> (select name from public.nuclei where id=target_nucleus) then
    raise exception 'confirmation name does not match' using errcode='22023';
  end if;

  update public.nuclei set closed_at=clock_timestamp() where id=target_nucleus;
  update public.nucleus_invitations set revoked_at=coalesce(revoked_at,clock_timestamp()) where nucleus_id=target_nucleus;
  delete from public.nucleus_admin_nominations where nucleus_id=target_nucleus;
  -- As políticas de leitura exigem associação: remover vínculos bloqueia também consultas brutas.
  -- Não chamar a saída individual: encerrar não sorteia sucessor nem altera o conteúdo histórico.
  delete from public.nucleus_members where nucleus_id=target_nucleus;
end;
$$;
revoke all on function public.close_nucleus(uuid,text) from public,anon,authenticated;
grant execute on function public.close_nucleus(uuid,text) to authenticated;
