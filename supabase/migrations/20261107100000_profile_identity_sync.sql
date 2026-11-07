-- Um único resumo por sessão evita consultar individualmente cada lista a cada ciclo.
-- Nenhum nome, e-mail ou outro metadado é retornado por esta função.
create function public.get_nucleus_identity_version()
returns text language plpgsql stable security definer set search_path='' as $$
declare
  viewer uuid := auth.uid();
  identity_version text;
begin
  if viewer is null then
    raise exception 'not authenticated' using errcode='42501';
  end if;

  -- O definer lê Auth, mas limita a seleção ao próprio usuário e aos vínculos atuais
  -- de Núcleos compartilhados. O chamador não escolhe contas ou Núcleos de terceiros.
  with visible_nuclei as materialized (
    select n.id,n.name,n.purpose
    from public.nuclei n
    join public.nucleus_members own on own.nucleus_id=n.id
    where own.user_id=viewer
  ), visible_ids as (
    select viewer as user_id
    union
    select m.user_id from public.nucleus_members m
    join visible_nuclei n on n.id=m.nucleus_id
  ), visible_people as (
    select u.id,coalesce(nullif(btrim(u.raw_user_meta_data->>'name'),''),
      nullif(btrim(u.raw_user_meta_data->>'display_name'),''),'Participante') as display_name
    from visible_ids v join auth.users u on u.id=v.user_id
  )
  -- A ordenação e os arrays JSON distinguem campos sem ambiguidades de concatenação.
  -- MD5 é somente detector de mudança, nunca credencial ou regra de autorização.
  select md5(jsonb_build_object(
    'nuclei',coalesce((select jsonb_agg(jsonb_build_array(id,name,purpose) order by id) from visible_nuclei),'[]'::jsonb),
    'people',coalesce((select jsonb_agg(jsonb_build_array(id,display_name) order by id) from visible_people),'[]'::jsonb)
  )::text) into identity_version;
  return identity_version;
end;
$$;
revoke all on function public.get_nucleus_identity_version() from public,anon,authenticated;
grant execute on function public.get_nucleus_identity_version() to authenticated;
