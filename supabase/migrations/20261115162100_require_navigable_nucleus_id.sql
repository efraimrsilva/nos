-- Garante um identificador navegável também para pedidos fora da interface.
create or replace function public.create_nucleus_once(request_id uuid, nucleus_type text, nucleus_name text, nucleus_purpose text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  created_id uuid;
begin
  if actor is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;

  -- O mesmo formato é aceito pelos caminhos de Núcleo e de convite inicial.
  if request_id is null
    or request_id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    or nucleus_type is null
    or nucleus_type not in ('casal','familia','irmaos','pais','amigos','equipes','comunidades','mentorias','grupos-religiosos')
    or nucleus_name is null or char_length(btrim(nucleus_name)) not between 1 and 80
    or nucleus_purpose is null or char_length(btrim(nucleus_purpose)) not between 1 and 500 then
    raise exception 'invalid nucleus fields' using errcode = '22023';
  end if;

  insert into public.nuclei(id, type, name, purpose, created_by)
  values (request_id, nucleus_type, btrim(nucleus_name), btrim(nucleus_purpose), actor)
  on conflict (id) do nothing
  returning id into created_id;

  if created_id is not null then
    insert into public.nucleus_members(nucleus_id, user_id, role) values (created_id, actor, 'admin');
    return created_id;
  end if;

  -- Reenvio não devolve Núcleo alheio, encerrado ou vínculo que a conta já perdeu.
  if exists (
    select 1 from public.nuclei n
    join public.nucleus_members m on m.nucleus_id = n.id and m.user_id = actor
    where n.id = request_id and n.created_by = actor and n.closed_at is null
  ) then
    return request_id;
  end if;
  raise exception 'nucleus unavailable' using errcode = '42501';
end;
$$;
